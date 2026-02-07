"use client"

import { LucideIcon, Package, ShoppingCart, Users, FileText, Star, Image, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon = Package, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Pre-configured empty states for common scenarios
export function EmptyOrders({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="No orders yet"
      description="When customers place orders, they will appear here."
      action={onAction ? { label: "View Menu", onClick: onAction } : undefined}
    />
  )
}

export function EmptyProducts({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="No products yet"
      description="Add your first product to start receiving orders."
      action={onAction ? { label: "Add Product", onClick: onAction } : undefined}
    />
  )
}

export function EmptyUsers() {
  return (
    <EmptyState
      icon={Users}
      title="No users found"
      description="No users match your current filters."
    />
  )
}

export function EmptyReviews() {
  return (
    <EmptyState
      icon={Star}
      title="No reviews yet"
      description="Customer reviews will appear here after completed orders."
    />
  )
}

export function EmptyGallery({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Image}
      title="No photos yet"
      description="Upload photos to showcase your kitchen and dishes."
      action={onAction ? { label: "Upload Photos", onClick: onAction } : undefined}
    />
  )
}

export function EmptyEvents({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="No events yet"
      description="Create events to attract more customers."
      action={onAction ? { label: "Create Event", onClick: onAction } : undefined}
    />
  )
}

export function EmptyBusinesses() {
  return (
    <EmptyState
      icon={Package}
      title="No businesses found"
      description="No businesses match your current filters."
    />
  )
}

export function EmptyCategories() {
  return (
    <EmptyState
      icon={FileText}
      title="No categories found"
      description="No categories match your current filters."
    />
  )
}
