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
  const { isAuthenticated, isAdmin, isBusiness, user } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        if (requireAdmin) {
          router.push("/admin/login")
        } else if (requireBusiness) {
          router.push("/business/login")
        } else {
          router.push("/login")
        }
        return
      }

      if (requireAdmin && !isAdmin) {
        router.push("/admin/login")
        return
      }

      if (requireBusiness && !isBusiness) {
        router.push("/business/login")
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, isAdmin, isBusiness, requireAdmin, requireBusiness, router])

  if (isChecking || !isAuthenticated) {
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
