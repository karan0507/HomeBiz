// Mock data for the business directory platform

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "business" | "customer"
  phone?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  businessCount: number
  featured: boolean
}

export interface Business {
  id: string
  name: string
  slug: string
  categoryId: string
  ownerId: string
  description: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  website?: string
  logo: string
  coverImage: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isPremium: boolean
  status: "active" | "pending" | "suspended"
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }
  createdAt: string
}

export interface Product {
  id: string
  businessId: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  inStock: boolean
  createdAt: string
}

export interface Service {
  id: string
  businessId: string
  name: string
  description: string
  price: number
  duration: string
  available: boolean
  createdAt: string
}

export interface Review {
  id: string
  businessId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  productId?: string
  createdAt: string
  helpful: number
}

export interface Order {
  id: string
  businessId: string
  customerId: string
  customerName: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: string
}

export interface Event {
  id: string
  businessId: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  createdAt: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@bizdir.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    phone: "555-0101",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "john@restaurant.com",
    password: "business123",
    name: "John Doe",
    role: "business",
    phone: "555-0102",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    email: "sarah@cafe.com",
    password: "business123",
    name: "Sarah Smith",
    role: "business",
    phone: "555-0103",
    createdAt: "2024-02-01T00:00:00Z",
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Restaurants",
    slug: "restaurants",
    description: "Discover the best dining experiences",
    icon: "utensils",
    businessCount: 45,
    featured: true,
  },
  {
    id: "2",
    name: "Coffee & Cafes",
    slug: "coffee-cafes",
    description: "Cozy spots for your coffee fix",
    icon: "coffee",
    businessCount: 28,
    featured: true,
  },
  {
    id: "3",
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Fitness, spas, and wellness centers",
    icon: "heart",
    businessCount: 34,
    featured: true,
  },
  {
    id: "4",
    name: "Retail & Shopping",
    slug: "retail-shopping",
    description: "Local shops and boutiques",
    icon: "shopping-bag",
    businessCount: 52,
    featured: true,
  },
  {
    id: "5",
    name: "Professional Services",
    slug: "professional-services",
    description: "Legal, financial, and consulting services",
    icon: "briefcase",
    businessCount: 41,
    featured: false,
  },
  {
    id: "6",
    name: "Home Services",
    slug: "home-services",
    description: "Plumbing, electrical, and repairs",
    icon: "home",
    businessCount: 37,
    featured: false,
  },
]

// Mock Businesses
export const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "The Golden Fork",
    slug: "the-golden-fork",
    categoryId: "1",
    ownerId: "2",
    description: "Fine dining experience with seasonal menus and locally sourced ingredients.",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "555-1234",
    email: "info@goldenfork.com",
    website: "https://goldenfork.com",
    logo: "/restaurant-logo.png",
    coverImage: "/elegant-restaurant-interior.jpg",
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    isPremium: true,
    status: "active",
    openingHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "22:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "21:00" },
    },
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Sunrise Cafe",
    slug: "sunrise-cafe",
    categoryId: "2",
    ownerId: "3",
    description: "Artisan coffee and fresh pastries in a cozy atmosphere.",
    address: "456 Oak Avenue",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    phone: "555-5678",
    email: "hello@sunrisecafe.com",
    website: "https://sunrisecafe.com",
    logo: "/cafe-logo.png",
    coverImage: "/cozy-cafe-interior.png",
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    isPremium: false,
    status: "active",
    openingHours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      wednesday: { open: "07:00", close: "18:00" },
      thursday: { open: "07:00", close: "18:00" },
      friday: { open: "07:00", close: "19:00" },
      saturday: { open: "08:00", close: "19:00" },
      sunday: { open: "08:00", close: "17:00" },
    },
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Urban Fitness Studio",
    slug: "urban-fitness-studio",
    categoryId: "3",
    ownerId: "2",
    description: "Modern fitness studio offering group classes and personal training.",
    address: "789 Fitness Lane",
    city: "Manhattan",
    state: "NY",
    zip: "10002",
    phone: "555-9012",
    email: "info@urbanfitness.com",
    logo: "/fitness-logo.png",
    coverImage: "/modern-gym-interior.png",
    rating: 4.7,
    reviewCount: 56,
    isVerified: true,
    isPremium: true,
    status: "active",
    openingHours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "20:00" },
      saturday: { open: "08:00", close: "18:00" },
      sunday: { open: "08:00", close: "18:00" },
    },
    createdAt: "2024-01-20T00:00:00Z",
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "1",
    businessId: "1",
    name: "Chef Special Tasting Menu",
    description: "7-course tasting menu featuring seasonal ingredients",
    price: 125,
    category: "Dining Experience",
    images: ["/fine-dining-plate.png"],
    inStock: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "2",
    businessId: "2",
    name: "House Blend Coffee",
    description: "Signature medium roast coffee beans",
    price: 15,
    category: "Coffee",
    images: ["/burlap-coffee-beans.png"],
    inStock: true,
    createdAt: "2024-03-05T00:00:00Z",
  },
]

// Mock Services
export const mockServices: Service[] = [
  {
    id: "1",
    businessId: "3",
    name: "Personal Training Session",
    description: "One-on-one training with certified instructor",
    price: 80,
    duration: "60 min",
    available: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "2",
    businessId: "3",
    name: "Group Yoga Class",
    description: "Vinyasa flow yoga class for all levels",
    price: 25,
    duration: "90 min",
    available: true,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: "1",
    businessId: "1",
    userId: "4",
    userName: "Emily Johnson",
    userAvatar: "/diverse-woman-avatar.png",
    rating: 5,
    comment: "Absolutely phenomenal dining experience! The service was impeccable.",
    createdAt: "2024-03-10T00:00:00Z",
    helpful: 12,
  },
  {
    id: "2",
    businessId: "2",
    userId: "5",
    userName: "Michael Brown",
    userAvatar: "/man-avatar.png",
    rating: 5,
    comment: "Best coffee in the neighborhood. The atmosphere is perfect for working.",
    createdAt: "2024-03-12T00:00:00Z",
    helpful: 8,
  },
  {
    id: "3",
    businessId: "3",
    userId: "6",
    userName: "Jessica Lee",
    userAvatar: "/woman-avatar-2.png",
    rating: 5,
    comment: "Great trainers and equipment. Highly recommend the yoga classes!",
    createdAt: "2024-03-15T00:00:00Z",
    helpful: 6,
  },
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "1",
    businessId: "1",
    customerId: "4",
    customerName: "Emily Johnson",
    items: [{ productId: "1", name: "Chef Special Tasting Menu", quantity: 2, price: 125 }],
    total: 250,
    status: "completed",
    createdAt: "2024-03-10T19:30:00Z",
  },
  {
    id: "2",
    businessId: "2",
    customerId: "5",
    customerName: "Michael Brown",
    items: [{ productId: "2", name: "House Blend Coffee", quantity: 1, price: 15 }],
    total: 15,
    status: "processing",
    createdAt: "2024-03-15T10:15:00Z",
  },
]

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "1",
    businessId: "1",
    title: "Wine Tasting Evening",
    description: "Join us for an exclusive wine tasting featuring Italian wines",
    date: "2024-04-20",
    time: "19:00",
    location: "The Golden Fork",
    image: "/wine-tasting.png",
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "2",
    businessId: "2",
    title: "Latte Art Workshop",
    description: "Learn the art of creating beautiful latte designs",
    date: "2024-04-15",
    time: "14:00",
    location: "Sunrise Cafe",
    image: "/latte-art-workshop.png",
    createdAt: "2024-03-05T00:00:00Z",
  },
]
