# 🎨 HOMEBIZ - FRONTEND REQUIREMENTS
## Senior Developer Specification - Component-First Architecture

**Version**: 1.0 FRONTEND
**Tech Stack**: Next.js 15 + React 19 + TypeScript + Tailwind + shadcn/ui
**Approach**: Component-driven, mobile-first, type-safe

---

## 🎯 FRONTEND PHILOSOPHY

### Core Principles
```
1. COMPONENT REUSABILITY
   - Build once, use everywhere
   - Props for variations, not duplication
   - Composition over configuration

2. TYPE SAFETY
   - TypeScript for everything
   - No 'any' types
   - Interface-driven development

3. PERFORMANCE
   - Server Components by default
   - Client Components only when needed
   - Lazy loading, code splitting
   - Image optimization

4. ACCESSIBILITY
   - Keyboard navigation
   - Screen reader support
   - ARIA labels
   - Color contrast (WCAG AA)

5. MOBILE FIRST
   - Design for 375px (iPhone SE)
   - Progressive enhancement to desktop
   - Touch targets 44x44px minimum
```

---

## 📁 PROJECT STRUCTURE

```
/app
  /(auth)
    /login
      page.tsx              # Login page
    /signup
      page.tsx              # Signup page
  
  /(customer)
    /browse
      page.tsx              # Business listing
    /business/[id]
      page.tsx              # Business detail
    /menu/[id]
      page.tsx              # Menu item modal/detail
    /cart
      page.tsx              # Cart page
    /checkout
      page.tsx              # Checkout flow
    /orders
      page.tsx              # Order history
      /[id]
        page.tsx            # Order tracking
    /wishlist
      page.tsx              # Saved items
    /profile
      page.tsx              # Customer profile
  
  /(business)
    /onboarding
      page.tsx              # Multi-step onboarding
    /dashboard
      page.tsx              # Business dashboard
    /menu
      page.tsx              # Menu management
      /add
        page.tsx            # Add menu item
      /[id]/edit
        page.tsx            # Edit menu item
    /orders
      page.tsx              # Order management
      /[id]
        page.tsx            # Order detail
    /reviews
      page.tsx              # Review management
    /analytics
      page.tsx              # Business analytics
    /settings
      page.tsx              # Business settings
  
  /(admin)
    /dashboard
      page.tsx              # Admin overview
    /businesses
      /pending
        page.tsx            # Verification queue
      /[id]/verify
        page.tsx            # Verification detail
    /users
      page.tsx              # User management
    /orders
      page.tsx              # All orders
    /coupons
      page.tsx              # Coupon management
    /settings
      page.tsx              # Platform settings
  
  /page.tsx                 # Landing page
  /layout.tsx               # Root layout
  /globals.css              # Global styles

/components
  /ui                       # shadcn/ui components
    /button.tsx
    /card.tsx
    /input.tsx
    /badge.tsx
    /dialog.tsx
    /dropdown-menu.tsx
    /select.tsx
    /tabs.tsx
    /toast.tsx
    /skeleton.tsx
    /... (20+ more)
  
  /customer                 # Customer-specific
    /business-card.tsx      # Business listing card
    /menu-item-card.tsx     # Menu item card
    /cart-item.tsx          # Cart item row
    /order-card.tsx         # Order history card
    /review-card.tsx        # Review display
    /review-form.tsx        # Leave review
    /filter-panel.tsx       # Browse filters
    /search-bar.tsx         # Search component
  
  /business                 # Business-specific
    /order-card-business.tsx  # Order for business view
    /menu-item-form.tsx     # Add/edit menu item
    /hours-picker.tsx       # Operating hours selector
    /stats-card.tsx         # Dashboard stat card
    /order-actions.tsx      # Accept/reject buttons
  
  /admin                    # Admin-specific
    /verification-card.tsx  # Business to verify
    /user-table.tsx         # User management table
    /coupon-form.tsx        # Create coupon
  
  /shared                   # Shared across all
    /header.tsx             # Top navigation
    /footer.tsx             # Footer
    /mobile-nav.tsx         # Bottom navigation
    /logo.tsx               # Brand logo
    /empty-state.tsx        # Empty state template
    /loading-state.tsx      # Loading template
    /error-state.tsx        # Error template
    /image-upload.tsx       # Image upload widget
    /rating-stars.tsx       # Star rating display
    /status-badge.tsx       # Order status badge
    /distance-badge.tsx     # Distance from user
    /dietary-badge.tsx      # Veg/Non-veg badge

/lib
  /utils.ts                 # Utility functions
  /cn.ts                    # Class name merger
  /format.ts                # Date, currency formatters
  /validation.ts            # Zod schemas
  /constants.ts             # Constants, enums

/types
  /index.ts                 # All TypeScript interfaces

/hooks
  /use-cart.ts              # Cart state management
  /use-auth.ts              # Auth state
  /use-toast.ts             # Toast notifications
  /use-mobile.ts            # Detect mobile
  /use-debounce.ts          # Debounce hook
  /use-local-storage.ts     # Persist to localStorage

/styles
  /globals.css              # Tailwind + custom CSS

/public
  /images                   # Static images
  /icons                    # Icons, favicons
```

