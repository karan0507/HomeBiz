"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  Utensils,
  FileText,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI, APIError } from "@/lib/services/api.client";
import { showError, showSuccess } from "@/lib/notifications";
import AddressAutocomplete, {
  Address,
} from "@/components/ui/address-autocomplete";
import { getCachedCuisineTypes, getCachedDietaryOptions } from "@/lib/services/data.service";
import type { CuisineType, DietaryOption } from "@/types/database";

function Req() {
  return <span className="text-destructive ml-0.5">*</span>;
}

export default function BusinessSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    kitchenName: "",
    description: "",
    cuisineTypeIds: [] as string[], // UUID arrays
    dietaryOptionIds: [] as string[], // UUID arrays
    neighborhood: "",
    hasCertificate: false,
    certificateNumber: "",
    acceptsPickup: true,
    acceptsDelivery: false,
  });
  const [address, setAddress] = useState<Address>({
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Canada",
  });
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [dietaryOptions, setDietaryOptions] = useState<DietaryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const router = useRouter();
  const { loginWithSession } = useAuth();
  const hasFetchedCuisines = useRef(false);
  const hasFetchedDietary = useRef(false);

  const totalSteps = 3;

  const fetchCuisines = async () => {
    if (hasFetchedCuisines.current || isLoadingOptions) return;
    setIsLoadingOptions(true);
    try {
      const cuisines = await getCachedCuisineTypes();
      setCuisineTypes(cuisines);
      hasFetchedCuisines.current = true;
    } catch (err) {
      console.error("Failed to fetch cuisines:", err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const fetchDietary = async () => {
    if (hasFetchedDietary.current || isLoadingOptions) return;
    setIsLoadingOptions(true);
    try {
      const dietary = await getCachedDietaryOptions();
      setDietaryOptions(dietary);
      hasFetchedDietary.current = true;
    } catch (err) {
      console.error("Failed to fetch dietary options:", err);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const toggleCuisine = (cuisineId: string) => {
    setFormData((prev) => ({
      ...prev,
      cuisineTypeIds: prev.cuisineTypeIds.includes(cuisineId)
        ? prev.cuisineTypeIds.filter((c) => c !== cuisineId)
        : [...prev.cuisineTypeIds, cuisineId],
    }));
  };

  const toggleDietary = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryOptionIds: prev.dietaryOptionIds.includes(optionId)
        ? prev.dietaryOptionIds.filter((d) => d !== optionId)
        : [...prev.dietaryOptionIds, optionId],
    }));
  };

  const validateStep1 = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError(
        new APIError(
          "First name and last name are required",
          400,
          "VALIDATION_ERROR",
        ),
      );
      return false;
    }
    if (!formData.email.trim() || !formData.phone.trim()) {
      showError(
        new APIError("Email and phone are required", 400, "VALIDATION_ERROR"),
      );
      return false;
    }
    if (!formData.password) {
      showError(new APIError("Password is required", 400, "VALIDATION_ERROR"));
      return false;
    }
    if (formData.password.length < 6) {
      showError(
        new APIError(
          "Password must be at least 6 characters",
          400,
          "VALIDATION_ERROR",
        ),
      );
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showError(
        new APIError("Passwords do not match", 400, "VALIDATION_ERROR"),
      );
      return false;
    }
    return true;
  };

  const step1Valid =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  const step2Valid =
    formData.kitchenName.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.neighborhood.trim().length > 0 &&
    formData.cuisineTypeIds.length > 0;

  const handleNext = async () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setIsLoading(true);
      try {
        // Check if email already exists
        const emailCheck = await fetchAPI<{ exists: boolean }>("/auth/check-exists", {
          method: "POST",
          body: JSON.stringify({ email: formData.email }),
        });

        if (emailCheck.exists) {
          showError(new APIError("Email already registered", 409, "CONFLICT"));
          setIsLoading(false);
          return;
        }

        // Fetch cuisines for Step 2
        await fetchCuisines();
        setStep(2);
      } catch (err) {
        showError(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    if (step === 2) {
      setIsLoading(true);
      try {
        await fetchDietary();
        setStep(3);
      } catch (err) {
        showError(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          confirm_password: formData.confirmPassword,
          role: "business",
          address_line1: address.address_line1,
          address_line2: address.address_line2 || undefined,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          kitchen: {
            name: formData.kitchenName.trim(),
            description: formData.description.trim(),
            neighborhood: formData.neighborhood.trim(),
            cuisine_type_ids: formData.cuisineTypeIds,
            dietary_option_ids: formData.dietaryOptionIds,
            food_handler_certificate: formData.hasCertificate,
            food_handler_certificate_number: formData.certificateNumber || null,
            pickup_available: formData.acceptsPickup,
            delivery_available: formData.acceptsDelivery,
          },
        }),
      });

      if (result.requires_confirmation || !result.session?.access_token) {
        showSuccess(
          "Account created!",
          "Please check your email to verify your account before signing in.",
        );
        setTimeout(() => router.push("/business/login"), 1500);
      } else {
        loginWithSession(result.user, result.session?.access_token);
        showSuccess("Account created!", "Redirecting to your dashboard...");
        setTimeout(() => router.push("/business/dashboard"), 1200);
      }
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3 text-center">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="HomeBiz"
                className="w-12 h-12 mx-auto object-contain"
              />
            </Link>
          <CardTitle className="text-2xl font-bold">
            Become a Home Chef
          </CardTitle>
          <CardDescription>
            {step === 1 && "Create your account to get started"}
            {step === 2 && "Tell us about your kitchen"}
            {step === 3 && "Address and dietary options"}
          </CardDescription>

          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    s < step
                      ? "bg-primary text-white"
                      : s === step
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${s < step ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name
                      <Req />
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name
                      <Req />
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                    <Req />
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number<Req /></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(416) 555-1234"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password
                      <Req />
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm
                      <Req />
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Kitchen Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kitchenName">
                    Kitchen Name
                    <Req />
                  </Label>
                  <div className="relative">
                    <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="kitchenName"
                      placeholder="e.g., Amma's Kitchen, Nonna's Table"
                      value={formData.kitchenName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kitchenName: e.target.value,
                        })
                      }
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">
                    Neighborhood
                    <Req />
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="neighborhood"
                      placeholder="e.g., Scarborough, North York, Downtown"
                      value={formData.neighborhood}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          neighborhood: e.target.value,
                        })
                      }
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description
                    <Req />
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="description"
                      placeholder="Tell customers about your kitchen and what makes your food special..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full min-h-[80px] pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Food Handler Certificate
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Do you have a valid food safety certification?
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.hasCertificate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hasCertificate: e.target.checked,
                        })
                      }
                    />
                  </div>

                  {formData.hasCertificate && (
                    <div className="space-y-2 pt-2 border-t mt-2">
                      <Label htmlFor="certificateNumber" className="text-xs">
                        Certificate Number (Optional)
                      </Label>
                      <Input
                        id="certificateNumber"
                        placeholder="e.g., FHC-123456"
                        value={formData.certificateNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certificateNumber: e.target.value,
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Cuisine Types
                    <Req />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Select at least one
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isLoadingOptions ? (
                      <p className="text-sm text-muted-foreground animate-pulse">
                        Loading categories...
                      </p>
                    ) : cuisineTypes.length > 0 ? (
                      cuisineTypes.map((ct) => (
                        <Badge
                          key={ct.id}
                          variant={
                            formData.cuisineTypeIds.includes(ct.id)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer transition-all ${
                            formData.cuisineTypeIds.includes(ct.id)
                              ? "bg-primary hover:bg-primary/90"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleCuisine(ct.id)}
                        >
                          <span className="mr-1">{ct.icon}</span>
                          {ct.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No categories found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address & Options */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <AddressAutocomplete
                    value={address}
                    onChange={setAddress}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Dietary Options{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Select options you can accommodate
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isLoadingOptions ? (
                      <p className="text-sm text-muted-foreground animate-pulse">
                        Loading options...
                      </p>
                    ) : (
                      dietaryOptions.map((opt) => (
                        <Badge
                          key={opt.id}
                          variant={
                            formData.dietaryOptionIds.includes(opt.id)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer transition-all ${
                            formData.dietaryOptionIds.includes(opt.id)
                              ? "bg-accent hover:bg-accent/90"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleDietary(opt.id)}
                        >
                          {opt.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>1. Complete your kitchen profile in the dashboard</li>
                    <li>2. Add your menu items and pricing</li>
                    <li>3. Set your availability and start receiving orders</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-primary to-emerald-600"
                  disabled={
                    isLoading ||
                    (step === 1 && !step1Valid) ||
                    (step === 2 && !step2Valid)
                  }
                >
                  {isLoading ? "Checking..." : "Next"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-emerald-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              )}
            </div>

            <div className="text-center space-y-2 pt-2 border-t">
              <Link
                href="/business/login"
                className="text-sm text-primary hover:underline block"
              >
                Already have an account? Sign in
              </Link>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                Back to home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
