"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { fetchAPI, APIError } from "./services/api.client"

// Matches GET /api/auth/me response.data
export interface SessionUser {
  id: string
  email: string
  name: string
  first_name?: string
  last_name?: string
  role: "admin" | "business" | "customer"
}

interface AuthContextType {
  user: SessionUser | null
  loginWithSession: (userData: { id: string; email: string; name: string; first_name?: string; last_name?: string; role: string }) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isBusiness: boolean
  isCustomer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const initialized = useRef(false)

  useEffect(() => {
    const validate = async () => {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setIsLoading(false);
        return;
      }

      let parsed: SessionUser;
      try {
        parsed = JSON.parse(raw);
        setUser(parsed); // Fast UI restore
      } catch {
        localStorage.removeItem("user");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetchAPI<{ user: any }>('/auth/me');
        if (!res || !res.user) {
          console.error("[Auth] Orphaned profile detected.");
          await logout();
          return;
        }

        const fresh = res.user;
        const updated: SessionUser = {
          id: fresh.id,
          email: fresh.email,
          name: fresh.name,
          first_name: fresh.first_name,
          last_name: fresh.last_name,
          role: fresh.role as SessionUser["role"],
        };
        
        if (JSON.stringify(updated) !== JSON.stringify(parsed)) {
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
        }
      } catch (err: any) {
        console.warn("[Auth] Session validation failed:", err);
        if (err instanceof APIError && (err.status === 401 || err.status === 404 || err.code === 'UNAUTHORIZED')) {
          setUser(null);
          localStorage.removeItem("user");
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialized.current) {
      initialized.current = true;
      validate();
    }

    // Re-validate when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        validate();
      }
    };

    window.addEventListener("focus", validate);
    window.addEventListener("visibilitychange", handleVisibility);
    
    return () => {
      window.removeEventListener("focus", validate);
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const loginWithSession = (
    userData: { id: string; email: string; name: string; first_name?: string; last_name?: string; role: string }
  ) => {
    const sessionUser: SessionUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role as SessionUser["role"],
    }
    setUser(sessionUser)
    localStorage.setItem("user", JSON.stringify(sessionUser))
  }

  const logout = async () => {
    // Clear local state immediately for UX
    setUser(null);
    localStorage.removeItem("user");
    
    try {
      // Wait for server-side cookie cleanup
      await fetchAPI('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore cleanup errors
    }
    
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    loginWithSession,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isBusiness: user?.role === "business",
    isCustomer: user?.role === "customer",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
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
