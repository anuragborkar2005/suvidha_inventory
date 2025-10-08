"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/user-management";
import { SystemSettings } from "@/components/system-settings";

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage users and system configuration
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
