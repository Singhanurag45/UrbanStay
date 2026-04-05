import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id format");

const isoDateString = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date");

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authSignupRequestSchema = z.object({
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  email: z.string().email(),
  password: z.string().min(6),
});

export const authSignupVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit code"),
});

export const hotelIdParamSchema = z.object({
  hotelId: objectId,
});

export const idParamSchema = z.object({
  id: objectId,
});

export const usersDeleteParamSchema = z.object({
  userId: objectId,
});

export const cancelBookingParamSchema = z.object({
  id: objectId,
});

export const searchHotelsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  destination: z.string().min(1).optional(),
  facilities: z
    .union([z.string().min(1), z.array(z.string().min(1))])
    .optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export const createBookingBodySchema = z
  .object({
    hotelId: objectId,
    checkIn: isoDateString,
    checkOut: isoDateString,
    totalCost: z.coerce.number().positive(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export const createOrderBodySchema = z
  .object({
    hotelId: objectId,
    checkIn: isoDateString,
    checkOut: isoDateString,
    adultCount: z.coerce.number().int().min(1),
    childCount: z.coerce.number().int().min(0),
    customerPhone: z.string().optional(),
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
    {
      message: "Stay duration cannot be more than 30 days",
    },
  );

export const confirmPaymentBodySchema = z.object({
  orderId: z.string().min(1),
});

// For multipart/form-data requests coming from multer:
// values arrive as strings, so we use z.coerce.number().
export const myHotelBodySchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  adultCount: z.coerce.number().int().min(1),
  childCount: z.coerce.number().int().min(0),
  pricePerNight: z.coerce.number().positive(),
  starRating: z.coerce.number().min(1).max(5),

  // facilities are sent as part of multipart payload by UI code.
  // Depending on how the browser/multer parses the field names, the shape can vary,
  // so we keep it permissive here.
  facilities: z.unknown().optional(),
});
