"use client";

import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
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
  username: string;
  role: UserRole;
  name?: string;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("access_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await api.post("/login", { username, password });

      console.log("Login successful:", data);

      const token = data.accessToken;
      if (!token) return false;

      const decoded = jwtDecode<User>(token);
      localStorage.setItem("access_token", token);
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
    localStorage.removeItem("access_token");
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
