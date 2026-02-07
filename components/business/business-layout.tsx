"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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
  Menu,
  X,
  ChefHat,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

interface BusinessLayoutProps {
  children: React.ReactNode
}

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

// Bottom nav shows 4 primary items + More
const bottomNavItems = [
  { icon: LayoutDashboard, label: "Home", href: "/business/dashboard" },
  { icon: ShoppingCart, label: "Orders", href: "/business/orders" },
  { icon: Package, label: "Products", href: "/business/products" },
  { icon: MoreHorizontal, label: "More", href: "#more" },
]

export function BusinessLayout({ children }: BusinessLayoutProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMoreMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/business/dashboard") return pathname === "/business/dashboard"
    return pathname.startsWith(href)
  }

  // Check if current page is in the "More" menu
  const isMoreActive = ["/business/services", "/business/pricing", "/business/gallery", "/business/events", "/business/reviews"].some(
    (href) => pathname.startsWith(href)
  )

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r flex-col h-screen sticky top-0">
        <div className="p-6 border-b">
          <Link href="/business/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Business Portal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-b transition-all",
          isScrolled && "shadow-sm"
        )}
      >
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/business/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Business</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-background/95 backdrop-blur-md max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} className="block">
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                )
              })}
              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-14 pb-20 md:pt-0 md:pb-0">
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t safe-area-pb">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isMoreButton = item.href === "#more"
            const active = isMoreButton ? isMoreActive : isActive(item.href)

            if (isMoreButton) {
              return (
                <button
                  key={item.href}
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 transition-colors relative",
                    active || moreMenuOpen ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* More Menu Popup */}
        {moreMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 bg-background border-t shadow-lg">
            <div className="grid grid-cols-4 gap-2 p-4">
              {[
                { icon: Wrench, label: "Services", href: "/business/services" },
                { icon: DollarSign, label: "Pricing", href: "/business/pricing" },
                { icon: ImageIcon, label: "Gallery", href: "/business/gallery" },
                { icon: Calendar, label: "Events", href: "/business/events" },
                { icon: Star, label: "Reviews", href: "/business/reviews" },
              ].map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-3 rounded-lg transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
