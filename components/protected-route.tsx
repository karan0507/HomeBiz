"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireBusiness?: boolean
}

export function ProtectedRoute({ children, requireAdmin, requireBusiness }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isBusiness, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      if (requireAdmin) {
        router.push("/admin/login")
      } else if (requireBusiness) {
        router.push("/business/login")
      }
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push("/admin/login")
    }

    if (requireBusiness && !isBusiness) {
      router.push("/business/login")
    }
  }, [isAuthenticated, isAdmin, isBusiness, requireAdmin, requireBusiness, router, user])

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  if (requireBusiness && !isBusiness) {
    return null
  }

  return <>{children}</>
}
