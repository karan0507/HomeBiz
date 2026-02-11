"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { mockUsers, type User } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: "admin" | "business" | "customer") => Promise<boolean>
  signup: (name: string, email: string, password: string, role: "business" | "customer") => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isBusiness: boolean
  isCustomer: boolean
}

interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  role: "business" | "customer"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Runtime users storage (includes mock users + newly registered users)
let runtimeUsers: User[] = [...mockUsers]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return;

    const storedRegisteredUsers = localStorage.getItem("registeredUsers")
    if (storedRegisteredUsers) {
      const registeredUsers = JSON.parse(storedRegisteredUsers)
      const existingEmails = new Set(runtimeUsers.map(u => u.email))
      registeredUsers.forEach((u: User) => {
        if (!existingEmails.has(u.email)) {
          runtimeUsers.push(u)
        }
      })
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    initialized.current = true
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: "admin" | "business" | "customer"): Promise<boolean> => {
    // Check runtime users (includes both mock and registered users)
    const foundUser = runtimeUsers.find((u) => u.email === email && u.password === password && (!role || u.role === role))

    if (foundUser) {
      // Store user without password for security
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, role: "business" | "customer"): Promise<boolean> => {
    // Check if email already exists
    const existingUser = runtimeUsers.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role,
      subscriptionStatus: "free",
      createdAt: new Date().toISOString(),
    }

    // Add to runtime users
    runtimeUsers.push(newUser)

    // Persist registered users to localStorage
    const storedRegisteredUsers = localStorage.getItem("registeredUsers")
    const registeredUsers = storedRegisteredUsers ? JSON.parse(storedRegisteredUsers) : []
    registeredUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isBusiness: user?.role === "business",
    isCustomer: user?.role === "customer",
  }

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
