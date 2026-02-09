import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import api from "../api/axios";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async () => {

    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setIsLoggedIn(true);
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    validateToken();
  }, []);

  const login = async () => {
    await validateToken();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
