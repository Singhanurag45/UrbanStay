import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id format");
const isoDateString = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date");

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupRequestPayloadSchema = z.object({
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupVerifyPayloadSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit code"),
});

export const createOrderPayloadSchema = z
  .object({
    hotelId: objectId,
    checkIn: isoDateString,
    checkOut: isoDateString,
    adultCount: z.number().int().min(1),
    childCount: z.number().int().min(0),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const diffMs =
        new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime();
      const days = diffMs / (1000 * 60 * 60 * 24);
      return days <= 30;
    },
    { message: "Stay duration cannot be more than 30 days" },
  );

export const confirmPaymentPayloadSchema = z.object({
  orderId: z.string().min(1),
});

export const cancelBookingPayloadSchema = z.object({
  bookingId: objectId,
});

export const adminHotelFormSchema = z.object({
  name: z.string().min(1, "name is required"),
  city: z.string().min(1, "city is required"),
  country: z.string().min(1, "country is required"),
  description: z.string().min(1, "description is required"),
  type: z.string().min(1, "type is required"),
  pricePerNight: z.coerce.number().positive(),
  starRating: z.coerce.number().int().min(1).max(5),
  facilities: z.array(z.string().min(1)).optional(),
  adultCount: z.coerce.number().int().min(1),
  childCount: z.coerce.number().int().min(0),
});
