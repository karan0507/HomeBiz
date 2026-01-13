"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wrench,
  DollarSign,
  ImageIcon,
  Calendar,
  Star,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/business/dashboard" },
  { icon: ShoppingCart, label: "Orders", href: "/business/orders" },
  { icon: Package, label: "Products", href: "/business/products" },
  { icon: Wrench, label: "Services", href: "/business/services" },
  { icon: DollarSign, label: "Pricing", href: "/business/pricing" },
  { icon: ImageIcon, label: "Gallery", href: "/business/gallery" },
  { icon: Calendar, label: "Events", href: "/business/events" },
  { icon: Star, label: "Reviews", href: "/business/reviews" },
]

export function BusinessSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className="w-64 bg-card border-r flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/business/dashboard" className="flex items-center gap-2">
          <Building className="h-6 w-6 text-accent" />
          <span className="text-lg font-display font-semibold">Business Portal</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
