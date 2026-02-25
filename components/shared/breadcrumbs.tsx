"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Breadcrumbs — auto-generated from the current pathname.
 * No props needed. Reads usePathname() internally.
 * Place it inside any layout, above {children}.
 *
 * /business/orders        → Dashboard > Orders
 * /admin/users            → Admin > Users
 * /business/products      → Dashboard > Products
 */

const LABEL_MAP: Record<string, string> = {
  business: "Dashboard",
  admin: "Admin",
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  services: "Services",
  pricing: "Pricing",
  gallery: "Gallery",
  events: "Events",
  reviews: "Reviews",
  stories: "Stories",
  users: "Users",
  businesses: "Businesses",
  categories: "Categories",
  "cuisine-types": "Cuisine Types",
  "dietary-options": "Dietary Options",
  payments: "Payments",
  settings: "Settings",
};

interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null; // nothing to show on root panel page

  const crumbs: Crumb[] = segments.map((seg, idx) => ({
    label: LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-muted-foreground mb-4", className)}
    >
      <Link
        href={`/${segments[0]}/dashboard`}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {crumbs.slice(1).map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          {idx === crumbs.length - 2 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
