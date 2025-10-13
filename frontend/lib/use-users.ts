"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/user-store";

export function useUsers() {
  const {
    users,
    fetchStaff,
    addUser,
    updateUser,
    deleteUser,
  } = useUserStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { users, addUser, updateUser, deleteUser };
}