import api from "./axios";

/* ================= LOGIN ================= */
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data as {
    userId: string;
    role: "user" | "admin";
  };
};

/* ================= REGISTER ================= */
export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data as {
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
