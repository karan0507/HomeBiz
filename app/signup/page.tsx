"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
import { useDebounce } from "@/hooks/useDebounce";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const checkedEmail = useRef("");
  const { loginWithSession, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'business') {
        router.replace('/business/dashboard');
      } else if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/account');
      }
    }
  }, [user, router]);

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
    address.postal_code.trim().length > 0 &&
    agreedToTerms;

  const debouncedEmail = useDebounce(email, 300);

  useEffect(() => {
    if (!debouncedEmail || !debouncedEmail.includes('@')) return;
    if (debouncedEmail === checkedEmail.current) return;
    checkedEmail.current = debouncedEmail;

    fetchAPI<{ exists: boolean }>("/auth/check-exists", {
      method: "POST",
      body: JSON.stringify({ email: debouncedEmail }),
    })
      .then((result) => {
        if (result.exists) {
          showError("Email already registered. Please sign in.");
        }
      })
      .catch(() => {
        // Silent - network error or backend unavailable
      });
  }, [debouncedEmail]);

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
      loginWithSession(result.user, result.session?.access_token, result.session?.refresh_token);
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-destructive ml-0.5 cursor-help">*</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This field is required</p>
                    </TooltipContent>
                  </Tooltip>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-destructive ml-0.5 cursor-help">*</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This field is required</p>
                    </TooltipContent>
                  </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-destructive ml-0.5 cursor-help">*</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This field is required</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-destructive ml-0.5 cursor-help">*</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This field is required</p>
                  </TooltipContent>
                </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-destructive ml-0.5 cursor-help">*</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This field is required</p>
                  </TooltipContent>
                </Tooltip>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-destructive ml-0.5 cursor-help">*</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This field is required</p>
                  </TooltipContent>
                </Tooltip>
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

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-9 mt-4"
              disabled={isLoading || !formValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              className="w-full h-9"
              onClick={() => showError(new APIError("Google login is not yet configured.", 501, "NOT_IMPLEMENTED"))}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
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
