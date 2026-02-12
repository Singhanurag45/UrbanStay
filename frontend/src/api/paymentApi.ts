import api from "./axios";

type CreateOrderPayload = {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
};

export const createPaymentOrder = async (payload: CreateOrderPayload) => {
  const response = await api.post("/payments/create-order", payload);
  return response.data as {
    orderId: string;
    paymentSessionId: string;
  };
};

export const confirmPayment = async (orderId: string) => {
  const response = await api.post("/payments/confirm", { orderId });
  return response.data as {
    message: string;
    bookingId?: string;
  };
};

