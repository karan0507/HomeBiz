/**
 * Root Layout for HomeBiz Toronto
 * "Authentic Home Cooking from Your Toronto Neighbours"
 *
 * Features:
 * - Inter font family for modern, clean typography
 * - SEO-optimized metadata for Toronto home-cooked food market
 * - AuthProvider for user session management
 * - Vercel Analytics for performance tracking
 */

import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { NavigationCacheHandler } from "@/components/providers/navigation-cache-handler";
import "./globals.css";

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "HomeBiz | Authentic Home Cooking from Your Toronto Neighbours",
    template: "%s | HomeBiz Toronto",
  },
  description:
    "Discover talented home chefs in Toronto making real family recipes.",
  keywords: ["home cooking Toronto", "home chefs", "authentic food"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: "#10B981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <AuthProvider>
          <CartProvider>
            <NavigationCacheHandler />
            {children}
          </CartProvider>
          <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            visibleToasts={5}
            toastOptions={{
              duration: 4000,
              classNames: {
                toast: 'font-sans text-sm border',
                error: 'border-red-200',
                success: 'border-emerald-200',
                warning: 'border-yellow-200',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
