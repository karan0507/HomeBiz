/**
 * Mock Data for HomeBiz - Home-Cooked Food Delivery Platform
 * "Authentic Home Cooking from Your Toronto Neighbours"
 *
 * Contains all dummy data for:
 * - Users (customers, home chefs/businesses, admins)
 * - Home Kitchens (verified home chefs)
 * - Menu Items (home-cooked dishes)
 * - Categories (cuisine types)
 * - Orders
 * - Reviews with 10 customer personas
 * - Testimonials
 * - FAQ items
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "business" | "customer";
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  subscriptionStatus: "free" | "active" | "expired";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  kitchenCount: number;
  businessCount: number; // Alias for kitchenCount - backward compatibility
  featured: boolean;
  order: number;
}

export interface Kitchen {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cuisineTypes: string[];
  categoryId: string;
  address: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  foodHandlerCertificate: boolean;
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  preparationTime: string; // Average prep time
  minimumOrder: number;
  acceptingOrders: boolean;
  specialties: string[];
  dietaryOptions: string[];
  createdAt: string;
}

export interface MenuItem {
  id: string;
  kitchenId: string;
  businessId: string; // Alias for kitchenId - backward compatibility
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string; // appetizer, main, dessert, beverage, etc.
  cuisineType: string;
  dietaryInfo: string[]; // vegetarian, vegan, halal, gluten-free, etc.
  spiceLevel: "mild" | "medium" | "hot" | "extra-hot";
  prepTime: string;
  servingSize: string;
  calories?: number;
  ingredients: string[];
  allergens: string[];
  available: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  orderCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  kitchenId: string;
  businessId: string; // Alias for kitchenId - backward compatibility
  menuItemId?: string;
  orderId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  response?: string; // Kitchen owner response
  helpful: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  kitchenId: string;
  businessId: string; // Alias for kitchenId - backward compatibility
  kitchenName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  paymentMethod: "cash" | "etransfer";
  paymentStatus: "pending" | "paid";
  orderStatus: "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "completed" | "cancelled";
  status: "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "completed" | "cancelled"; // Alias for orderStatus
  pickupTime: string; // Scheduled pickup time
  pickupAddress: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  rating: number;
  quote: string;
  kitchenOrdered?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "customers" | "chefs" | "orders" | "payments" | "safety";
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
  description: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

// ============================================
// MOCK USERS
// ============================================

export const mockUsers: User[] = [
  // Admins
  {
    id: "admin-1",
    email: "admin@homebiz.ca",
    password: "admin123",
    name: "Priya Sharma",
    role: "admin",
    phone: "416-555-0100",
    avatar: "/avatars/admin-priya.jpg",
    subscriptionStatus: "active",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "admin-2",
    email: "support@homebiz.ca",
    password: "support123",
    name: "Marcus Johnson",
    role: "admin",
    phone: "416-555-0101",
    avatar: "/avatars/admin-marcus.jpg",
    subscriptionStatus: "active",
    createdAt: "2024-01-15T00:00:00Z",
  },
  // Customer (for testing)
  {
    id: "customer-1",
    email: "customer@test.com",
    password: "customer123",
    name: "Test Customer",
    role: "customer",
    phone: "416-555-9999",
    subscriptionStatus: "free",
    createdAt: "2024-06-01T00:00:00Z",
  },
  // Home Chefs (Business Users)
  {
    id: "chef-1",
    email: "amma.kitchen@email.com",
    password: "chef123",
    name: "Lakshmi Venkatesh",
    role: "business",
    phone: "416-555-2001",
    avatar: "/avatars/lakshmi.jpg",
    address: "45 Finch Ave East",
    city: "North York",
    postalCode: "M2N 4R3",
    subscriptionStatus: "free", // First 25 free
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "chef-2",
    email: "nonna.maria@email.com",
    password: "chef123",
    name: "Maria Rossi",
    role: "business",
    phone: "416-555-2002",
    avatar: "/avatars/maria.jpg",
    address: "123 Dufferin Street",
    city: "Toronto",
    postalCode: "M6K 1Y9",
    subscriptionStatus: "free",
    createdAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "chef-3",
    email: "halal.bites@email.com",
    password: "chef123",
    name: "Fatima Ahmed",
    role: "business",
    phone: "647-555-2003",
    avatar: "/avatars/fatima.jpg",
    address: "789 Lawrence Ave West",
    city: "Toronto",
    postalCode: "M6A 1C2",
    subscriptionStatus: "active",
    createdAt: "2024-02-10T00:00:00Z",
  },
  // Customers
  {
    id: "cust-1",
    email: "michael.t@email.com",
    password: "customer123",
    name: "Michael Thompson",
    role: "customer",
    phone: "416-555-1001",
    avatar: "/avatars/michael.jpg",
    address: "200 Sheppard Ave East",
    city: "North York",
    postalCode: "M2N 3A8",
    subscriptionStatus: "free", // First 25 free
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "cust-2",
    email: "sarah.chen@email.com",
    password: "customer123",
    name: "Sarah Chen",
    role: "customer",
    phone: "416-555-1002",
    avatar: "/avatars/sarah.jpg",
    address: "456 Yonge Street",
    city: "Toronto",
    postalCode: "M4Y 1X7",
    subscriptionStatus: "free",
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "cust-3",
    email: "david.kim@email.com",
    password: "customer123",
    name: "David Kim",
    role: "customer",
    phone: "647-555-1003",
    avatar: "/avatars/david.jpg",
    address: "789 Bloor Street West",
    city: "Toronto",
    postalCode: "M6G 1L5",
    subscriptionStatus: "active",
    createdAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "cust-4",
    email: "aisha.patel@email.com",
    password: "customer123",
    name: "Aisha Patel",
    role: "customer",
    phone: "416-555-1004",
    avatar: "/avatars/aisha.jpg",
    address: "321 King Street East",
    city: "Toronto",
    postalCode: "M5A 1L1",
    subscriptionStatus: "active",
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "cust-5",
    email: "james.wilson@email.com",
    password: "customer123",
    name: "James Wilson",
    role: "customer",
    phone: "647-555-1005",
    avatar: "/avatars/james-w.jpg",
    address: "654 Dundas Street West",
    city: "Toronto",
    postalCode: "M5T 1H5",
    subscriptionStatus: "free",
    createdAt: "2024-03-05T00:00:00Z",
  },
];

// ============================================
// MOCK CATEGORIES (Cuisine Types)
// ============================================

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "South Asian",
    slug: "south-asian",
    description: "Authentic Indian, Pakistani, Sri Lankan & Bangladeshi home cooking",
    icon: "Flame",
    image: "/categories/south-asian.jpg",
    kitchenCount: 28,
    businessCount: 28,
    featured: true,
    order: 1,
  },
  {
    id: "cat-2",
    name: "Italian",
    slug: "italian",
    description: "Traditional pasta, risotto, and family recipes from Italy",
    icon: "ChefHat",
    image: "/categories/italian.jpg",
    kitchenCount: 15,
    businessCount: 15,
    featured: true,
    order: 2,
  },
  {
    id: "cat-3",
    name: "Middle Eastern",
    slug: "middle-eastern",
    description: "Lebanese, Syrian, Persian & Turkish homestyle dishes",
    icon: "Salad",
    image: "/categories/middle-eastern.jpg",
    kitchenCount: 18,
    businessCount: 18,
    featured: true,
    order: 3,
  },
  {
    id: "cat-4",
    name: "Caribbean",
    slug: "caribbean",
    description: "Jamaican, Trinidadian & West Indian comfort food",
    icon: "Palmtree",
    image: "/categories/caribbean.jpg",
    kitchenCount: 12,
    businessCount: 12,
    featured: true,
    order: 4,
  },
  {
    id: "cat-5",
    name: "East Asian",
    slug: "east-asian",
    description: "Chinese, Korean, Japanese & Vietnamese home recipes",
    icon: "Soup",
    image: "/categories/east-asian.jpg",
    kitchenCount: 22,
    businessCount: 22,
    featured: false,
    order: 5,
  },
  {
    id: "cat-6",
    name: "Latin American",
    slug: "latin-american",
    description: "Mexican, Colombian, Brazilian & Peruvian family favorites",
    icon: "Utensils",
    image: "/categories/latin-american.jpg",
    kitchenCount: 14,
    businessCount: 14,
    featured: false,
    order: 6,
  },
  {
    id: "cat-7",
    name: "African",
    slug: "african",
    description: "Ethiopian, Nigerian, Ghanaian & North African cuisine",
    icon: "Sun",
    image: "/categories/african.jpg",
    kitchenCount: 10,
    businessCount: 10,
    featured: false,
    order: 7,
  },
  {
    id: "cat-8",
    name: "Comfort Food",
    slug: "comfort-food",
    description: "Classic Canadian & American homestyle favorites",
    icon: "Heart",
    image: "/categories/comfort-food.jpg",
    kitchenCount: 16,
    businessCount: 16,
    featured: false,
    order: 8,
  },
];

// ============================================
// MOCK KITCHENS (Home Chefs)
// ============================================

export const mockKitchens: Kitchen[] = [
  {
    id: "kitchen-1",
    ownerId: "chef-1",
    name: "Amma's Kitchen",
    slug: "ammas-kitchen",
    tagline: "Taste of Tamil Nadu in North York",
    description: "Welcome to Amma's Kitchen! I'm Lakshmi, and I've been cooking authentic South Indian food for over 30 years. Every dish is made with love using traditional recipes passed down from my grandmother. From crispy dosas to aromatic biryanis, experience the true taste of Tamil Nadu right here in Toronto.",
    cuisineTypes: ["South Indian", "Tamil"],
    categoryId: "cat-1",
    address: "45 Finch Ave East",
    neighborhood: "North York",
    city: "Toronto",
    postalCode: "M2N 4R3",
    phone: "416-555-2001",
    email: "amma.kitchen@email.com",
    logo: "/kitchens/amma-logo.jpg",
    coverImage: "/kitchens/amma-cover.jpg",
    rating: 4.9,
    reviewCount: 156,
    totalOrders: 892,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { open: "11:00", close: "20:00" },
      tuesday: { open: "11:00", close: "20:00" },
      wednesday: { open: "11:00", close: "20:00" },
      thursday: { open: "11:00", close: "20:00" },
      friday: { open: "11:00", close: "21:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "10:00", close: "20:00" },
    },
    preparationTime: "45-60 min",
    minimumOrder: 15,
    acceptingOrders: true,
    specialties: ["Dosa", "Biryani", "Sambar", "Idli"],
    dietaryOptions: ["Vegetarian", "Vegan Options", "Halal"],
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "kitchen-2",
    ownerId: "chef-2",
    name: "Nonna Maria's Table",
    slug: "nonna-marias-table",
    tagline: "Authentic Italian from Napoli",
    description: "Ciao! I'm Maria, originally from Naples, Italy. For 40 years, I've been making pasta from scratch, just like my Nonna taught me. Every Sunday, my kitchen smells like tomato sauce simmering for hours. Now I want to share these family recipes with my Toronto neighbours. Come taste real Italian comfort food!",
    cuisineTypes: ["Italian", "Neapolitan"],
    categoryId: "cat-2",
    address: "123 Dufferin Street",
    neighborhood: "Little Italy",
    city: "Toronto",
    postalCode: "M6K 1Y9",
    phone: "416-555-2002",
    email: "nonna.maria@email.com",
    logo: "/kitchens/nonna-logo.jpg",
    coverImage: "/kitchens/nonna-cover.jpg",
    rating: 4.8,
    reviewCount: 98,
    totalOrders: 567,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { closed: true, open: "", close: "" },
      tuesday: { open: "12:00", close: "19:00" },
      wednesday: { open: "12:00", close: "19:00" },
      thursday: { open: "12:00", close: "19:00" },
      friday: { open: "12:00", close: "20:00" },
      saturday: { open: "11:00", close: "20:00" },
      sunday: { open: "11:00", close: "18:00" },
    },
    preparationTime: "60-90 min",
    minimumOrder: 20,
    acceptingOrders: true,
    specialties: ["Fresh Pasta", "Lasagna", "Tiramisu", "Gnocchi"],
    dietaryOptions: ["Vegetarian Options", "Nut-Free Options"],
    createdAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "kitchen-3",
    ownerId: "chef-3",
    name: "Fatima's Halal Bites",
    slug: "fatimas-halal-bites",
    tagline: "Authentic Pakistani Home Cooking",
    description: "Assalamu Alaikum! I'm Fatima, and I bring the flavors of Lahore to your table. All my dishes are 100% halal, made with zabihah meat and fresh spices. From butter chicken to seekh kebabs, every dish is prepared with care and prayer. Perfect for families looking for authentic Pakistani food!",
    cuisineTypes: ["Pakistani", "North Indian"],
    categoryId: "cat-1",
    address: "789 Lawrence Ave West",
    neighborhood: "Lawrence Park",
    city: "Toronto",
    postalCode: "M6A 1C2",
    phone: "647-555-2003",
    email: "halal.bites@email.com",
    logo: "/kitchens/fatima-logo.jpg",
    coverImage: "/kitchens/fatima-cover.jpg",
    rating: 4.7,
    reviewCount: 84,
    totalOrders: 445,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { open: "11:00", close: "21:00" },
      tuesday: { open: "11:00", close: "21:00" },
      wednesday: { open: "11:00", close: "21:00" },
      thursday: { open: "11:00", close: "21:00" },
      friday: { open: "14:00", close: "22:00" }, // Later start for Jummah
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "11:00", close: "21:00" },
    },
    preparationTime: "45-60 min",
    minimumOrder: 18,
    acceptingOrders: true,
    specialties: ["Biryani", "Butter Chicken", "Seekh Kebab", "Nihari"],
    dietaryOptions: ["Halal Certified", "Nut-Free Options"],
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "kitchen-4",
    ownerId: "chef-4",
    name: "Auntie Joyce's Jamaican",
    slug: "auntie-joyces-jamaican",
    tagline: "Real Jamaican Flavor, Mon!",
    description: "Wah gwaan! I'm Joyce, born and raised in Kingston, Jamaica. My jerk chicken recipe has been in my family for generations. Every Saturday, I slow-cook my oxtail for 6 hours until it falls off the bone. Come taste real Jamaican food - none of that watered-down restaurant stuff!",
    cuisineTypes: ["Jamaican", "Caribbean"],
    categoryId: "cat-4",
    address: "456 Eglinton Ave West",
    neighborhood: "Little Jamaica",
    city: "Toronto",
    postalCode: "M5N 1A2",
    phone: "416-555-2004",
    email: "auntie.joyce@email.com",
    logo: "/kitchens/joyce-logo.jpg",
    coverImage: "/kitchens/joyce-cover.jpg",
    rating: 4.9,
    reviewCount: 127,
    totalOrders: 678,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { closed: true, open: "", close: "" },
      tuesday: { open: "12:00", close: "20:00" },
      wednesday: { open: "12:00", close: "20:00" },
      thursday: { open: "12:00", close: "20:00" },
      friday: { open: "12:00", close: "21:00" },
      saturday: { open: "11:00", close: "21:00" },
      sunday: { open: "12:00", close: "19:00" },
    },
    preparationTime: "30-45 min",
    minimumOrder: 15,
    acceptingOrders: true,
    specialties: ["Jerk Chicken", "Oxtail", "Curry Goat", "Ackee & Saltfish"],
    dietaryOptions: ["Gluten-Free Options", "Dairy-Free"],
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "kitchen-5",
    ownerId: "chef-5",
    name: "Baba's Lebanese Kitchen",
    slug: "babas-lebanese-kitchen",
    tagline: "From Beirut with Love",
    description: "Marhaba! I'm Hassan, but everyone calls me Baba. I came from Lebanon 20 years ago and brought my family recipes with me. My hummus is made fresh daily, my falafel is crispy outside and fluffy inside, and my shawarma... well, you'll have to taste it yourself!",
    cuisineTypes: ["Lebanese", "Middle Eastern"],
    categoryId: "cat-3",
    address: "234 Danforth Ave",
    neighborhood: "Greektown",
    city: "Toronto",
    postalCode: "M4K 1N6",
    phone: "647-555-2005",
    email: "baba.lebanese@email.com",
    logo: "/kitchens/baba-logo.jpg",
    coverImage: "/kitchens/baba-cover.jpg",
    rating: 4.8,
    reviewCount: 92,
    totalOrders: 523,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { open: "11:00", close: "20:00" },
      tuesday: { open: "11:00", close: "20:00" },
      wednesday: { open: "11:00", close: "20:00" },
      thursday: { open: "11:00", close: "20:00" },
      friday: { open: "11:00", close: "21:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "10:00", close: "19:00" },
    },
    preparationTime: "30-45 min",
    minimumOrder: 20,
    acceptingOrders: true,
    specialties: ["Shawarma", "Falafel", "Hummus", "Tabbouleh"],
    dietaryOptions: ["Vegetarian", "Vegan Options", "Halal"],
    createdAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "kitchen-6",
    ownerId: "chef-6",
    name: "Mama Chen's Dumplings",
    slug: "mama-chens-dumplings",
    tagline: "Handmade with 40 Years of Love",
    description: "Ni hao! I'm Mei Chen, but everyone calls me Mama Chen. I've been making dumplings since I was a little girl in Sichuan. Every dumpling is hand-folded with love. My xiao long bao takes 3 days to prepare properly. If you want authentic Chinese food like your Chinese friend's mom makes, you found the right place!",
    cuisineTypes: ["Chinese", "Sichuan"],
    categoryId: "cat-5",
    address: "567 Spadina Ave",
    neighborhood: "Chinatown",
    city: "Toronto",
    postalCode: "M5S 2H4",
    phone: "416-555-2006",
    email: "mama.chen@email.com",
    logo: "/kitchens/chen-logo.jpg",
    coverImage: "/kitchens/chen-cover.jpg",
    rating: 4.9,
    reviewCount: 201,
    totalOrders: 1124,
    isVerified: true,
    verificationStatus: "approved",
    foodHandlerCertificate: true,
    operatingHours: {
      monday: { open: "11:00", close: "19:00" },
      tuesday: { open: "11:00", close: "19:00" },
      wednesday: { open: "11:00", close: "19:00" },
      thursday: { open: "11:00", close: "19:00" },
      friday: { open: "11:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: { open: "10:00", close: "18:00" },
    },
    preparationTime: "45-60 min",
    minimumOrder: 25,
    acceptingOrders: true,
    specialties: ["Dumplings", "Xiao Long Bao", "Dan Dan Noodles", "Mapo Tofu"],
    dietaryOptions: ["Vegetarian Options", "Can Adjust Spice Level"],
    createdAt: "2024-02-25T00:00:00Z",
  },
];

// ============================================
// MOCK MENU ITEMS
// ============================================

export const mockMenuItems: MenuItem[] = [
  // Amma's Kitchen Items
  {
    id: "item-1",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    name: "Masala Dosa",
    slug: "masala-dosa",
    description: "Crispy golden crepe made from fermented rice and lentil batter, filled with spiced potato masala. Served with sambar and three chutneys.",
    price: 12.99,
    images: ["/menu/masala-dosa.jpg"],
    category: "main",
    cuisineType: "South Indian",
    dietaryInfo: ["Vegetarian", "Vegan"],
    spiceLevel: "medium",
    prepTime: "20 min",
    servingSize: "1 large dosa",
    calories: 350,
    ingredients: ["Rice", "Urad dal", "Potatoes", "Onions", "Mustard seeds", "Curry leaves"],
    allergens: [],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 89,
    orderCount: 456,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "item-2",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    name: "Chicken Biryani",
    slug: "chicken-biryani",
    description: "Fragrant basmati rice layered with tender chicken pieces, slow-cooked with saffron, whole spices, and fried onions. A family recipe perfected over generations.",
    price: 16.99,
    images: ["/menu/chicken-biryani.jpg"],
    category: "main",
    cuisineType: "South Indian",
    dietaryInfo: ["Halal", "Contains Dairy"],
    spiceLevel: "medium",
    prepTime: "45 min",
    servingSize: "Serves 1-2",
    calories: 650,
    ingredients: ["Basmati rice", "Chicken", "Yogurt", "Saffron", "Biryani spices", "Fried onions"],
    allergens: ["Dairy"],
    available: true,
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    orderCount: 678,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "item-3",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    name: "Idli Sambar Combo",
    slug: "idli-sambar-combo",
    description: "4 soft, fluffy steamed rice cakes served with piping hot sambar and coconut chutney. The perfect light meal or breakfast.",
    price: 9.99,
    images: ["/menu/idli-sambar.jpg"],
    category: "main",
    cuisineType: "South Indian",
    dietaryInfo: ["Vegetarian", "Vegan"],
    spiceLevel: "mild",
    prepTime: "15 min",
    servingSize: "4 idlis",
    calories: 280,
    ingredients: ["Rice", "Urad dal", "Toor dal", "Vegetables", "Tamarind"],
    allergens: [],
    available: true,
    featured: false,
    rating: 4.7,
    reviewCount: 56,
    orderCount: 234,
    createdAt: "2024-02-01T00:00:00Z",
  },
  // Nonna Maria's Items
  {
    id: "item-4",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    name: "Fresh Tagliatelle Bolognese",
    slug: "tagliatelle-bolognese",
    description: "Hand-rolled fresh tagliatelle pasta with my grandmother's authentic Bolognese sauce, slow-simmered for 4 hours with Italian tomatoes, beef, and red wine.",
    price: 18.99,
    images: ["/menu/tagliatelle.jpg"],
    category: "main",
    cuisineType: "Italian",
    dietaryInfo: ["Contains Gluten", "Contains Dairy"],
    spiceLevel: "mild",
    prepTime: "60 min",
    servingSize: "Generous portion",
    calories: 580,
    ingredients: ["Fresh pasta", "Ground beef", "San Marzano tomatoes", "Red wine", "Parmesan"],
    allergens: ["Gluten", "Dairy"],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 78,
    orderCount: 345,
    createdAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "item-5",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    name: "Nonna's Lasagna",
    slug: "nonnas-lasagna",
    description: "Layers of fresh pasta, rich meat ragu, creamy béchamel, and melted mozzarella. Baked until golden and bubbling. Just like in Napoli!",
    price: 22.99,
    images: ["/menu/lasagna.jpg"],
    category: "main",
    cuisineType: "Italian",
    dietaryInfo: ["Contains Gluten", "Contains Dairy"],
    spiceLevel: "mild",
    prepTime: "90 min",
    servingSize: "Large portion",
    calories: 720,
    ingredients: ["Fresh pasta sheets", "Beef ragu", "Béchamel", "Mozzarella", "Parmesan"],
    allergens: ["Gluten", "Dairy"],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 92,
    orderCount: 412,
    createdAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "item-6",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    name: "Tiramisu",
    slug: "tiramisu",
    description: "Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream. Made fresh daily, dusted with cocoa.",
    price: 8.99,
    images: ["/menu/tiramisu.jpg"],
    category: "dessert",
    cuisineType: "Italian",
    dietaryInfo: ["Vegetarian", "Contains Dairy", "Contains Eggs"],
    spiceLevel: "mild",
    prepTime: "N/A",
    servingSize: "1 slice",
    calories: 350,
    ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Eggs", "Cocoa"],
    allergens: ["Dairy", "Eggs", "Gluten"],
    available: true,
    featured: false,
    rating: 4.8,
    reviewCount: 45,
    orderCount: 189,
    createdAt: "2024-02-05T00:00:00Z",
  },
  // Fatima's Halal Bites
  {
    id: "item-7",
    kitchenId: "kitchen-3",
    businessId: "kitchen-3",
    name: "Lahori Butter Chicken",
    slug: "lahori-butter-chicken",
    description: "Tender chicken pieces in a rich, creamy tomato-based curry with butter and cream. Authentic Lahori recipe, 100% halal zabihah meat.",
    price: 15.99,
    images: ["/menu/butter-chicken.jpg"],
    category: "main",
    cuisineType: "Pakistani",
    dietaryInfo: ["Halal Certified", "Contains Dairy", "Gluten-Free"],
    spiceLevel: "medium",
    prepTime: "30 min",
    servingSize: "Serves 1-2",
    calories: 520,
    ingredients: ["Halal chicken", "Tomatoes", "Cream", "Butter", "Garam masala"],
    allergens: ["Dairy"],
    available: true,
    featured: true,
    rating: 4.8,
    reviewCount: 67,
    orderCount: 289,
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "item-8",
    kitchenId: "kitchen-3",
    businessId: "kitchen-3",
    name: "Hyderabadi Biryani",
    slug: "hyderabadi-biryani",
    description: "Aromatic layered biryani with marinated halal lamb, fragrant basmati rice, saffron, and crispy fried onions. Served with raita and mirchi ka salan.",
    price: 19.99,
    images: ["/menu/hyderabadi-biryani.jpg"],
    category: "main",
    cuisineType: "Pakistani",
    dietaryInfo: ["Halal Certified", "Contains Dairy"],
    spiceLevel: "hot",
    prepTime: "60 min",
    servingSize: "Generous portion",
    calories: 680,
    ingredients: ["Halal lamb", "Basmati rice", "Saffron", "Yogurt", "Biryani spices"],
    allergens: ["Dairy"],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 89,
    orderCount: 367,
    createdAt: "2024-02-10T00:00:00Z",
  },
  // Auntie Joyce's Jamaican
  {
    id: "item-9",
    kitchenId: "kitchen-4",
    businessId: "kitchen-4",
    name: "Jerk Chicken Dinner",
    slug: "jerk-chicken-dinner",
    description: "Authentic Jamaican jerk chicken marinated for 24 hours in my secret spice blend, grilled to perfection. Served with rice & peas, plantains, and coleslaw.",
    price: 17.99,
    images: ["/menu/jerk-chicken.jpg"],
    category: "main",
    cuisineType: "Jamaican",
    dietaryInfo: ["Gluten-Free", "Dairy-Free"],
    spiceLevel: "hot",
    prepTime: "30 min",
    servingSize: "Full dinner",
    calories: 620,
    ingredients: ["Chicken", "Scotch bonnet", "Allspice", "Thyme", "Rice", "Kidney beans"],
    allergens: [],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 112,
    orderCount: 534,
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "item-10",
    kitchenId: "kitchen-4",
    businessId: "kitchen-4",
    name: "Oxtail Stew",
    slug: "oxtail-stew",
    description: "Slow-cooked for 6 hours until the meat falls off the bone. Rich, hearty stew with butter beans. Served with rice & peas. Saturday special!",
    price: 24.99,
    images: ["/menu/oxtail.jpg"],
    category: "main",
    cuisineType: "Jamaican",
    dietaryInfo: ["Gluten-Free"],
    spiceLevel: "medium",
    prepTime: "Pre-order required",
    servingSize: "Generous portion",
    calories: 780,
    ingredients: ["Oxtail", "Butter beans", "Thyme", "Scotch bonnet", "Browning sauce"],
    allergens: [],
    available: true,
    featured: true,
    rating: 5.0,
    reviewCount: 78,
    orderCount: 234,
    createdAt: "2024-02-15T00:00:00Z",
  },
  // Baba's Lebanese Kitchen
  {
    id: "item-11",
    kitchenId: "kitchen-5",
    businessId: "kitchen-5",
    name: "Chicken Shawarma Plate",
    slug: "chicken-shawarma-plate",
    description: "Tender marinated chicken shaved from the vertical spit, served with garlic sauce, pickled turnips, hummus, and fresh pita bread.",
    price: 16.99,
    images: ["/menu/shawarma.jpg"],
    category: "main",
    cuisineType: "Lebanese",
    dietaryInfo: ["Halal"],
    spiceLevel: "mild",
    prepTime: "20 min",
    servingSize: "Full plate",
    calories: 580,
    ingredients: ["Halal chicken", "Garlic sauce", "Pickles", "Hummus", "Pita"],
    allergens: ["Gluten", "Sesame"],
    available: true,
    featured: true,
    rating: 4.8,
    reviewCount: 78,
    orderCount: 423,
    createdAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "item-12",
    kitchenId: "kitchen-5",
    businessId: "kitchen-5",
    name: "Falafel Wrap",
    slug: "falafel-wrap",
    description: "Crispy homemade falafel balls wrapped in fresh pita with tahini, pickled vegetables, and fresh herbs. 100% vegan.",
    price: 12.99,
    images: ["/menu/falafel.jpg"],
    category: "main",
    cuisineType: "Lebanese",
    dietaryInfo: ["Vegan", "Halal"],
    spiceLevel: "mild",
    prepTime: "15 min",
    servingSize: "Large wrap",
    calories: 420,
    ingredients: ["Chickpeas", "Herbs", "Tahini", "Pickled vegetables", "Pita"],
    allergens: ["Gluten", "Sesame"],
    available: true,
    featured: true,
    rating: 4.7,
    reviewCount: 56,
    orderCount: 289,
    createdAt: "2024-02-20T00:00:00Z",
  },
  // Mama Chen's Dumplings
  {
    id: "item-13",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    name: "Pork & Chive Dumplings (20 pcs)",
    slug: "pork-chive-dumplings",
    description: "Hand-folded dumplings with juicy pork and fresh chive filling. Each dumpling is made to order. Choose steamed or pan-fried.",
    price: 14.99,
    images: ["/menu/pork-dumplings.jpg"],
    category: "main",
    cuisineType: "Chinese",
    dietaryInfo: ["Contains Pork"],
    spiceLevel: "mild",
    prepTime: "30 min",
    servingSize: "20 dumplings",
    calories: 480,
    ingredients: ["Pork", "Chives", "Ginger", "Flour wrapper"],
    allergens: ["Gluten"],
    available: true,
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    orderCount: 789,
    createdAt: "2024-02-25T00:00:00Z",
  },
  {
    id: "item-14",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    name: "Xiao Long Bao (10 pcs)",
    slug: "xiao-long-bao",
    description: "Shanghai-style soup dumplings with delicate skin and savory pork filling swimming in hot broth. 3-day preparation process!",
    price: 16.99,
    images: ["/menu/xiao-long-bao.jpg"],
    category: "main",
    cuisineType: "Chinese",
    dietaryInfo: ["Contains Pork"],
    spiceLevel: "mild",
    prepTime: "45 min",
    servingSize: "10 dumplings",
    calories: 380,
    ingredients: ["Pork", "Pork gelatin", "Ginger", "Thin wrapper"],
    allergens: ["Gluten"],
    available: true,
    featured: true,
    rating: 5.0,
    reviewCount: 178,
    orderCount: 567,
    createdAt: "2024-02-25T00:00:00Z",
  },
  {
    id: "item-15",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    name: "Dan Dan Noodles",
    slug: "dan-dan-noodles",
    description: "Spicy Sichuan noodles with minced pork, preserved vegetables, and a numbing chili oil sauce. Authentic mala flavor!",
    price: 13.99,
    images: ["/menu/dan-dan-noodles.jpg"],
    category: "main",
    cuisineType: "Chinese",
    dietaryInfo: ["Contains Pork", "Spicy"],
    spiceLevel: "extra-hot",
    prepTime: "20 min",
    servingSize: "Large bowl",
    calories: 520,
    ingredients: ["Wheat noodles", "Pork", "Sichuan peppercorn", "Chili oil", "Preserved vegetables"],
    allergens: ["Gluten", "Soy", "Sesame"],
    available: true,
    featured: false,
    rating: 4.8,
    reviewCount: 89,
    orderCount: 345,
    createdAt: "2024-02-25T00:00:00Z",
  },
];

// ============================================
// MOCK REVIEWS (10 Customer Personas)
// ============================================

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    menuItemId: "item-1",
    orderId: "ord-1",
    userId: "cust-1",
    userName: "Michael T.",
    userAvatar: "/avatars/michael.jpg",
    rating: 5,
    title: "Best dosa in Toronto, hands down!",
    comment: "I've tried every South Indian restaurant in the city, but Amma's dosa is on another level. The batter is perfectly fermented, crispy on the outside, soft inside. The potato masala has that authentic home-cooked taste you just can't get at restaurants. Lakshmi aunty even included extra chutney because I mentioned I love coconut chutney. This is what HomeBiz is all about!",
    helpful: 45,
    createdAt: "2024-03-01T14:30:00Z",
  },
  {
    id: "rev-2",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    menuItemId: "item-5",
    orderId: "ord-2",
    userId: "cust-2",
    userName: "Sarah C.",
    userAvatar: "/avatars/sarah.jpg",
    rating: 5,
    title: "My Italian grandmother would approve",
    comment: "As someone who grew up eating my Nonna's cooking in Montreal, I know real Italian food. Maria's lasagna transported me back to Sunday dinners at grandma's house. The pasta is clearly homemade, the meat sauce has depth from hours of simmering, and the béchamel is perfectly creamy. Worth every penny!",
    response: "Grazie mille, Sarah! Your kind words made my day. Come back for my gnocchi next time! - Maria",
    helpful: 38,
    createdAt: "2024-03-05T18:45:00Z",
  },
  {
    id: "rev-3",
    kitchenId: "kitchen-3",
    businessId: "kitchen-3",
    menuItemId: "item-8",
    orderId: "ord-3",
    userId: "cust-3",
    userName: "David K.",
    userAvatar: "/avatars/david.jpg",
    rating: 5,
    title: "Finally found authentic halal Pakistani food!",
    comment: "Being a Muslim, finding truly halal food with authentic taste has always been a challenge. Fatima aunty's biryani is exactly like my mom used to make back in Karachi. The meat is properly zabihah, the rice is perfectly layered, and the flavors are incredible. My whole family is hooked now!",
    helpful: 52,
    createdAt: "2024-03-08T12:15:00Z",
  },
  {
    id: "rev-4",
    kitchenId: "kitchen-4",
    businessId: "kitchen-4",
    menuItemId: "item-9",
    orderId: "ord-4",
    userId: "cust-4",
    userName: "Aisha P.",
    userAvatar: "/avatars/aisha.jpg",
    rating: 5,
    title: "The jerk chicken of my dreams!",
    comment: "I'm from Trinidad originally, but I married a Jamaican man and have been searching for jerk chicken that meets his standards. Auntie Joyce delivered! He took one bite and said 'This tastes like yard food.' That's the highest compliment. The scotch bonnet heat is perfect, not overwhelming.",
    helpful: 41,
    createdAt: "2024-03-10T16:00:00Z",
  },
  {
    id: "rev-5",
    kitchenId: "kitchen-5",
    businessId: "kitchen-5",
    menuItemId: "item-11",
    orderId: "ord-5",
    userId: "cust-5",
    userName: "James W.",
    userAvatar: "/avatars/james-w.jpg",
    rating: 5,
    title: "Better than any shawarma shop!",
    comment: "I eat shawarma at least twice a week and thought I knew the best spots. Baba's chicken shawarma changed my mind. The garlic sauce is garlicky without being overpowering, the chicken is juicy and well-seasoned, and you can taste the homemade quality. Plus the portions are huge!",
    helpful: 33,
    createdAt: "2024-03-12T13:30:00Z",
  },
  {
    id: "rev-6",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    menuItemId: "item-14",
    orderId: "ord-6",
    userId: "cust-1",
    userName: "Michael T.",
    userAvatar: "/avatars/michael.jpg",
    rating: 5,
    title: "These soup dumplings are LEGIT",
    comment: "I've been to Din Tai Fung in Taipei, and Mama Chen's xiao long bao are just as good. The skin is thin enough to see the soup inside, but strong enough not to break. The soup-to-meat ratio is perfect. Mama Chen told me she uses a 3-day process - you can taste the dedication!",
    helpful: 67,
    createdAt: "2024-03-15T11:00:00Z",
  },
  {
    id: "rev-7",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    menuItemId: "item-2",
    orderId: "ord-7",
    userId: "cust-2",
    userName: "Sarah C.",
    userAvatar: "/avatars/sarah.jpg",
    rating: 4,
    title: "Delicious biryani, slightly late pickup",
    comment: "The biryani itself is absolutely fantastic - fragrant, flavorful, and generous portions. Only giving 4 stars because my pickup was 20 minutes later than scheduled. But Lakshmi aunty apologized and gave me free mango lassi, so I'll definitely order again!",
    response: "Sorry for the delay, Sarah! Biryani takes time to do right, but I'll manage my timing better. Thank you for understanding! - Lakshmi",
    helpful: 28,
    createdAt: "2024-03-18T19:45:00Z",
  },
  {
    id: "rev-8",
    kitchenId: "kitchen-4",
    businessId: "kitchen-4",
    menuItemId: "item-10",
    orderId: "ord-8",
    userId: "cust-3",
    userName: "David K.",
    userAvatar: "/avatars/david.jpg",
    rating: 5,
    title: "Oxtail that melts in your mouth",
    comment: "Pre-ordered the oxtail for Saturday and it was worth the wait. The meat literally falls off the bone. The gravy is rich and flavorful. The butter beans absorb all that goodness. I ate it with the rice and peas and felt like I was in Kingston. Pure comfort food!",
    helpful: 44,
    createdAt: "2024-03-20T20:30:00Z",
  },
  {
    id: "rev-9",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    menuItemId: "item-6",
    orderId: "ord-9",
    userId: "cust-4",
    userName: "Aisha P.",
    userAvatar: "/avatars/aisha.jpg",
    rating: 5,
    title: "Best tiramisu I've ever had!",
    comment: "I ordered lasagna for my husband and added tiramisu on a whim. OH MY GOD. The mascarpone is so fresh and creamy, the espresso flavor is strong but not bitter, and it's not overly sweet like restaurant versions. Maria clearly uses quality ingredients. Already craving more!",
    helpful: 29,
    createdAt: "2024-03-22T15:15:00Z",
  },
  {
    id: "rev-10",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    menuItemId: "item-13",
    orderId: "ord-10",
    userId: "cust-5",
    userName: "James W.",
    userAvatar: "/avatars/james-w.jpg",
    rating: 5,
    title: "Dumplings worth driving across the city for",
    comment: "I live in Scarborough and drove to Chinatown for these dumplings. No regrets! Each one is perfectly pleated, the filling is juicy with that ginger kick, and they pan-fry them to golden perfection. Mama Chen even showed me proper dumpling-eating technique. What a gem!",
    helpful: 36,
    createdAt: "2024-03-25T12:00:00Z",
  },
];

// ============================================
// TESTIMONIALS (10 Customer Personas)
// ============================================

export const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Michael Thompson",
    role: "Software Developer",
    avatar: "/avatars/michael.jpg",
    location: "North York",
    rating: 5,
    quote: "As a busy professional working from home, HomeBiz has been a game-changer. I get authentic home-cooked meals from talented neighbours instead of ordering the same boring takeout. The dosas from Amma's Kitchen are now my Friday treat!",
    kitchenOrdered: "Amma's Kitchen",
  },
  {
    id: "test-2",
    name: "Sarah Chen",
    role: "Marketing Manager",
    avatar: "/avatars/sarah.jpg",
    location: "Downtown Toronto",
    rating: 5,
    quote: "I moved to Toronto from Montreal and missed my grandmother's Italian cooking. Then I discovered Nonna Maria on HomeBiz. Her lasagna tastes exactly like home. I've even started ordering for my office lunch meetings!",
    kitchenOrdered: "Nonna Maria's Table",
  },
  {
    id: "test-3",
    name: "David Kim",
    role: "University Student",
    avatar: "/avatars/david.jpg",
    location: "Annex",
    rating: 5,
    quote: "Finding halal food that actually tastes like mom's cooking was impossible until HomeBiz. Now I order from Fatima aunty every week. The prices are reasonable for students too, and the portions are generous!",
    kitchenOrdered: "Fatima's Halal Bites",
  },
  {
    id: "test-4",
    name: "Aisha Patel",
    role: "Nurse",
    avatar: "/avatars/aisha.jpg",
    location: "Scarborough",
    rating: 5,
    quote: "After 12-hour shifts, the last thing I want to do is cook. HomeBiz lets me support home chefs in my community while enjoying real, nutritious food. Auntie Joyce's jerk chicken is my go-to comfort meal after a tough day.",
    kitchenOrdered: "Auntie Joyce's Jamaican",
  },
  {
    id: "test-5",
    name: "James Wilson",
    role: "Accountant",
    avatar: "/avatars/james-w.jpg",
    location: "Etobicoke",
    rating: 5,
    quote: "I'm a single dad with two picky kids. HomeBiz has been a lifesaver - I can find cuisines my kids actually enjoy, and I know the food is made with care by real people. Mama Chen's dumplings are now a weekly family tradition!",
    kitchenOrdered: "Mama Chen's Dumplings",
  },
  {
    id: "test-6",
    name: "Priya Sharma",
    role: "Teacher",
    avatar: "/avatars/priya.jpg",
    location: "Mississauga",
    rating: 5,
    quote: "As a vegetarian, finding flavorful meat-free options used to be challenging. HomeBiz chefs accommodate dietary needs with genuine care. The South Indian vegetarian spread from Amma's Kitchen is my favorite!",
    kitchenOrdered: "Amma's Kitchen",
  },
  {
    id: "test-7",
    name: "Omar Hassan",
    role: "Engineer",
    avatar: "/avatars/omar.jpg",
    location: "Thornhill",
    rating: 5,
    quote: "The Lebanese food from Baba's Kitchen reminds me of my childhood in Beirut. It's authentic, made with love, and I can trust it's properly halal. HomeBiz connects us with the flavors of home.",
    kitchenOrdered: "Baba's Lebanese Kitchen",
  },
  {
    id: "test-8",
    name: "Jennifer Lee",
    role: "Entrepreneur",
    avatar: "/avatars/jennifer.jpg",
    location: "Richmond Hill",
    rating: 5,
    quote: "I started using HomeBiz as a customer, and now I'm also a home chef! The platform helped me turn my passion for Korean cooking into a side business. The community is so supportive!",
    kitchenOrdered: "Multiple Kitchens",
  },
  {
    id: "test-9",
    name: "Carlos Rodriguez",
    role: "Construction Manager",
    avatar: "/avatars/carlos.jpg",
    location: "Brampton",
    rating: 5,
    quote: "My crew loves when I bring HomeBiz food to the job site. Real home-cooked meals beat fast food any day. The variety is amazing - we've tried Caribbean, Indian, Italian... everyone's happy!",
    kitchenOrdered: "Various Kitchens",
  },
  {
    id: "test-10",
    name: "Emily Zhang",
    role: "Graduate Student",
    avatar: "/avatars/emily.jpg",
    location: "Downtown Toronto",
    rating: 5,
    quote: "Living far from family, I miss home-cooked Chinese food. Mama Chen's dumplings taste exactly like my grandma's. HomeBiz isn't just about food - it's about finding that feeling of home in a new city.",
    kitchenOrdered: "Mama Chen's Dumplings",
  },
];

// ============================================
// FAQ ITEMS
// ============================================

export const mockFAQs: FAQItem[] = [
  // General
  {
    id: "faq-1",
    question: "What is HomeBiz?",
    answer: "HomeBiz is a platform that connects you with talented home chefs in your Toronto neighbourhood. These are passionate cooks who prepare authentic, home-cooked meals from their own kitchens. Think of it as getting food from a friend's mom who happens to be an amazing cook!",
    category: "general",
  },
  {
    id: "faq-2",
    question: "How is HomeBiz different from restaurants or food delivery apps?",
    answer: "Unlike restaurants, HomeBiz meals are prepared by home cooks using family recipes passed down through generations. You get authentic, culturally rich dishes that you simply can't find at commercial establishments. Plus, you're supporting your neighbours and local community directly.",
    category: "general",
  },
  {
    id: "faq-3",
    question: "Which areas in Toronto do you serve?",
    answer: "We currently serve the Greater Toronto Area, with a focus on North York, Downtown Toronto, Scarborough, Etobicoke, and nearby suburbs. We're expanding to more neighbourhoods soon! Enter your postal code to see available kitchens near you.",
    category: "general",
  },
  // Customers
  {
    id: "faq-4",
    question: "How do I order food?",
    answer: "Browse home kitchens by cuisine type or location, view their menus, and add items to your cart. Choose a pickup time that works for you, place your order, and pick up your fresh, home-cooked meal! Currently, we offer pickup only to keep costs low.",
    category: "customers",
  },
  {
    id: "faq-5",
    question: "Is there a subscription fee for customers?",
    answer: "Our first 25 customers get FREE lifetime access! After that, there's a small $5/month subscription fee that helps us maintain the platform and support our home chef community. This fee gives you unlimited access to all kitchens.",
    category: "customers",
  },
  {
    id: "faq-6",
    question: "Can I request dietary accommodations?",
    answer: "Many of our home chefs can accommodate dietary needs like vegetarian, vegan, halal, gluten-free, or allergy-friendly options. Check each kitchen's profile for their dietary offerings, or message them directly with special requests before ordering.",
    category: "customers",
  },
  // Chefs
  {
    id: "faq-7",
    question: "How do I become a HomeBiz chef?",
    answer: "Sign up as a home chef and complete our verification process. You'll need a valid Food Handler Certificate (required by Toronto Public Health), photos of your kitchen, and your menu. Our team reviews applications within 24-48 hours.",
    category: "chefs",
  },
  {
    id: "faq-8",
    question: "Is there a fee to become a home chef?",
    answer: "Our first 25 home chefs get FREE lifetime access! After that, there's a $5/month subscription. We don't take any commission from your sales - you keep 100% of what you earn. We believe in empowering home chefs, not taking their hard-earned money.",
    category: "chefs",
  },
  {
    id: "faq-9",
    question: "Do I need a commercial kitchen?",
    answer: "No! That's the beauty of HomeBiz. You can cook from your home kitchen. However, you must have a valid Food Handler Certificate and maintain proper food safety standards. Your kitchen will be reviewed during our verification process.",
    category: "chefs",
  },
  // Orders
  {
    id: "faq-10",
    question: "How does pickup work?",
    answer: "When you place an order, you'll select a pickup time slot. The chef will confirm your order and provide their pickup address. Simply arrive during your time slot to collect your freshly prepared meal. Most pickups take less than 5 minutes!",
    category: "orders",
  },
  {
    id: "faq-11",
    question: "What if I need to cancel my order?",
    answer: "You can cancel your order up to 2 hours before your scheduled pickup time for a full refund. Cancellations made less than 2 hours before pickup may be subject to the chef's cancellation policy, as they may have already started preparing your food.",
    category: "orders",
  },
  // Payments
  {
    id: "faq-12",
    question: "What payment methods are accepted?",
    answer: "Currently, payments are made directly to the home chef at pickup via cash or Interac e-Transfer. This keeps things simple and ensures chefs receive their payment immediately. We're working on adding more payment options soon!",
    category: "payments",
  },
  // Safety
  {
    id: "faq-13",
    question: "How do you ensure food safety?",
    answer: "All HomeBiz chefs must have a valid Food Handler Certificate issued by Toronto Public Health. We verify each kitchen before approval and require chefs to follow proper food safety protocols. Customers can also view chef ratings and reviews from other customers.",
    category: "safety",
  },
  {
    id: "faq-14",
    question: "What if I have a food allergy?",
    answer: "Each menu item lists common allergens. However, home kitchens may handle multiple ingredients, so cross-contamination is possible. If you have severe allergies, we recommend contacting the chef directly before ordering to discuss your specific needs.",
    category: "safety",
  },
];

// ============================================
// STATS FOR LANDING PAGE
// ============================================

export const heroStats: Stat[] = [
  {
    label: "Home Chefs",
    value: "150",
    suffix: "+",
    description: "Verified Toronto home cooks",
  },
  {
    label: "Happy Customers",
    value: "2,500",
    suffix: "+",
    description: "Satisfied food lovers",
  },
  {
    label: "Cuisines",
    value: "25",
    suffix: "+",
    description: "Authentic world flavors",
  },
  {
    label: "Meals Served",
    value: "15K",
    suffix: "+",
    description: "Home-cooked with love",
  },
];

// ============================================
// BENEFITS FOR LANDING PAGE
// ============================================

export const benefits: Benefit[] = [
  {
    icon: "Heart",
    title: "Authentic Home Cooking",
    description: "Real family recipes passed down through generations. Taste the love and tradition in every bite - something restaurants simply can't replicate.",
  },
  {
    icon: "Users",
    title: "Support Your Neighbours",
    description: "Every order supports a home chef in your community. Help talented cooks earn income doing what they love while building neighbourhood connections.",
  },
  {
    icon: "Globe",
    title: "World Flavors, Local Kitchens",
    description: "From South Indian dosas to Italian lasagna, Jamaican jerk to Chinese dumplings. Explore 25+ cuisines without leaving your neighbourhood.",
  },
  {
    icon: "Shield",
    title: "Verified & Safe",
    description: "All chefs are verified with Food Handler Certificates. Read real reviews from customers. Know exactly who's cooking your food.",
  },
];

// ============================================
// MOCK ORDERS
// ============================================

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "HB-2024-0001",
    customerId: "cust-1",
    customerName: "Michael Thompson",
    customerEmail: "michael.t@email.com",
    customerPhone: "416-555-1001",
    kitchenId: "kitchen-1",
    businessId: "kitchen-1",
    kitchenName: "Amma's Kitchen",
    items: [
      { menuItemId: "item-1", name: "Masala Dosa", quantity: 2, price: 12.99 },
      { menuItemId: "item-3", name: "Idli Sambar Combo", quantity: 1, price: 9.99 },
    ],
    subtotal: 35.97,
    tax: 4.68,
    serviceFee: 0,
    total: 40.65,
    paymentMethod: "etransfer",
    paymentStatus: "paid",
    orderStatus: "completed",
    status: "completed",
    pickupTime: "2024-03-01T18:30:00Z",
    pickupAddress: "45 Finch Ave East, North York",
    createdAt: "2024-03-01T14:00:00Z",
    updatedAt: "2024-03-01T18:45:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "HB-2024-0002",
    customerId: "cust-2",
    customerName: "Sarah Chen",
    customerEmail: "sarah.chen@email.com",
    customerPhone: "416-555-1002",
    kitchenId: "kitchen-2",
    businessId: "kitchen-2",
    kitchenName: "Nonna Maria's Table",
    items: [
      { menuItemId: "item-5", name: "Nonna's Lasagna", quantity: 1, price: 22.99 },
      { menuItemId: "item-6", name: "Tiramisu", quantity: 2, price: 8.99 },
    ],
    subtotal: 40.97,
    tax: 5.33,
    serviceFee: 0,
    total: 46.30,
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "completed",
    status: "completed",
    pickupTime: "2024-03-05T19:00:00Z",
    pickupAddress: "123 Dufferin Street, Toronto",
    createdAt: "2024-03-05T15:00:00Z",
    updatedAt: "2024-03-05T19:15:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "HB-2024-0003",
    customerId: "cust-3",
    customerName: "David Kim",
    customerEmail: "david.kim@email.com",
    customerPhone: "647-555-1003",
    kitchenId: "kitchen-3",
    businessId: "kitchen-3",
    kitchenName: "Fatima's Halal Bites",
    items: [
      { menuItemId: "item-8", name: "Hyderabadi Biryani", quantity: 2, price: 19.99 },
    ],
    subtotal: 39.98,
    tax: 5.20,
    serviceFee: 0,
    total: 45.18,
    paymentMethod: "etransfer",
    paymentStatus: "paid",
    orderStatus: "ready",
    status: "ready",
    pickupTime: "2024-03-10T18:00:00Z",
    pickupAddress: "789 Lawrence Ave West, Toronto",
    specialInstructions: "Extra spicy please!",
    createdAt: "2024-03-10T12:00:00Z",
    updatedAt: "2024-03-10T17:30:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "HB-2024-0004",
    customerId: "cust-4",
    customerName: "Aisha Patel",
    customerEmail: "aisha.patel@email.com",
    customerPhone: "416-555-1004",
    kitchenId: "kitchen-4",
    businessId: "kitchen-4",
    kitchenName: "Auntie Joyce's Jamaican",
    items: [
      { menuItemId: "item-9", name: "Jerk Chicken Dinner", quantity: 2, price: 17.99 },
      { menuItemId: "item-10", name: "Oxtail Stew", quantity: 1, price: 24.99 },
    ],
    subtotal: 60.97,
    tax: 7.93,
    serviceFee: 0,
    total: 68.90,
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "preparing",
    status: "preparing",
    pickupTime: "2024-03-12T19:30:00Z",
    pickupAddress: "456 Eglinton Ave West, Toronto",
    createdAt: "2024-03-12T16:00:00Z",
    updatedAt: "2024-03-12T18:00:00Z",
  },
  {
    id: "ord-5",
    orderNumber: "HB-2024-0005",
    customerId: "cust-5",
    customerName: "James Wilson",
    customerEmail: "james.wilson@email.com",
    customerPhone: "647-555-1005",
    kitchenId: "kitchen-6",
    businessId: "kitchen-6",
    kitchenName: "Mama Chen's Dumplings",
    items: [
      { menuItemId: "item-13", name: "Pork & Chive Dumplings (20 pcs)", quantity: 2, price: 14.99 },
      { menuItemId: "item-14", name: "Xiao Long Bao (10 pcs)", quantity: 1, price: 16.99 },
      { menuItemId: "item-15", name: "Dan Dan Noodles", quantity: 1, price: 13.99 },
    ],
    subtotal: 60.96,
    tax: 7.92,
    serviceFee: 0,
    total: 68.88,
    paymentMethod: "etransfer",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    status: "confirmed",
    pickupTime: "2024-03-15T12:30:00Z",
    pickupAddress: "567 Spadina Ave, Toronto",
    specialInstructions: "Pan-fried dumplings please, not steamed",
    createdAt: "2024-03-15T09:00:00Z",
    updatedAt: "2024-03-15T09:15:00Z",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFeaturedKitchens(): Kitchen[] {
  return mockKitchens.filter((k) => k.isVerified && k.rating >= 4.7).slice(0, 6);
}

// ============================================
// BACKWARD COMPATIBILITY ALIASES
// These aliases maintain compatibility with legacy pages
// that reference the old "business" naming convention
// ============================================

// Kitchens are the "businesses" in HomeBiz context
export const mockBusinesses = mockKitchens;

// Products are the "menu items" in HomeBiz context
export const mockProducts = mockMenuItems;

// Services - use menu items as placeholder for now
export const mockServices = mockMenuItems;

// Alias types for backward compatibility
export type Business = Kitchen;
export type Product = MenuItem;
