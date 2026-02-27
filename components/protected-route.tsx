"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireBusiness?: boolean
}

export function ProtectedRoute({ children, requireAdmin, requireBusiness }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isBusiness, isLoading } = useAuth()
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    // Wait until AuthProvider has finished reading localStorage + /auth/me
    if (isLoading) return

    if (!isAuthenticated) {
      if (requireAdmin) router.replace("/admin/login")
      else if (requireBusiness) router.replace("/business/login")
      else router.replace("/login")
      return
    }

    if (requireAdmin && !isAdmin) {
      router.replace("/admin/login")
      return
    }

    if (requireBusiness && !isBusiness) {
      router.replace("/business/login")
      return
    }

    setAllowed(true)
  }, [isLoading, isAuthenticated, isAdmin, isBusiness, requireAdmin, requireBusiness, router])

  if (isLoading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return <>{children}</>
}
