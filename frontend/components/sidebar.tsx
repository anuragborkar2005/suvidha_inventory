"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { useOnline } from "@/lib/use-online";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
    roles: ["admin"],
  },
  {
    name: "Sales",
    href: "/dashboard/sales",
    icon: ShoppingCart,
    roles: ["admin", "staff"],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const { isOnline } = useOnline();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Store className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Shop Manager
          </h2>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role} <br />
          </p>
        </div>
        <div>
          <p
            className={`text-xs text-muted-foreground ₹{
              isOnline ? "text-green-500" : "text-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                isActive &&
                  "bg-accent/20 text-accent-foreground hover:bg-accent/20"
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
