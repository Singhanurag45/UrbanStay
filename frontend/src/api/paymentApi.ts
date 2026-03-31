import api from "./axios";
import {
  confirmPaymentPayloadSchema,
  createOrderPayloadSchema,
} from "../validation/zodSchemas";

type CreateOrderPayload = {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
};

const rejectValidation = (message: string) => {
  return Promise.reject({
    response: {
      status: 400,
      data: { message },
    },
  });
};

export const createPaymentOrder = async (payload: CreateOrderPayload) => {
  const parsed = createOrderPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.post("/payments/create-order", payload);
  return response.data as {
    orderId: string;
    paymentSessionId: string;
  };
};

export const confirmPayment = async (orderId: string) => {
  const parsed = confirmPaymentPayloadSchema.safeParse({ orderId });
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.post("/payments/confirm", { orderId });
  return response.data as {
    message: string;
    bookingId?: string;
  };
};

