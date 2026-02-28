"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
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
import {
  ChefHat,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Phone,
  Loader2,
} from "lucide-react";
import AddressAutocomplete, {
  Address,
} from "@/components/ui/address-autocomplete";

function Req() {
  return <span className="text-destructive ml-0.5">*</span>;
}

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState<Address>({
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Canada",
  });
  const [isLoading, setIsLoading] = useState(false);
  const checkedEmail = useRef("");
  const { loginWithSession } = useAuth();
  const router = useRouter();

  const formValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword &&
    address.address_line1.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.province.trim().length > 0 &&
    address.postal_code.trim().length > 0;

  const handleEmailBlur = async () => {
    const val = email.trim();
    if (!val || val === checkedEmail.current) return;
    checkedEmail.current = val;
    try {
      const result = await fetchAPI<{ exists: boolean }>("/auth/check-exists", {
        method: "POST",
        body: JSON.stringify({ email: val }),
      });
      if (result.exists) {
        showError(
          new APIError(
            "Email already registered. Please sign in.",
            409,
            "CONFLICT",
          ),
        );
      }
    } catch {
      /* silent — backend may not be reachable */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showError(
        new APIError(
          "First name and last name are required",
          400,
          "VALIDATION_ERROR",
        ),
      );
      return;
    }
    if (!email.trim() || !phone.trim()) {
      showError(
        new APIError("Email and phone are required", 400, "VALIDATION_ERROR"),
      );
      return;
    }
    if (password.length < 6) {
      showError(
        new APIError(
          "Password must be at least 6 characters",
          400,
          "VALIDATION_ERROR",
        ),
      );
      return;
    }
    if (password !== confirmPassword) {
      showError(
        new APIError("Passwords do not match", 400, "VALIDATION_ERROR"),
      );
      return;
    }
    if (
      !address.address_line1 ||
      !address.city ||
      !address.province ||
      !address.postal_code
    ) {
      showError(
        new APIError(
          "Please provide a complete address",
          400,
          "VALIDATION_ERROR",
        ),
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchAPI<{
        user: { id: string; email: string; name: string; role: string };
        session: { access_token: string; refresh_token: string } | null;
        requires_confirmation: boolean;
      }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          confirm_password: confirmPassword,
          role: "customer",
          address_line1: address.address_line1,
          address_line2: address.address_line2 || undefined,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
        }),
      });

      if (result.requires_confirmation || !result.session?.access_token) {
        showSuccess(
          "Account created!",
          "Please check your email to verify your account before signing in.",
        );
        router.push("/login");
        return;
      }
      loginWithSession(result.user, result.session?.access_token);
      showSuccess("Account created!", "Welcome to HomeBiz.");
      router.push("/account");
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
          <Link href="/" className="inline-block mx-auto">
            <img
              src="/images/logo.png"
              alt="HomeBiz"
              className="w-12 h-12 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </Link>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription className="text-sm">
            Join HomeBiz to order home-cooked meals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm">
                  First Name
                  <Req />
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-9 h-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm">
                  Last Name
                  <Req />
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-9 h-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
                <Req />
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="pl-9 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
                <Req />
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(416) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                Password
                <Req />
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirm Password
                <Req />
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-primary to-accent text-white mt-4"
              disabled={isLoading || !formValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="pt-3 text-center border-t">
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="text-xs text-primary hover:underline"
                >
                  Already have an account?
                </Link>
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground mb-2">
              Want to sell your home cooking?
            </p>
            <Link href="/business/signup">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs gap-1.5"
              >
                <ChefHat className="w-3 h-3" />
                Become a Chef
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
