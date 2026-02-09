import api from "./axios";

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getALLBookings = async () => {
  const response = await api.get("/bookings/all");
  return response.data.data;
};
