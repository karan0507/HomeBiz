"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ChefHat,
  Home,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Utensils,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

interface MainLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  fullWidth?: boolean;
}

export function MainLayout({
  children,
  hideNav,
  hideFooter,
  fullWidth,
}: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const { cartCount, wishlist } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const isHomepage = pathname === "/";

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-trigger search when debounced input changes
  useEffect(() => {
    if (showSearch && debouncedSearch !== undefined) {
      if (debouncedSearch.trim()) {
        router.push(
          `/kitchens?q=${encodeURIComponent(debouncedSearch.trim())}`,
        );
      } else if (pathname === "/kitchens") {
        router.push("/kitchens");
      }
    }
  }, [debouncedSearch, showSearch, pathname, router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [pathname]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/kitchens?q=${encodeURIComponent(query)}`);
      setShowSearch(false);
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/kitchens", label: "Browse", icon: Utensils },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { href: "/account", label: "Account", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      {!hideNav && (
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b transition-all",
            isScrolled && "shadow-sm",
          )}
        >
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/images/logo.png"
                alt="HomeBiz"
                className="w-9 h-9 object-contain"
              />
              <span className="font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                HomeBiz
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/kitchens">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-primary/10 hover:text-primary transition-colors",
                    isActive("/kitchens") &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                >
                  Browse Kitchens
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-primary/10 hover:text-primary transition-colors",
                    isActive("/how-it-works") &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                >
                  How It Works
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "hover:bg-primary/10 hover:text-primary transition-colors",
                    isActive("/contact") &&
                      "bg-primary/10 text-primary font-medium",
                  )}
                >
                  Contact
                </Button>
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex items-center justify-center"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Wishlist */}
              <Link href="/account?tab=wishlist" className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 flex items-center justify-center"
                >
                  <Heart className="w-4 h-4" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-1">
                  <Link href="/account">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <span className="hidden lg:inline">
                        {user?.name?.split(" ")[0]}
                      </span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/business/signup">
                    <Button
                      size="sm"
                      className="gap-1.5  hover:from-primary/90 hover:to-orange-600/90"
                    >
                      <ChefHat className="w-3 h-3" />
                      Become a Chef
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {showSearch && (
            <div className="border-t bg-background/95 backdrop-blur-md">
              <div className="container mx-auto px-4 py-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search cuisines, dishes, or chefs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" size="default" className="px-6">
                    Search
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
              <div className="container mx-auto px-4 py-4 space-y-1">
                <Link href="/kitchens" className="block">
                  <Button variant="ghost" className="w-full justify-start h-11">
                    Browse Kitchens
                  </Button>
                </Link>
                <Link href="/how-it-works" className="block">
                  <Button variant="ghost" className="w-full justify-start h-11">
                    How It Works
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button variant="ghost" className="w-full justify-start h-11">
                    Contact Us
                  </Button>
                </Link>
                <div className="border-t pt-3 mt-3">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" className="block">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 gap-2"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-11 gap-2 text-destructive hover:text-destructive"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block">
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/business/signup" className="block">
                        <Button className="w-full justify-start h-11 gap-2 ">
                          <ChefHat className="w-4 h-4" />
                          Become a Chef
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className={cn("flex-1", !hideNav && "pt-14 pb-16 md:pb-0")}>
        <div className={cn("", fullWidth && "px-0 max-w-none w-full")}>
          {children}
        </div>
      </main>

      {/* Mobile Footer (expandable on homepage) */}
      {!hideNav && isHomepage && (
        <div
          className={cn(
            "fixed left-0 right-0 z-40 md:hidden bg-gradient-to-b from-zinc-900 to-black text-white transition-all duration-300 ease-in-out overflow-hidden",
            showMobileFooter
              ? "bottom-14 max-h-[70vh] opacity-100"
              : "bottom-0 max-h-0 opacity-0",
          )}
        >
          <div className="overflow-y-auto max-h-[70vh] pb-4 scrollbar-thin">
            <div className="px-4 py-6 space-y-6">
              {/* Brand */}
              <div>
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="HomeBiz"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-bold bg-clip-text text-transparent ">
                    HomeBiz
                  </span>
                </Link>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Connecting Toronto with authentic home-cooked meals from
                  talented neighbourhood chefs.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Explore</h4>
                <ul className="space-y-2">
                  {[
                    { href: "/kitchens", label: "Browse Kitchens" },
                    { href: "/how-it-works", label: "How It Works" },
                    { href: "/pricing", label: "Pricing" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors text-xs block py-1"
                        onClick={() => setShowMobileFooter(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Chefs */}
              <div>
                <h4 className="font-semibold text-sm mb-3">For Chefs</h4>
                <ul className="space-y-2">
                  {[
                    { href: "/business/signup", label: "Become a Chef" },
                    { href: "/resources", label: "Chef Resources" },
                    { href: "/success-stories", label: "Success Stories" },
                    { href: "/faq", label: "FAQ" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors text-xs block py-1"
                        onClick={() => setShowMobileFooter(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Contact</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-zinc-400 text-xs">
                    <Mail className="w-3.5 h-3.5" />
                    <span>hello@homebiz.ca</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-400 text-xs">
                    <Phone className="w-3.5 h-3.5" />
                    <span>416-555-HOME</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-400 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Toronto, Ontario</span>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>

              {/* Legal */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                    onClick={() => setShowMobileFooter(false)}
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                    onClick={() => setShowMobileFooter(false)}
                  >
                    Terms
                  </Link>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                    onClick={() => setShowMobileFooter(false)}
                  >
                    Contact
                  </Link>
                </div>
                <p className="text-zinc-500 text-[10px] mt-2">
                  © {new Date().getFullYear()} HomeBiz Toronto
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t safe-area-pb">
          <div
            className={cn(
              "grid h-14",
              isHomepage ? "grid-cols-5" : "grid-cols-4",
            )}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 transition-colors relative",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive(item.href) && "text-primary",
                    )}
                  />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute top-1 left-1/2 translate-x-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* "More" button - only on homepage */}
            {isHomepage && (
              <button
                onClick={() => setShowMobileFooter(!showMobileFooter)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 transition-colors",
                  showMobileFooter ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {showMobileFooter ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </div>
                <span className="text-[10px] font-medium">
                  {showMobileFooter ? "Less" : "More"}
                </span>
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Dark Footer with Gradient */}
      {!hideFooter && (
        <footer className="hidden md:block bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
          {/* Gradient Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary" />

          {/* Decorative Gradient Orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                <Link href="/" className="flex items-center gap-3 mb-6 group">
                  <img
                    src="/images/logo.png"
                    alt="HomeBiz"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="font-bold text-2xl">HomeBiz</span>
                </Link>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Connecting Toronto with authentic home-cooked meals from
                  talented neighbourhood chefs. Taste the love in every bite.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-lg mb-5">Explore</h4>
                <ul className="space-y-3">
                  {[
                    { href: "/kitchens", label: "Browse Kitchens" },
                    { href: "/kitchens?view=cuisines", label: "All Cuisines" },
                    { href: "/how-it-works", label: "How It Works" },
                    { href: "/pricing", label: "Pricing" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Chefs */}
              <div>
                <h4 className="font-semibold text-lg mb-5">For Chefs</h4>
                <ul className="space-y-3">
                  {[
                    { href: "/business/signup", label: "Become a Chef" },
                    { href: "/resources", label: "Chef Resources" },
                    { href: "/success-stories", label: "Success Stories" },
                    { href: "/faq", label: "FAQ" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-lg mb-5">Contact</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>hello@homebiz.ca</span>
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>416-555-HOME</span>
                  </li>
                  <li className="flex items-center gap-3 text-zinc-400 text-sm">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Toronto, Ontario</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-zinc-500 text-sm">
                © {new Date().getFullYear()} HomeBiz Toronto. All rights
                reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
