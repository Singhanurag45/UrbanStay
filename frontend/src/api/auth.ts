import api from "./axios";
import {
  loginPayloadSchema,
  signupRequestPayloadSchema,
  signupVerifyPayloadSchema,
} from "../validation/zodSchemas";

const rejectValidation = (message: string) => {
  return Promise.reject({
    response: {
      status: 400,
      data: { message },
    },
  });
};

/* ================= LOGIN ================= */
export const loginUser = async (data: { email: string; password: string }) => {
  const parsed = loginPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.post("/auth/login", data);
  return response.data as {
    userId: string;
    role: "user" | "admin";
  };
};

/* ================= SIGNUP OTP REQUEST ================= */
export const requestSignupOtp = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const parsed = signupRequestPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.post("/auth/register/request-otp", data);
  return response.data as { message: string };
};

/* ================= SIGNUP OTP VERIFY ================= */
export const verifySignupOtp = async (data: { email: string; otp: string }) => {
  const parsed = signupVerifyPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return rejectValidation(parsed.error.issues[0]?.message || "Invalid input");
  }
  const response = await api.post("/auth/register/verify-otp", data);
  return response.data as {
    message: string;
    userId: string;
    role: "user" | "admin";
  };
};

/* ================= LOGOUT ================= */
export const logoutUser = async () => {
  await api.post("/auth/logout");
};

/* ================= TOKEN VALIDATION ================= */
export const validateToken = async () => {
  const response = await api.get("/auth/validate-token");
  return response.data as {
    userId: string;
  };
};
