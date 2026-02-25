"use client"

import { useState, useEffect } from "react"
import { Check, X, Clock, Phone, ChefHat, Eye, Loader2 } from "lucide-react"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { BusinessLayout } from "@/components/business/business-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyOrders } from "@/components/shared/empty-state"
import { SkeletonPageLoader } from "@/components/shared/skeleton-cards"
import { Pagination } from "@/components/shared/pagination"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { fetchAPI } from "@/lib/services/api.client"
import { showError } from "@/lib/notifications"
import { toast } from "sonner"

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

const statusFlow: Record<OrderStatus, { next: OrderStatus | null; action: string }> = {
  placed: { next: "confirmed", action: "Confirm Order" },
  confirmed: { next: "preparing", action: "Start Preparing" },
  preparing: { next: "ready", action: "Mark Ready" },
  ready: { next: "picked_up", action: "Mark Picked Up" },
  picked_up: { next: "completed", action: "Complete" },
  completed: { next: null, action: "" },
  cancelled: { next: null, action: "" },
}

function transformOrder(o: any): Order {
  const customer = o.customer || o.profile || {}
  const fullName = customer.name
    || customer.full_name
    || `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
    || "Customer"
  return {
    id: o.id,
    orderNumber: o.order_number || `ORD-${String(o.id).slice(-8).toUpperCase()}`,
    customerName: fullName,
    customerPhone: customer.phone || "",
    items: (o.order_items || o.items || []).map((item: any) => ({
      name: item.menu_item?.name || item.name || "",
      quantity: item.quantity,
      price: Number(item.unit_price ?? item.price ?? 0),
      specialInstructions: item.notes || item.special_instructions,
    })),
    subtotal: Number(o.subtotal ?? 0),
    tax: Number(o.tax ?? 0),
    total: Number(o.total_amount ?? o.total ?? 0),
    status: o.status as OrderStatus,
    paymentMethod: o.payment_method || "cash",
    paymentStatus: o.payment_status || "pending",
    pickupTime: o.pickup_time
      ? new Date(o.pickup_time).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })
      : "",
    specialInstructions: o.notes || o.special_instructions,
    createdAt: o.created_at
      ? new Date(o.created_at).toLocaleString("en-CA", { dateStyle: "short", timeStyle: "short" })
      : "",
  }
}

const ITEMS_PER_PAGE = 10

// ── Reusable order card ────────────────────────────────────────────────────
interface OrderCardProps {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
  onReject: (id: string) => void
}

function OrderCard({ order, onStatusChange, onReject }: OrderCardProps) {
  return (
    <Card className="overflow-hidden">
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
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <div>
            <p className="font-medium">{order.customerName}</p>
            {order.customerPhone && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {order.customerPhone}
              </p>
            )}
          </div>
          {order.pickupTime && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pickup Time</p>
              <p className="font-medium text-primary">{order.pickupTime}</p>
            </div>
          )}
        </div>

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

        {order.specialInstructions && (
          <div className="bg-amber-50 p-3 rounded-lg mb-4 text-sm">
            <p className="font-medium text-amber-800">Special Instructions:</p>
            <p className="text-amber-700">{order.specialInstructions}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-sm text-muted-foreground">
            Subtotal: ${order.subtotal.toFixed(2)} + Tax: ${order.tax.toFixed(2)}
          </div>
          <div className="text-lg font-bold">${order.total.toFixed(2)}</div>
        </div>

        {order.status !== "completed" && order.status !== "cancelled" && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {order.status === "placed" && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onReject(order.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            )}
            {statusFlow[order.status].next && (
              <Button
                size="sm"
                onClick={() => onStatusChange(order.id, statusFlow[order.status].next!)}
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
  )
}
// ───────────────────────────────────────────────────────────────────────────

export default function BusinessOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [currentPage, setCurrentPage] = useState(1)
  // Mobile infinite scroll — shows more items as user scrolls
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const itemsPerPage = ITEMS_PER_PAGE

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()

    fetchAPI<any[]>("/business/orders", { signal: controller.signal })
      .then(data => {
        setOrders((Array.isArray(data) ? data : []).map(transformOrder))
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        showError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [user?.id])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    try {
      await fetchAPI(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Order ${newStatus.replace("_", " ")}`)
    } catch (err) {
      // Revert on failure
      showError(err)
      fetchAPI<any[]>("/business/orders")
        .then(data => setOrders((Array.isArray(data) ? data : []).map(transformOrder)))
        .catch(() => {})
    }
  }

  const handleReject = async (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" } : o))
    try {
      await fetchAPI(`/orders/${orderId}/reject`, { method: "PUT" })
      toast.error("Order rejected")
    } catch (err) {
      showError(err)
      fetchAPI<any[]>("/business/orders")
        .then(data => setOrders((Array.isArray(data) ? data : []).map(transformOrder)))
        .catch(() => {})
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "active") return !["completed", "cancelled", "picked_up"].includes(order.status)
    if (filter === "completed") return ["completed", "cancelled", "picked_up"].includes(order.status)
    return true
  })

  // Reset visible count when filter changes
  useEffect(() => { setVisibleCount(ITEMS_PER_PAGE); setCurrentPage(1) }, [filter])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  // Mobile: show first visibleCount items from filtered list
  const mobileOrders = filteredOrders.slice(0, visibleCount)
  const mobileHasMore = visibleCount < filteredOrders.length

  const mobileSentinelRef = useInfiniteScroll({
    hasMore: mobileHasMore,
    isLoading: loading,
    onLoadMore: () => setVisibleCount((v) => v + ITEMS_PER_PAGE),
  })

  const pendingCount = orders.filter(o => o.status === "placed").length
  const preparingCount = orders.filter(o => o.status === "preparing" || o.status === "confirmed").length
  const readyCount = orders.filter(o => o.status === "ready").length

  return (
    <ProtectedRoute requireBusiness>
      <BusinessLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage incoming orders</p>
          </div>

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
                onClick={() => { setFilter(tab.key as typeof filter); setCurrentPage(1) }}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <SkeletonPageLoader />
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyOrders />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Desktop: paginated card list */}
              <div className="space-y-4 hidden md:block">
                {paginatedOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onReject={handleReject}
                  />
                ))}
              </div>

              {/* Mobile: infinite scroll card list */}
              <div className="space-y-4 md:hidden">
                {mobileOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onReject={handleReject}
                  />
                ))}
              </div>

              {/* Mobile scroll sentinel — unmounts when no more data */}
              {mobileHasMore && (
                <div ref={mobileSentinelRef} className="h-4 w-full md:hidden" aria-hidden="true" />
              )}
              {/* End-of-list message shown only after last item — no more scrolling triggers */}
              {!mobileHasMore && mobileOrders.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-4 md:hidden">
                  All {filteredOrders.length} orders shown
                </p>
              )}

              {/* Desktop pagination — hidden on mobile */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                className="hidden md:flex"
              />
            </>
          )}
        </div>
      </BusinessLayout>
    </ProtectedRoute>
  )
}
