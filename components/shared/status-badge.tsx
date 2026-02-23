"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type OrderStatus = "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "completed" | "cancelled"

interface StatusBadgeProps {
  status: OrderStatus
  className?: string
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  placed: {
    label: "New",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  },
  preparing: {
    label: "Preparing",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  ready: {
    label: "Ready",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  picked_up: {
    label: "Picked Up",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.placed

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

// User status badge
type UserStatus = "active" | "suspended" | "pending" | "inactive"

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const config: Record<UserStatus, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    suspended: {
      label: "Suspended",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    },
  }

  const statusConfig = config[status] || config.active

  return (
    <Badge variant="secondary" className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  )
}

// Verification status badge
type VerificationStatus = "pending" | "approved" | "rejected" | "suspended"

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const config: Record<VerificationStatus, { label: string; className: string }> = {
    pending: {
      label: "Pending Review",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    approved: {
      label: "Verified",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    suspended: {
      label: "Suspended",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
  }

  const statusConfig = config[status] || config.pending

  return (
    <Badge variant="secondary" className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  )
}
