"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Lock, Mail, ArrowLeft } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

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
      if (result.user.role === 'admin') {
        showError(new APIError("Use the admin portal to sign in.", 403, "FORBIDDEN"));
        return;
      }
      loginWithSession(result.user, result.session?.access_token);
      showSuccess("Welcome back!", "You're now signed in.");
      // Use full page reload for business users to ensure cookie is committed
      if (result.user.role === 'business') {
        window.location.href = '/business/dashboard';
      } else {
        router.push(redirect);
      }
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
          <Link href="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/" className="inline-block">
            <img
              src="/images/logo.png"
              alt="HomeBiz"
              className="w-16 h-16 mx-auto object-contain"
            />
          </Link>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription className="text-sm">Sign in to your account</CardDescription>
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
                  placeholder="you@email.com"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-primary to-accent text-white"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="pt-3 text-center border-t">
              <div className="flex justify-center gap-4">
                <Link href="/signup" className="text-xs text-primary hover:underline">
                  Create account
                </Link>
                <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                  Back to home
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground mb-2">Are you a home chef?</p>
            <Link href="/business/login">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5">
                <ChefHat className="w-3 h-3" />
                Chef Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
