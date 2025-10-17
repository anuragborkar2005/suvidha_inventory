
"use client";

import { create } from "zustand";
import api from "@/services/api";
import { User } from "@/lib/auth-context";

interface UserState {
  users: User[];
  fetchStaff: () => Promise<void>;
  addUser: (
    email: string,
    password: string,
    role: "admin" | "staff"
  ) => Promise<void>;
  updateUser: (id: string, userUpdate: Omit<User, "id">) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  fetchStaff: async () => {
    try {
      const response = await api.get("/staff");
      set({ users: response.data.data });
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  },
  addUser: async (email, password, role) => {
    try {
      await api.post("/register", {
        username: email,
        password,
        role,
      });
      get().fetchStaff();
    } catch (error) {
      console.error("Failed to add user", error);
    }
  },
  updateUser: async (id, userUpdate) => {
    try {
      await api.patch(`/user/${id}`, userUpdate);
      get().fetchStaff();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  },
  deleteUser: async (id) => {
    try {
      await api.delete(`/user/${id}`);
      get().fetchStaff();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  },
}));
