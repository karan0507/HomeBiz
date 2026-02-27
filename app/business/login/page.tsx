"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";

export default function BusinessLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithSession } = useAuth();
  const router = useRouter();

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      const result = await fetchAPI<{
        user: { id: string; email: string; name: string; role: string };
        session: { access_token: string; refresh_token: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!result.user) {
        showError(new APIError("Login failed. Please try again.", 500, "SERVER_ERROR"));
        return;
      }
      if (result.user.role !== 'business') {
        showError(new APIError("This account is not a business account.", 403, "FORBIDDEN"));
        return;
      }

      loginWithSession(result.user, result.session?.access_token);
      showSuccess("Welcome back!", "Redirecting to your dashboard...");
      router.push("/business/dashboard");
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center pb-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="HomeBiz"
                className="w-16 h-16 mx-auto object-contain"
              />
            </Link>
          <CardTitle className="text-xl">Chef Portal</CardTitle>
          <CardDescription className="text-sm">Sign in to manage your kitchen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="chef@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-9" disabled={isLoading || !canSubmit}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="pt-3 text-center border-t">
              <div className="flex justify-center gap-4 mt-2">
                <Link href="/business/signup" className="text-xs text-primary hover:underline">
                  Create account
                </Link>
                <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                  ← Home
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
