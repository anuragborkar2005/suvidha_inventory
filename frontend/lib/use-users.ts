"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { User } from "./auth-context";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchStaff = useCallback(async () => {
    try {
      const response = await api.get("/staff");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const addUser = async (
    email: string,
    password: string,
    role: "admin" | "staff"
  ) => {
    try {
      const res = await api.post("/register", {
        username: email,
        password,
        role,
      });
      console.log(res);
      fetchStaff();
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await api.patch(`/user/${id}`, updates);
      fetchStaff();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return { users, addUser, updateUser, deleteUser };
}