---

## 🎨 DESIGN SYSTEM IMPLEMENTATION

### 1. COLOR SYSTEM

**Tailwind Config:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Primary - Orange
        primary: {
          DEFAULT: '#F97316',      // Orange 500
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',          // Main
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Accent - Green
        accent: {
          DEFAULT: '#22C55E',      // Green 500
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',          // Main
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Background
        background: '#FFFBF5',     // Warm white
        surface: '#FFFFFF',        // Pure white
        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      }
    }
  }
}
```

**Usage in Components:**
```tsx
// Primary button
<Button className="bg-primary hover:bg-primary-600">
  Order Now
</Button>

// Success badge
<Badge className="bg-success text-white">
  Completed
</Badge>

// Warning state
<div className="bg-warning-50 border border-warning-200 text-warning-800">
  Order delayed
</div>
```

---

### 2. TYPOGRAPHY SYSTEM

**Font Setup:**
```typescript
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Typography Classes:**
```css
/* globals.css */
.heading-1 {
  @apply text-4xl md:text-5xl font-bold leading-tight;
}

.heading-2 {
  @apply text-3xl md:text-4xl font-semibold leading-tight;
}

.heading-3 {
  @apply text-2xl md:text-3xl font-semibold leading-snug;
}

.heading-4 {
  @apply text-xl md:text-2xl font-semibold leading-snug;
}

.body-large {
  @apply text-lg leading-relaxed;
}

.body {
  @apply text-base leading-relaxed;
}

.body-small {
  @apply text-sm leading-relaxed;
}

.caption {
  @apply text-xs leading-normal text-gray-600;
}
```

**Usage:**
```tsx
<h1 className="heading-1">Discover Home-Cooked Meals</h1>
<h2 className="heading-2">Featured Kitchens</h2>
<p className="body">Browse authentic home cooking...</p>
<span className="caption">2.3 km away</span>
```

---

### 3. SPACING SYSTEM

**Consistent Spacing:**
```typescript
// Use Tailwind's default spacing scale
// Multiples of 4px: 1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px, etc.

COMPONENT PADDING:
- Small card: p-4 (16px)
- Default card: p-6 (24px)
- Large card: p-8 (32px)

SECTION SPACING:
- Mobile: py-12 (48px top/bottom)
- Desktop: py-16 (64px top/bottom)

ELEMENT GAPS:
- Tight: gap-2 (8px)
- Default: gap-4 (16px)
- Loose: gap-6 (24px)

BUTTON PADDING:
- Small: px-3 py-1.5 (12px x 6px)
- Default: px-4 py-2 (16px x 8px)
- Large: px-6 py-3 (24px x 12px)
```

