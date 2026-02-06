# 🚀 PHASE 1 PROMPT - PROJECT FOUNDATION
## HomeBiz: Complete Setup, Database, & Design System

**⚠️ INSTRUCTIONS**: Copy everything below the line and paste into Claude Code

---

# Build HomeBiz Phase 1: Project Foundation

## CONTEXT
Building HomeBiz - a home-cooked food delivery platform for Toronto. This is Phase 1 of 7: Foundation setup.

## OBJECTIVE
Create a production-ready Next.js 15 project with:
1. Complete project structure
2. Database schema (Prisma + Supabase)
3. Design system (Tailwind + shadcn/ui + custom theme)
4. TypeScript configuration
5. Basic routing structure
6. Image optimization setup

## REFERENCE DOCUMENTS
- Requirements: FINAL_REQUIREMENTS.md (in project docs)
- Frontend Specs: FRONTEND_REQUIREMENTS.md (in project docs)

## TECHNICAL SPECIFICATIONS

**Stack**:
- Next.js 15.1.0 (App Router)
- React 19.2.0
- TypeScript 5+
- Tailwind CSS 4
- shadcn/ui (latest)
- Prisma 6+ (PostgreSQL via Supabase)
- pnpm (package manager)

**Design System**:
- Font: Plus Jakarta Sans
- Primary Color: #F97316 (Orange 500)
- Accent Color: #22C55E (Green 500)
- Background: #FFFBF5 (Warm white)

---

## STEP 1: INITIALIZE PROJECT

Create new Next.js 15 project with strict TypeScript:

```bash
pnpm create next-app@latest homebiz \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --turbopack
```

Navigate to project:
```bash
cd homebiz
```

---

## STEP 2: INSTALL CORE DEPENDENCIES

```bash
# Prisma (Database)
pnpm add prisma @prisma/client
pnpm add -D prisma

# Authentication (Phase 2, but install now)
pnpm add next-auth@beta
pnpm add bcryptjs
pnpm add -D @types/bcryptjs

# Form Validation
pnpm add react-hook-form @hookform/resolvers zod

# UI Libraries
pnpm add clsx tailwind-merge
pnpm add lucide-react
pnpm add date-fns

# Image Compression
pnpm add browser-image-compression

# State Management
pnpm add zustand

# Utilities
pnpm add sharp
```

---

## STEP 3: INITIALIZE shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

**Configuration** (when prompted):
- Style: New York
- Base color: Neutral
- CSS variables: Yes
- Tailwind config: Yes
- Import alias: @/components

**Install required components**:
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add radio-group
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add switch
```

---

## STEP 4: PROJECT STRUCTURE

Create this exact folder structure:

```
/app
  /(auth)
    /login
      page.tsx
    /signup
      page.tsx
  /(customer)
    /browse
      page.tsx
    /business/[id]
      page.tsx
    /cart
      page.tsx
    /checkout
      page.tsx
    /orders
      page.tsx
      /[id]
        page.tsx
    /profile
      page.tsx
  /(business)
    /onboarding
      page.tsx
    /dashboard
      page.tsx
    /menu
      page.tsx
    /orders
      page.tsx
  /(admin)
    /dashboard
      page.tsx
    /businesses
      page.tsx
  page.tsx
  layout.tsx
  globals.css

/components
  /ui (shadcn components already here)
  /customer
    .gitkeep
  /business
    .gitkeep
  /admin
    .gitkeep
  /shared
    header.tsx
    footer.tsx
    mobile-nav.tsx

/lib
  utils.ts
  db.ts
  constants.ts

/types
  index.ts

/hooks
  use-cart.ts

/prisma
  schema.prisma
  seed.ts

/public
  /images
    .gitkeep

.env.local
.env.example
```

---

## STEP 5: CONFIGURE TAILWIND (Custom Design System)

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        accent: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        background: '#FFFBF5',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## STEP 6: CONFIGURE FONTS

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta"
});

export const metadata: Metadata = {
  title: "HomeBiz - Home-Cooked Meals in Toronto",
  description: "Discover authentic home cooking from your Toronto neighbours",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans antialiased bg-background text-gray-900">
        {children}
      </body>
    </html>
  );
}
```

---

