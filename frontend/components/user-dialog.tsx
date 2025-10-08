"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useUsers, type User } from "@/lib/use-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserDialog({ isOpen, onClose, user }: UserDialogProps) {
  const { addUser, updateUser } = useUsers();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "staff" as "admin" | "staff",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        role: "staff",
      });
    }
    setError("");
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user && !formData.password) {
      setError("Password is required for new users");
      return;
    }

    if (user) {
      updateUser(user.username, {
        role: formData.role,
        ...(formData.password && { password: formData.password }),
      });
    } else {
      const success = addUser({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      if (!success) {
        setError("Username already exists");
        return;
      }
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {user ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {user
              ? "Update user details and permissions."
              : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              disabled={!!user}
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? "New Password (optional)" : "Password"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!user}
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "admin" | "staff") =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger id="role" className="bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="staff" className="hover:bg-accent">
                  Staff
                </SelectItem>
                <SelectItem value="admin" className="hover:bg-accent">
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.role === "admin"
                ? "Full access to all features"
                : "Limited access to sales and products"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