---

### 4. COMPONENT SPECIFICATIONS

#### **Button Component**

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Variants:**
```tsx
// Primary - Filled orange, for main CTAs
<Button variant="primary">Order Now</Button>

// Secondary - Outlined orange, for secondary actions
<Button variant="secondary">Learn More</Button>

// Ghost - No background, for tertiary actions
<Button variant="ghost">Cancel</Button>

// Destructive - Red, for delete/reject
<Button variant="destructive">Delete Item</Button>
```

**Sizes:**
```tsx
<Button size="sm">Small</Button>      // h-8 px-3 text-sm
<Button size="md">Default</Button>    // h-10 px-4 text-base
<Button size="lg">Large</Button>      // h-12 px-6 text-lg
```

**States:**
```tsx
// Loading state
<Button isLoading>Processing...</Button>

// Disabled state
<Button disabled>Unavailable</Button>

// With icons
<Button leftIcon={<Search />}>Search</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>
```

**Implementation:**
```tsx
// components/ui/button.tsx
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
    secondary: 'border-2 border-primary text-primary hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    destructive: 'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
```

---

#### **Card Component**

**Props:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}
```

**Variants:**
```tsx
// Default - White bg, border, subtle shadow
<Card variant="default">Content</Card>

// Elevated - White bg, no border, large shadow
<Card variant="elevated">Content</Card>

// Outline - Transparent bg, border only
<Card variant="outline">Content</Card>
```

**Hover Effect:**
```tsx
// Adds lift effect on hover
<Card hoverable>
  <BusinessInfo />
</Card>
```

**Implementation:**
```tsx
// components/ui/card.tsx
export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg transition-all duration-150';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg',
    outline: 'bg-transparent border border-gray-200',
  };
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hoverable 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : '';
  
  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

#### **Input Component**

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Usage:**
```tsx
// Basic input
<Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
/>

// With error
<Input 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With icons
<Input 
  leftIcon={<Search />}
  placeholder="Search businesses..."
/>

// With helper text
<Input 
  label="Business Name"
  helperText="This will be visible to customers"
/>
```

**Implementation:**
```tsx
// components/ui/input.tsx
export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={cn(
            'w-full h-10 px-3 rounded-md border border-gray-300 bg-white',
            'text-base text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-error focus:ring-error',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
```

---

#### **Badge Component**

**Props:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```tsx
// Status badges
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Cancelled</Badge>

// Dietary badges
<Badge variant="default">Vegetarian</Badge>
<Badge variant="info">Halal</Badge>

// Sizes
<Badge size="sm">New</Badge>
<Badge size="lg">Featured</Badge>
```

**Implementation:**
```tsx
// components/ui/badge.tsx
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
```

---

### 5. RESPONSIVE BREAKPOINTS

**Tailwind Breakpoints:**
```typescript
// Default Tailwind breakpoints
sm: '640px'    // Small devices (landscape phones)
md: '768px'    // Medium devices (tablets)
lg: '1024px'   // Large devices (desktops)
xl: '1280px'   // Extra large devices
2xl: '1536px'  // 2X large devices

// Usage
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

**Mobile-First Approach:**
```tsx
// Start with mobile styles, add desktop overrides
<button className="
  w-full              // Full width on mobile
  md:w-auto           // Auto width on tablet+
  
  text-sm             // Small text on mobile
  md:text-base        // Normal text on tablet+
  
  px-4 py-2           // Small padding on mobile
  md:px-6 md:py-3     // Larger padding on tablet+
">
  Order Now
</button>
```

---

## 📱 KEY PAGES & COMPONENTS

### 1. LANDING PAGE (`/page.tsx`)

**Layout:**
```tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Bar */}
      <SearchBar className="max-w-4xl mx-auto -mt-8" />
      
      {/* Value Props */}
      <ValueProps />
      
      {/* Category Pills */}
      <CategorySection />
      
      {/* Featured Kitchens */}
      <FeaturedKitchens />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* CTA for Businesses */}
      <BusinessCTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