## STEP 7: UPDATE GLOBAL STYLES

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --primary: 22 100% 53%;
    --primary-foreground: 210 40% 98%;
    
    --accent: 142 71% 45%;
    --accent-foreground: 210 40% 98%;
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 22 100% 53%;
    
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
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
}
```

---

## STEP 8: CREATE PRISMA SCHEMA

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Enums
enum UserRole {
  CUSTOMER
  BUSINESS
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum SubscriptionStatus {
  FREE
  ACTIVE
  EXPIRED
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum DietaryType {
  VEGETARIAN
  NON_VEGETARIAN
  JAIN
  VEGAN
  HALAL
  GLUTEN_FREE
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACKS
  BAKERY
}

enum OrderStatus {
  PLACED
  CONFIRMED
  PREPARING
  READY
  PICKED_UP
  COMPLETED
  CANCELLED
  REJECTED
}

enum PaymentMethod {
  CASH
  INTERAC
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

// Models
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  phone     String
  role      UserRole @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)
  
  subscriptionStatus SubscriptionStatus @default(FREE)
  subscriptionExpiry DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  customerProfile CustomerProfile?
  businessProfile BusinessProfile?
  
  @@index([email])
  @@index([role])
  @@map("users")
}

model CustomerProfile {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName String
  lastName String
  profileImage String?
  
  // Preferences
  dietaryRestrictions DietaryType[]
  favoriteCuisines String[]
  
  // Stats
  totalOrders Int @default(0)
  lastOrderAt DateTime?
  
  // Relations
  addresses Address[]
  orders Order[]
  reviews Review[]
  wishlist Wishlist[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("customer_profiles")
}

model Address {
  id String @id @default(cuid())
  customerId String
  customer CustomerProfile @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  label String // "Home", "Work", etc.
  street String
  unit String?
  city String @default("Toronto")
  province String @default("Ontario")
  postalCode String
  
  isDefault Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([customerId])
  @@map("addresses")
}

model BusinessProfile {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  businessName String
  businessEmail String
  phone String
  description String
  
  // Address
  address String
  coordinates Json // {lat: number, lng: number}
  
  // License
  foodHandlerCert String
  foodHandlerCertImage String
  businessLicense String?
  businessLicenseImage String?
  dineSafe String?
  startedDate DateTime
  
  // Verification
  verificationStatus VerificationStatus @default(PENDING)
  verifiedAt DateTime?
  rejectionReason String?
  
  // Business Info
  cuisines String[]
  languages String[]
  operatingHours Json // {mon: {open: "09:00", close: "18:00"}, ...}
  pickupInstructions String?
  
  // Status
  isActive Boolean @default(true)
  
  // Stats
  totalOrders Int @default(0)
  rating Float @default(0)
  reviewCount Int @default(0)
  
  // Relations
  menuItems MenuItem[]
  orders Order[]
  reviews Review[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([verificationStatus])
  @@index([isActive])
  @@map("business_profiles")
}

model MenuItem {
  id String @id @default(cuid())
  businessId String
  business BusinessProfile @relation(fields: [businessId], references: [id], onDelete: Cascade)
  
  name String
  description String
  price Float
  images String[]
  
  // Categories
  dietaryType DietaryType
  mealTypes MealType[]
  cuisineType String
  spiceLevel Int @default(0) // 0-5
  
  // Info
  prepTime Int // minutes
  servingSize String?
  ingredients String[]
  allergens String[]
  tags String[]
  
  // Availability
  isAvailable Boolean @default(true)
  stock Int?
  
  // Stats
  orderCount Int @default(0)
  
  // Relations
  orderItems OrderItem[]
  wishlist Wishlist[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([businessId])
  @@index([isAvailable])
  @@map("menu_items")
}

model Order {
  id String @id @default(cuid())
  orderNumber String @unique
  
  // Relations
  customerId String
  customer CustomerProfile @relation(fields: [customerId], references: [id])
  
  businessId String
  business BusinessProfile @relation(fields: [businessId], references: [id])
  
  // Order Details
  items OrderItem[]
  totalAmount Float
  status OrderStatus @default(PLACED)
  
  // Timestamps
  placedAt DateTime @default(now())
  confirmedAt DateTime?
  readyAt DateTime?
  completedAt DateTime?
  estimatedReadyTime DateTime?
  actualReadyTime DateTime?
  
  // Pickup
  pickupAddress String
  pickupInstructions String?
  
  // Payment
  paymentMethod PaymentMethod @default(CASH)
  paymentStatus PaymentStatus @default(PENDING)
  paidAt DateTime?
  
  // QR Code
  qrCode String?
  qrCodeExpiry DateTime?
  
  // Notes
  customerNotes String?
  businessNotes String?
  cancellationReason String?
  
  // Relations
  review Review?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([customerId])
  @@index([businessId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id String @id @default(cuid())
  orderId String
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  menuItemId String
  menuItem MenuItem @relation(fields: [menuItemId], references: [id])
  
  quantity Int
  priceAtOrder Float
  specialInstructions String?
  
  @@index([orderId])
  @@map("order_items")
}

model Review {
  id String @id @default(cuid())
  orderId String @unique
  order Order @relation(fields: [orderId], references: [id])
  
  customerId String
  customer CustomerProfile @relation(fields: [customerId], references: [id])
  
  businessId String
  business BusinessProfile @relation(fields: [businessId], references: [id])
  
  rating Int // 1-5
  comment String?
  photos String[]
  
  isPublished Boolean @default(true)
  businessReply String?
  repliedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([businessId])
  @@index([rating])
  @@map("reviews")
}

model Wishlist {
  id String @id @default(cuid())
  
  customerId String
  customer CustomerProfile @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  menuItemId String
  menuItem MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([customerId, menuItemId])
  @@index([customerId])
  @@map("wishlist")
}

model Coupon {
  id String @id @default(cuid())
  
  code String @unique
  discountType String // "PERCENTAGE" | "FIXED"
  discountValue Float
  
  validFor String[] // ["CUSTOMER", "BUSINESS", "ALL"]
  maxUses Int?
  currentUses Int @default(0)
  
  expiryDate DateTime?
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([code])
  @@index([isActive])
  @@map("coupons")
}
```

