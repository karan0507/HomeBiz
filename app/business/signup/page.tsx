"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ChefHat,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Utensils,
  FileText
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockCategories } from "@/lib/mock-data"

const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "Dairy-Free", "Nut-Free"]
const neighborhoodOptions = [
  "Downtown Toronto",
  "North York",
  "Scarborough",
  "Etobicoke",
  "Mississauga",
  "Brampton",
  "Markham",
  "Richmond Hill",
  "Vaughan",
  "Other"
]

export default function BusinessSignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2: Kitchen Details
    kitchenName: "",
    description: "",
    cuisineTypes: [] as string[],
    // Step 3: Location & Options
    neighborhood: "",
    dietaryOptions: [] as string[],
    acceptsPickup: true,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const totalSteps = 3

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }))
  }

  const toggleDietary = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter(d => d !== option)
        : [...prev.dietaryOptions, option]
    }))
  }

  const validateStep = (currentStep: number): boolean => {
    setError("")

    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    }

    if (currentStep === 2) {
      if (!formData.kitchenName) {
        setError("Please enter your kitchen name")
        return false
      }
      if (formData.cuisineTypes.length === 0) {
        setError("Please select at least one cuisine type")
        return false
      }
    }

    if (currentStep === 3) {
      if (!formData.neighborhood) {
        setError("Please select your neighborhood")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setError("")
    setIsLoading(true)

    const signupSuccess = await signup(formData.name, formData.email, formData.password, "business")

    if (signupSuccess) {
      // Store kitchen details in localStorage for now (backend will replace this)
      const kitchenData = {
        kitchenName: formData.kitchenName,
        description: formData.description,
        cuisineTypes: formData.cuisineTypes,
        neighborhood: formData.neighborhood,
        dietaryOptions: formData.dietaryOptions,
        phone: formData.phone,
        ownerEmail: formData.email,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("pendingKitchenSetup", JSON.stringify(kitchenData))

      setSuccess(true)
      setIsLoading(false)
      setTimeout(() => router.push("/business/dashboard"), 1500)
    } else {
      setError("Email already registered. Please try another.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
            <ChefHat className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Become a Home Chef</CardTitle>
          <CardDescription>
            {step === 1 && "Create your account to get started"}
            {step === 2 && "Tell us about your kitchen"}
            {step === 3 && "Location and dietary options"}
          </CardDescription>

          {/* Progress Steps */}
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
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Account created successfully! Redirecting to your dashboard...
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(416) 555-1234"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  <Label htmlFor="kitchenName">Kitchen Name *</Label>
                  <div className="relative">
                    <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="kitchenName"
                      placeholder="e.g., Amma's Kitchen, Nonna's Table"
                      value={formData.kitchenName}
                      onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="description"
                      placeholder="Tell customers about your kitchen and what makes your food special..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[80px] pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    Cuisine Types *
                  </Label>
                  <p className="text-xs text-muted-foreground">Select all that apply</p>
                  <div className="flex flex-wrap gap-2">
                    {mockCategories.map((cat) => (
                      <Badge
                        key={cat.id}
                        variant={formData.cuisineTypes.includes(cat.name) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.cuisineTypes.includes(cat.name)
                            ? "bg-primary hover:bg-primary/90"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => toggleCuisine(cat.name)}
                      >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Options */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Neighborhood *
                  </Label>
                  <select
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select your area</option>
                    {neighborhoodOptions.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Options (Optional)</Label>
                  <p className="text-xs text-muted-foreground">Select options you can accommodate</p>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={formData.dietaryOptions.includes(option) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.dietaryOptions.includes(option)
                            ? "bg-accent hover:bg-accent/90"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => toggleDietary(option)}
                      >
                        {option}
                      </Badge>
                    ))}
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

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} className="flex-1 bg-gradient-to-r from-primary to-emerald-600">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-emerald-600"
                  disabled={isLoading || success}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              )}
            </div>

            <div className="text-center space-y-2 pt-2 border-t">
              <Link href="/business/login" className="text-sm text-primary hover:underline block">
                Already have an account? Sign in
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                Back to home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
