"use client";

import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get("access_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        Cookies.remove("access_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/login", { username: email, password });

      console.log("Login successful:", data);

      const token = data.accessToken;
      if (!token) return false;

      const decoded = jwtDecode<User>(token);
      Cookies.set("access_token", token, {
        expires: decoded.exp ? new Date(decoded.exp * 1000) : 1,
        secure: true,
        sameSite: "strict",
      });
      setUser(decoded);

      console.log("Decoded token:", decoded);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
