"use client";
import api from "@/services/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface OnlineContextType {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

export const OnlineProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkOnline = async () => {
      try {
        await api.get("/healthcheck");
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkOnline();
  }, []);

  return (
    <OnlineContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OnlineContext.Provider>
  );
};

export const useOnline = () => {
  const context = useContext(OnlineContext);
  if (context === undefined) {
    throw new Error("useOnline must be used within an OnlineProvider");
  }
  return context;
};
