"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

import { useLocalStorage } from "@/lib/use-local-storage";
import api from "@/services/api";
import { useAuth } from "@/lib/auth-context";

interface Settings {
  lowStockAlert: boolean;
  lowStockThreshold: number;
}

export function SystemSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>("shop_settings", {
    lowStockAlert: true,
    lowStockThreshold: 10,
  });
  const [saved, setSaved] = useState(false);

  const { user } = useAuth();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await api.patch("/update-password", {
        emailId: user?.email,
        password,
      });
      if (response.status === 200) {
        alert("Password changed successfully");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert("Failed to change password");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          System Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure general system settings
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">General Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Basic Suvidha configuration
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Change Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-secondary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Inventory Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure stock alerts and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lowStockAlert">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when stock is low
              </p>
            </div>
            <Switch
              id="lowStockAlert"
              checked={settings.lowStockAlert}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, lowStockAlert: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Default Low Stock Threshold</Label>
            <Input
              id="threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  lowStockThreshold: Number.parseInt(e.target.value),
                })
              }
              className="bg-secondary"
            />
            <p className="text-xs text-muted-foreground">
              Alert when stock falls below this number
            </p>
          </div>
        </CardContent>
      </Card>

      {saved && (
        <Alert className="border-chart-2 bg-chart-2/10">
          <CheckCircle2 className="h-4 w-4 text-chart-2" />
          <AlertDescription className="text-chart-2">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handlePasswordChange}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Save Password
        </Button>
        <Button
          onClick={handleSave}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