---

## STEP 9: CREATE DATABASE CONNECTION

Create `lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## STEP 10: CREATE TYPE DEFINITIONS

Create `types/index.ts`:

```typescript
import { UserRole, OrderStatus, DietaryType, MealType } from '@prisma/client';

export interface Business {
  id: string;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  distance: number;
  prepTime: number;
  priceRange: number;
  address: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietaryType: DietaryType;
  mealTypes: MealType[];
  spiceLevel: number;
  prepTime: number;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
  businessId: string;
  businessName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  placedAt: Date;
  estimatedReadyTime?: Date;
  business: {
    name: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}
```

---

## STEP 11: CREATE ENVIRONMENT FILES

Create `.env.example`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Create `.env.local`:
```env
# Copy from .env.example and fill in real values
# This file is gitignored
```

---

## STEP 12: CREATE UTILITY FUNCTIONS

Update `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
}
```

---

## STEP 13: CREATE PLACEHOLDER PAGES

Create `app/page.tsx` (Landing):

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="heading-1 text-primary">
          Welcome to HomeBiz
        </h1>
        <p className="body-large text-gray-600">
          Discover authentic home-cooked meals from your Toronto neighbours
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/browse">Browse Kitchens</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/business/onboarding">Start Selling</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Create placeholder pages for each route with similar structure:
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(customer)/browse/page.tsx`
- `app/(business)/dashboard/page.tsx`
- `app/(admin)/dashboard/page.tsx`

Each placeholder should show:
```typescript
export default function PageName() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="heading-2">Page Name</h1>
      <p className="body text-gray-600 mt-4">
        This page will be built in Phase X
      </p>
    </div>
  );
}
```

---

## STEP 14: INITIALIZE DATABASE

```bash
# Initialize Prisma
npx prisma generate

# Create first migration (will fail until DB connected)
# Run this AFTER adding Supabase credentials to .env.local
npx prisma migrate dev --name init
```

---

## STEP 15: UPDATE PACKAGE.JSON SCRIPTS

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## STEP 16: CREATE .gitignore

Ensure `.gitignore` includes:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/migrations
```

---

## VALIDATION CHECKLIST

After completing all steps, verify:

### ✅ Project Structure
- [ ] All folders created correctly
- [ ] Package.json has all dependencies
- [ ] Tailwind config has custom colors
- [ ] Layout has Plus Jakarta Sans font
- [ ] Global CSS has custom utility classes

### ✅ Database
- [ ] Prisma schema created with all models
- [ ] lib/db.ts exports prisma client
- [ ] .env.example exists
- [ ] Can run `npx prisma generate` without errors

### ✅ TypeScript
- [ ] types/index.ts has base interfaces
- [ ] No TypeScript errors in lib/utils.ts
- [ ] Can build project: `pnpm build`

### ✅ Development
- [ ] Can run: `pnpm dev`
- [ ] Site loads at localhost:3000
- [ ] Landing page shows with correct colors
- [ ] Font loads correctly (Plus Jakarta Sans)
- [ ] Tailwind utilities work

### ✅ Components
- [ ] shadcn/ui components installed
- [ ] Button component works with custom primary color
- [ ] Card component renders correctly

---

## NEXT STEPS

After Phase 1 complete:
1. Connect Supabase database (add credentials to .env.local)
2. Run database migration: `npx prisma migrate dev`
3. Move to Phase 2: Authentication system
4. Use PHASE_2_PROMPT.md for next steps

---

## TROUBLESHOOTING

**Error: "Can't resolve '@/components/ui/button'"**
- Run: `pnpm dlx shadcn@latest add button`

**Error: "Database connection failed"**
- Check .env.local has correct DATABASE_URL
- Verify Supabase project is running

**Error: "Module not found: Can't resolve 'lucide-react'"**
- Run: `pnpm install`
- Clear .next folder: `rm -rf .next`
- Restart dev server

**Tailwind styles not applying:**
- Check tailwind.config.ts content paths
- Restart dev server
- Clear browser cache

---

## DELIVERABLES

This phase creates:
1. ✅ Complete Next.js 15 project structure
2. ✅ Prisma schema with 12 models
3. ✅ Custom design system (Orange/Green theme)
4. ✅ TypeScript types
5. ✅ Utility functions
6. ✅ shadcn/ui components (16 components)
7. ✅ Basic routing structure
8. ✅ Development environment ready

**Estimated time**: 2-3 hours
**Status**: Ready for Phase 2

---

**END OF PHASE 1 PROMPT**

**⚠️ After completing Phase 1, come back and tell me:**
1. ✅ "Phase 1 complete" - I'll provide Phase 2 prompt
2. ❌ "I got error: [describe]" - I'll help fix it
