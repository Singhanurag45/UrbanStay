import api from "./axios";
import { cancelBookingPayloadSchema } from "../validation/zodSchemas";

const rejectValidation = (message: string) => {
  return Promise.reject({
    response: {
      status: 400,
      data: { message },
    },
  });
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getALLBookings = async () => {
  const response = await api.get("/bookings/all");
  return response.data.data;
};

export const cancelBooking = async (bookingId: string) => {
  const parsed = cancelBookingPayloadSchema.safeParse({ bookingId });
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data; 
};
