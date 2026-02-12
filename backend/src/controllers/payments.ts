import { Request, Response } from "express";
import mongoose from "mongoose";
import { Cashfree, CFEnvironment } from "cashfree-pg";

import Hotel from "../models/hotel";
import Booking from "../models/booking";
import HotelAvailability from "../models/hotelAvailability";
import PaymentIntent from "../models/paymentIntent";

// Shared date range helper (kept in sync with bookings controller)
const getDatesBetween = (start: Date, end: Date) => {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current < end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Initialise Cashfree client (v5 style)
const cashfree = new Cashfree(
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

// Calculate total amount on the backend (must match frontend logic)
const calculateTotalAmount = (pricePerNight: number, checkIn: Date, checkOut: Date) => {
  const nights =
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

  if (nights <= 0) {
    throw new Error("Invalid date range");
  }

  const basePrice = (nights * pricePerNight);
  const tax = Math.round(basePrice * 0.12);
  const serviceFee = 500;

  return {
    nights,
    basePrice,
    tax,
    serviceFee,
    total: basePrice + tax + serviceFee,
  };
};

// 1) Create Cashfree order and store a PaymentIntent
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { hotelId, checkIn, checkOut, adultCount, childCount } = req.body;
    
    
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);


    const pricing = calculateTotalAmount(hotel.pricePerNight, start, end);

    // Use a unique order id per payment
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const requestBody: any = {
      order_id: orderId,
      order_amount: pricing.total,
      order_currency: "INR",
      customer_details: {
        customer_id: req.userId,
        // Cashfree requires at least a phone in customer_details
        customer_phone: (req.body.customerPhone as string) || "9999999999",
      },
      order_meta: {
        // Cashfree will replace {order_id} placeholder
        return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-status?order_id={order_id}`,
      },
    };

    const cfResponse = await cashfree.PGCreateOrder(requestBody);
    const data = cfResponse.data as any;

    if (!data || !data.payment_session_id) {
      return res
        .status(500)
        .json({ message: "Failed to create payment order" });
    }

    await PaymentIntent.create({
      orderId,
      userId: req.userId,
      hotelId,
      checkIn: start,
      checkOut: end,
      adultCount,
      childCount,
      amount: pricing.total,
      currency: "INR",
      status: "created",
    });

    res.status(200).json({
      orderId,
      paymentSessionId: data.payment_session_id,
    });
  } catch (error: any) {
    const cashfreeError = error?.response?.data;
    console.error("Create payment order error:", cashfreeError || error);
    res.status(500).json({
      message: "Failed to create payment order",
      cashfreeError: cashfreeError || null,
    });
  }
};

// 2) Confirm payment with Cashfree and create Booking once paid
export const confirmPayment = async (req: Request, res: Response) => {
  const { orderId } = req.body as { orderId: string };

  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const intent = await PaymentIntent.findOne({ orderId }).session(session);

      if (!intent) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Payment intent not found" });
      }

      // Idempotency: if already paid, just return existing booking
      if (intent.status === "paid" && intent.bookingId) {
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
          message: "Payment already confirmed",
          bookingId: intent.bookingId,
        });
      }

      // Fetch order details from Cashfree
      const cfOrderRes = await cashfree.PGFetchOrder(orderId);
      const orderData = cfOrderRes.data as any;

      const orderStatus = orderData?.order_status;
      // const orderStatus = "PAID";

      if (
        orderStatus !== "PAID" &&
        orderStatus !== "COMPLETED" &&
        orderStatus !== "SUCCESS"
      ) {
        intent.status = "failed";
        await intent.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(400).json({
          message: "Payment not completed",
          status: orderStatus,
        });
      }

      // Payment successful - create booking using same locking logic

      const hotel = await Hotel.findById(intent.hotelId).session(session);
      if (!hotel) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Hotel not found" });
      }

      const dates = getDatesBetween(intent.checkIn, intent.checkOut);

      const availabilityDocs = dates.map((date) => ({
        hotelId: intent.hotelId,
        date,
      }));

      await HotelAvailability.insertMany(availabilityDocs, { session });

      const [booking] = await Booking.create(
        [
          {
            hotelId: intent.hotelId,
            userId: intent.userId,
            checkIn: intent.checkIn,
            checkOut: intent.checkOut,
            totalCost: intent.amount,
          },
        ],
        { session }
      );

      intent.status = "paid";
      intent.bookingId = booking._id;
      await intent.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Payment confirmed and booking created",
        bookingId: booking._id,
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      const labels: string[] | undefined = error?.errorLabelSet
        ? Array.from(error.errorLabelSet)
        : error?.errorLabels;

      const isTransient =
        labels?.includes("TransientTransactionError") ||
        error?.codeName === "WriteConflict";

      if (!isTransient || attempt === MAX_RETRIES) {
        console.error("Confirm payment error:", error);
        return res
          .status(500)
          .json({ message: "Failed to confirm payment" });
      }

      // Small backoff before retrying on transient error
      const delayMs = 100 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // Then loop will retry the transaction
    }
  }
}

