"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SalesTable } from "@/components/sales-table";
import { RecordSaleDialog } from "@/components/record-sale-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SalesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["admin", "staff"]}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Sales
            </h1>
            <p className="text-muted-foreground">
              Record and manage sales transactions
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            Record Sale
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Sales</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 ">
            <SalesTable filter="all" />
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <SalesTable filter="today" />
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <SalesTable filter="week" />
          </TabsContent>
        </Tabs>

        <RecordSaleDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
