"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Store } from "lucide-react";
import { useOnline } from "@/lib/use-online";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOnline } = useOnline();

  if (!isOnline) {
    console.log("Offline");
  } else {
    console.log("Online");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(username, password);

    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
            <Store className="h-8 w-8 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">
              Shop Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your dashboard
              <br />
              {isOnline ? "Online" : "Offline"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="mb-2 font-medium text-foreground">
                Demo Credentials:
              </p>
              <div className="space-y-1 text-muted-foreground">
                <p>Admin: admin / admin123</p>
                <p>Staff: staff / staff123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
