"use client";

import { useState, useEffect } from "react";

export interface User {
  username: string;
  password: string;
  role: "admin" | "staff";
}

const INITIAL_USERS: User[] = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "staff", password: "staff123", role: "staff" },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("shop_users");
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem("shop_users", JSON.stringify(INITIAL_USERS));
    }
  }, []);

  const addUser = (user: User): boolean => {
    if (users.some((u) => u.username === user.username)) {
      return false;
    }
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem("shop_users", JSON.stringify(updated));
    return true;
  };

  const updateUser = (username: string, updates: Partial<User>) => {
    const updated = users.map((u) =>
      u.username === username ? { ...u, ...updates } : u
    );
    setUsers(updated);
    localStorage.setItem("shop_users", JSON.stringify(updated));
  };

  const deleteUser = (username: string) => {
    const updated = users.filter((u) => u.username !== username);
    setUsers(updated);
    localStorage.setItem("shop_users", JSON.stringify(updated));
  };

  return { users, addUser, updateUser, deleteUser };
}
