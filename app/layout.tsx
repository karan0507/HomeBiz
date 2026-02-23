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

import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { NavigationCacheHandler } from "@/components/providers/navigation-cache-handler";
import "./globals.css";

// Configure Inter font with all weights for flexibility
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// SEO Metadata for HomeBiz Toronto
export const metadata: Metadata = {
  title: {
    default: "HomeBiz | Authentic Home Cooking from Your Toronto Neighbours",
    template: "%s | HomeBiz Toronto",
  },
  description:
    "Discover talented home chefs in Toronto making real family recipes. From South Indian dosas to Italian lasagna, Jamaican jerk to Chinese dumplings - taste the love in every bite. Order authentic home-cooked meals for pickup.",
  keywords: [
    "home cooking Toronto",
    "home chefs Toronto",
    "authentic food Toronto",
    "home-cooked meals",
    "local food Toronto",
    "South Indian food Toronto",
    "Italian food North York",
    "Jamaican food Toronto",
    "Chinese food homemade",
    "halal home cooking",
    "family recipes Toronto",
    "pickup food Toronto",
    "neighbourhood food",
    "ethnic food Toronto",
  ],
  authors: [{ name: "HomeBiz Toronto" }],
  creator: "HomeBiz Toronto",
  publisher: "HomeBiz Toronto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://homebiz.ca"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://homebiz.ca",
    siteName: "HomeBiz Toronto",
    title: "HomeBiz | Authentic Home Cooking from Your Toronto Neighbours",
    description:
      "Discover talented home chefs in Toronto making real family recipes. Taste the love in every bite with authentic home-cooked meals.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HomeBiz - Authentic Home Cooking from Toronto Home Chefs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeBiz | Home Cooking from Toronto Neighbours",
    description:
      "Discover talented home chefs in Toronto making real family recipes. Taste the love in every bite.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366F1" },
    { media: "(prefers-color-scheme: dark)", color: "#4F46E5" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        {/* Auth Provider wraps entire app for session management */}
        <AuthProvider>
          <CartProvider>
            <NavigationCacheHandler />
            {children}
          </CartProvider>
          {/* Toast notifications for user feedback */}
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={4000}
            className="sm:top-right"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