```

**Hero Section Component:**
```tsx
// components/shared/hero-section.tsx
export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h1 className="heading-1 mb-4">
          Discover Home-Cooked Meals in Toronto
        </h1>
        
        <p className="body-large text-gray-600 max-w-2xl mx-auto mb-8">
          Authentic, affordable, verified home kitchens serving fresh meals 
          from your neighbours
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary">
            Browse Kitchens
          </Button>
          <Button size="lg" variant="secondary">
            Start Selling
          </Button>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Food illustrations or patterns */}
      </div>
    </section>
  );
}
```

**Search Bar Component:**
```tsx
// components/customer/search-bar.tsx
export function SearchBar({ className }: { className?: string }) {
  return (
    <Card 
      variant="elevated" 
      padding="md"
      className={cn("w-full", className)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Food Search */}
        <Input 
          leftIcon={<Search className="w-4 h-4" />}
          placeholder="What are you craving?"
          className="flex-1"
        />
        
        {/* Location */}
        <Input 
          leftIcon={<MapPin className="w-4 h-4" />}
          placeholder="North York, Toronto"
          className="md:w-64"
        />
        
        {/* Search Button */}
        <Button size="lg" variant="primary" className="md:w-auto">
          Search
        </Button>
      </div>
      
      {/* Value Props */}
      <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent" />
          <span className="body-small">Verified Kitchens</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          <span className="body-small">Authentic Flavors</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          <span className="body-small">Affordable Prices</span>
        </div>
      </div>
    </Card>
  );
}
```

---

### 2. BROWSE PAGE (`/(customer)/browse/page.tsx`)

**Layout:**
```tsx
export default function BrowsePage() {
  return (
    <div className="min-h-screen">
      {/* Mobile: Bottom nav, Desktop: Top header */}
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input 
            leftIcon={<Search />}
            placeholder="Search businesses..."
            className="flex-1"
          />
          <Button 
            variant="secondary"
            leftIcon={<Filter />}
            onClick={() => setShowFilters(true)}
          >
            Filters
          </Button>
        </div>
        
        {/* Category Pills (Horizontal Scroll) */}
        <CategoryPills />
        
        {/* Active Filters */}
        <ActiveFilters />
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="body text-gray-600">
            {count} kitchens found
          </p>
          <SortDropdown />
        </div>
        
        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
        
        {/* Pagination */}
        <Pagination />
      </div>
      
      {/* Filter Panel (Slide-in on mobile) */}
      <FilterPanel open={showFilters} onClose={() => setShowFilters(false)} />
      
      <MobileNav />
    </div>
  );
}
```

**Business Card Component:**
```tsx
// components/customer/business-card.tsx
interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    image: string;
    cuisines: string[];
    rating: number;
    reviewCount: number;
    distance: number;
    prepTime: number;
    priceRange: number;
  };
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card hoverable className="group">
      {/* Image */}
      <div className="relative aspect-video rounded-t-lg overflow-hidden mb-4">
        <Image
          src={business.image}
          alt={business.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Heart */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <h3 className="heading-4 line-clamp-1">{business.name}</h3>
        
        {/* Cuisines */}
        <div className="flex flex-wrap gap-2">
          {business.cuisines.slice(0, 3).map(cuisine => (
            <Badge key={cuisine} size="sm">{cuisine}</Badge>
          ))}
        </div>
        
        {/* Rating + Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="body-small font-medium ml-1">{business.rating}</span>
          </div>
          <span className="body-small text-gray-500">
            ({business.reviewCount} reviews)
          </span>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="caption">{business.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="caption">~{business.prepTime} min</span>
          </div>
          <div>
            <span className="caption">{'$'.repeat(business.priceRange)}</span>
          </div>
        </div>
        
        {/* CTA */}
        <Button variant="primary" className="w-full mt-4">
          View Menu
        </Button>
      </div>
    </Card>
  );
}
```

---

### 3. BUSINESS DETAIL PAGE (`/(customer)/business/[id]/page.tsx`)

**Layout:**
```tsx
export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
  const business = await getBusinessById(params.id);
  
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96">
        <Image
          src={business.banner}
          alt={business.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 -mt-16">
        {/* Business Info Card */}
        <Card variant="elevated" padding="lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image src={business.logo} alt="" fill className="object-cover" />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="heading-2 mb-2">{business.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <RatingStars rating={business.rating} />
                <span className="body-small text-gray-600">
                  {business.reviewCount} reviews
                </span>
              </div>
              
              {/* Cuisines */}
              <div className="flex flex-wrap gap-2 mb-4">
                {business.cuisines.map(cuisine => (
                  <Badge key={cuisine}>{cuisine}</Badge>
                ))}
              </div>
              
              {/* Address */}
              <div className="flex items-start gap-2 text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span className="body">{business.address}</span>
              </div>
              
              {/* Hours */}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="body">{business.todayHours}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="primary" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </Button>
              <Button variant="secondary" size="lg">
                <Navigation className="w-5 h-5 mr-2" />
                Directions
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="menu" className="mt-8">
          <TabsList>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({business.reviewCount})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <MenuTab businessId={params.id} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewsTab businessId={params.id} />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutTab business={business} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

**Menu Tab Component:**
```tsx
// components/customer/menu-tab.tsx
export function MenuTab({ businessId }: { businessId: string }) {
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  
  return (
    <div className="space-y-6">
      {/* Meal Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={selectedMealType === 'all' ? 'primary' : 'secondary'}
          onClick={() => setSelectedMealType('all')}
        >
          All
        </Button>
        <Button 
          variant={selectedMealType === 'breakfast' ? 'primary' : 'secondary'}
          onClick={() => setSelectedMealType('breakfast')}
        >
          Breakfast
        </Button>
        {/* More meal types... */}
      </div>
      
      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

**Menu Item Card:**
```tsx
// components/customer/menu-item-card.tsx
export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
  
  return (
    <Card hoverable>
      {/* Image */}
      <div className="relative aspect-square rounded-t-lg overflow-hidden mb-4">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
        
        {/* Dietary Badge */}
        <DietaryBadge type={item.dietaryType} className="absolute top-2 left-2" />
        
        {/* Spice Level */}
        {item.spiceLevel > 0 && (
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
            {'🌶️'.repeat(item.spiceLevel)}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <h4 className="font-semibold line-clamp-1">{item.name}</h4>
        <p className="body-small text-gray-600 line-clamp-2">{item.description}</p>
        
        {/* Price + Prep Time */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
          <span className="caption text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.prepTime} min
          </span>
        </div>
        
        {/* Add to Cart */}
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
```

---

### 4. CART PAGE (`/(customer)/cart/page.tsx`)

**Layout:**
```tsx
export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  
  if (items.length === 0) {
    return <EmptyCart />;
  }
  
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="heading-2 mb-8">Your Cart</h1>
        
        {/* Business Info */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <Image src={items[0].business.logo} alt="" fill />
            </div>
            <div>
              <h3 className="font-semibold">{items[0].business.name}</h3>
              <p className="body-small text-gray-600">{items[0].business.address}</p>
            </div>
          </div>
        </Card>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
            />
          ))}
        </div>
        
        {/* Summary */}
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="body">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-gray-600">
              <span className="body-small">Pickup (No delivery fee)</span>
              <span className="body-small">$0.00</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <Button variant="primary" size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

**Cart Item Component:**
```tsx
// components/customer/cart-item.tsx
interface CartItemProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <Card>
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold mb-1 truncate">{item.name}</h4>
          <p className="body-small text-gray-600 mb-2">${item.price.toFixed(2)}</p>
          
          {/* Special Instructions */}
          {item.specialInstructions && (
            <p className="caption text-gray-500 mb-2">
              Note: {item.specialInstructions}
            </p>
          )}
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Price + Remove */}
        <div className="flex flex-col items-end justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4 text-error" />
          </Button>
          <span className="font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
```

---

### 5. MOBILE NAVIGATION

**Bottom Navigation Component:**
```tsx
// components/shared/mobile-nav.tsx
'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  
  const items = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/browse', icon: Search, label: 'Browse' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: itemCount },
    { href: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1',
                'transition-colors',
                isActive ? 'text-primary' : 'text-gray-600'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 🔌 STATE MANAGEMENT

### Cart Context (Client-Side)

```tsx
// hooks/use-cart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  businessId: string;
  specialInstructions?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      
      removeItem: (itemId) => {
        set({ items: get().items.filter(i => i.id !== itemId) });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set({
            items: get().items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            )
          });
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'homebiz-cart',
    }
  )
);
```

---

## 📊 LOADING & ERROR STATES

### Loading State Component:

```tsx
// components/shared/loading-state.tsx
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="body text-gray-600">{message}</p>
    </div>
  );
}
```

### Skeleton Loading:

```tsx
// components/ui/skeleton.tsx
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Usage: Business Card Skeleton
export function BusinessCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-10 w-full" />
    </Card>
  );
}
```

### Empty State Component:

```tsx
// components/shared/empty-state.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="heading-4 mb-2">{title}</h3>
      <p className="body text-gray-600 max-w-md mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 🎭 ANIMATIONS & TRANSITIONS

