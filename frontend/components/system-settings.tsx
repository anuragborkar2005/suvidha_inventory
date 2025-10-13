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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

      <div className="flex justify-end">
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
