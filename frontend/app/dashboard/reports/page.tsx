"use client";
import { ProtectedRoute } from "@/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyReport } from "@/components/monthly-report";
import { ProductPerformance } from "@/components/product-performance";
import { DailyReport } from "@/components/daily-report";

import { Button } from "@/components/ui/button";
import { Check, Download } from "lucide-react";
import api from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [fileType, setFileType] = useState("xlsx");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await api.get(`/sales/report${fileType === "csv" ? "/csv" : ""}` , {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sales-report.${fileType}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download report:", error);
    }
    setIsDownloading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              View detailed sales reports and performance metrics
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download Report"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={handleDownload}>
              <DropdownMenuItem onClick={() => setFileType("xlsx")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    fileType === "xlsx" ? "opacity-100" : "opacity-0"
                  )}
                />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFileType("csv")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    fileType === "csv" ? "opacity-100" : "opacity-0"
                  )}
                />
                CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
