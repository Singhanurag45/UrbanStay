import api from "./axios";

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getALLBookings = async () => {
  const response = await api.get("/bookings/all");
  return response.data.data;
};

export const cancelBooking = async (bookingId: string) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data; 
};
