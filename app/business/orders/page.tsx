"use client"

import { useState, useEffect } from "react"
import { Check, X, Clock, Phone, ChefHat, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyOrders } from "@/components/shared/empty-state"
import { PageLoader } from "@/components/shared/table-loader"
import { Pagination } from "@/components/shared/pagination"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Order status type
type OrderStatus = "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "completed" | "cancelled"

interface OrderItem {
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: "cash" | "etransfer"
  paymentStatus: "pending" | "paid"
  pickupTime: string
  specialInstructions?: string
  createdAt: string
}

// Mock orders with 3 pending orders as requested
const mockOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-20240206-001",
    customerName: "Sarah Johnson",
    customerPhone: "+1 (416) 555-0123",
    items: [
      { name: "Butter Chicken", quantity: 2, price: 14.99 },
      { name: "Garlic Naan (3pcs)", quantity: 1, price: 4.99 },
      { name: "Mango Lassi", quantity: 2, price: 3.99 },
    ],
    subtotal: 42.95,
    tax: 5.58,
    total: 48.53,
    status: "placed",
    paymentMethod: "etransfer",
    paymentStatus: "paid",
    pickupTime: "Today, 6:30 PM",
    createdAt: "10 minutes ago",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-20240206-002",
    customerName: "Michael Chen",
    customerPhone: "+1 (647) 555-0456",
    items: [
      { name: "Vegetable Biryani", quantity: 1, price: 12.99 },
      { name: "Samosa (4pcs)", quantity: 1, price: 6.99, specialInstructions: "Extra chutney please" },
    ],
    subtotal: 19.98,
    tax: 2.60,
    total: 22.58,
    status: "placed",
    paymentMethod: "cash",
    paymentStatus: "pending",
    pickupTime: "Today, 7:00 PM",
    specialInstructions: "Please pack separately",
    createdAt: "25 minutes ago",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-20240206-003",
    customerName: "Emily Davis",
    customerPhone: "+1 (416) 555-0789",
    items: [
      { name: "Dal Makhani", quantity: 1, price: 11.99 },
      { name: "Paneer Tikka", quantity: 1, price: 13.99 },
      { name: "Basmati Rice", quantity: 2, price: 3.99 },
    ],
    subtotal: 33.96,
    tax: 4.41,
    total: 38.37,
    status: "placed",
    paymentMethod: "etransfer",
    paymentStatus: "paid",
    pickupTime: "Today, 7:30 PM",
    createdAt: "40 minutes ago",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-20240205-012",
    customerName: "James Wilson",
    customerPhone: "+1 (905) 555-0321",
    items: [
      { name: "Chicken Tikka Masala", quantity: 1, price: 15.99 },
    ],
    subtotal: 15.99,
    tax: 2.08,
    total: 18.07,
    status: "completed",
    paymentMethod: "cash",
    paymentStatus: "paid",
    pickupTime: "Yesterday, 6:00 PM",
    createdAt: "Yesterday",
  },
]

// Status flow for order actions
const statusFlow: Record<OrderStatus, { next: OrderStatus | null; action: string }> = {
  placed: { next: "confirmed", action: "Confirm Order" },
  confirmed: { next: "preparing", action: "Start Preparing" },
  preparing: { next: "ready", action: "Mark Ready" },
  ready: { next: "picked_up", action: "Mark Picked Up" },
  picked_up: { next: "completed", action: "Complete" },
  completed: { next: null, action: "" },
  cancelled: { next: null, action: "" },
}

export default function BusinessOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    toast.success(`Order status updated to ${newStatus.replace("_", " ")}`)
  }

  const handleReject = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    )
    toast.error("Order has been rejected")
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === "active") {
      return !["completed", "cancelled", "picked_up"].includes(order.status)
    }
    if (filter === "completed") {
      return ["completed", "cancelled", "picked_up"].includes(order.status)
    }
    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Stats
  const pendingCount = orders.filter(o => o.status === "placed").length
  const preparingCount = orders.filter(o => o.status === "preparing" || o.status === "confirmed").length
  const readyCount = orders.filter(o => o.status === "ready").length

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage incoming orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-blue-600">New Orders</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-700">{pendingCount}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-amber-600">Preparing</p>
                    <p className="text-xl md:text-2xl font-bold text-amber-700">{preparingCount}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-green-600">Ready</p>
                    <p className="text-xl md:text-2xl font-bold text-green-700">{readyCount}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b pb-2">
            {[
              { key: "all", label: "All Orders" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Past Orders" },
            ].map(tab => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setFilter(tab.key as typeof filter)
                  setCurrentPage(1)
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <PageLoader />
          ) : paginatedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyOrders />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                          <p className="text-sm text-muted-foreground">{order.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        {order.paymentStatus === "paid" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                        ) : (
                          <Badge variant="outline">Pay on Pickup</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Customer Info */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Pickup Time</p>
                        <p className="font-medium text-primary">{order.pickupTime}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <div>
                            <span>{item.quantity}x {item.name}</span>
                            {item.specialInstructions && (
                              <p className="text-xs text-muted-foreground ml-4">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div className="bg-amber-50 p-3 rounded-lg mb-4 text-sm">
                        <p className="font-medium text-amber-800">Special Instructions:</p>
                        <p className="text-amber-700">{order.specialInstructions}</p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        Subtotal: ${order.subtotal.toFixed(2)} + Tax: ${order.tax.toFixed(2)}
                      </div>
                      <div className="text-lg font-bold">${order.total.toFixed(2)}</div>
                    </div>

                    {/* Actions */}
                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {order.status === "placed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleReject(order.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        {statusFlow[order.status].next && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, statusFlow[order.status].next!)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {statusFlow[order.status].action}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredOrders.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
