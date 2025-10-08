"use client";
import { ProtectedRoute } from "@/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyReport } from "@/components/monthly-report";
import { ProductPerformance } from "@/components/product-performance";
import { DailyReport } from "@/components/daily-report";

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            View detailed sales reports and performance metrics
          </p>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="daily">Daily Report</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <DailyReport />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-6">
            <MonthlyReport />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductPerformance />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