### Standard Transitions:

```css
/* globals.css */
.transition-default {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-300 ease-in-out;
}

.hover-lift {
  @apply hover:-translate-y-1 hover:shadow-lg transition-default;
}

.hover-scale {
  @apply hover:scale-105 transition-default;
}
```

### Page Transitions (Framer Motion):

```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.Node }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## ✅ ACCESSIBILITY REQUIREMENTS

### Keyboard Navigation:
```
- Tab: Navigate forward
- Shift + Tab: Navigate backward
- Enter/Space: Activate buttons/links
- Escape: Close modals/dialogs
- Arrow keys: Navigate menus/carousels
```

### Screen Reader Support:
```tsx
// Always add ARIA labels
<button aria-label="Add to wishlist">
  <Heart />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <header>
  <main>
  <footer>
  <article>
  <section>
```

### Focus Styles:
```css
/* Visible focus indicators */
*:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}
```

---

## 📱 PWA REQUIREMENTS

### Manifest File:

```json
// public/manifest.json
{
  "name": "HomeBiz - Home-Cooked Meals",
  "short_name": "HomeBiz",
  "description": "Discover authentic home cooking from Toronto neighbours",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFBF5",
  "theme_color": "#F97316",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Next.js PWA Config:

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... other config
});
```

---

## 🧪 TESTING REQUIREMENTS

### Component Testing Checklist:
```
✅ Renders without crashing
✅ Displays correct content
✅ Handles user interactions
✅ Shows loading states
✅ Shows error states
✅ Responsive on all breakpoints
✅ Accessible (keyboard, screen reader)
✅ Correct prop types
```

### Browser Testing:
```
✅ Chrome (desktop + mobile)
✅ Safari (desktop + iOS)
✅ Firefox
✅ Edge
```

---

## 🎯 PERFORMANCE TARGETS

```
LIGHTHOUSE SCORES (Targets):
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

CORE WEB VITALS:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
```

---

**END OF FRONTEND REQUIREMENTS**

**Status**: ✅ Complete
**Next**: Create DOCUMENT_PLAN.md + MIGRATION_STRATEGY.md + PHASE_1_PROMPT.md
