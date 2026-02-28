import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * SkeletonStatCard — consistent shimmer placeholder for dashboard stats.
 */
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

/**
 * SkeletonListRow — shimmer row for tables and lists.
 */
export function SkeletonListRow({ cols = 3, className }: { cols?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 py-3 border-b last:border-0", className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? "flex-1" : "w-16"}`} />
      ))}
    </div>
  );
}

/**
 * SkeletonCardContent — generic shimmer block for card bodies.
 */
export function SkeletonCardContent({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3 mt-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonListRow key={i} />
      ))}
    </div>
  );
}

/**
 * SkeletonItemLoader — circle + lines pattern for lists of people/items.
 */
export function SkeletonItemLoader({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonTable — full table skeleton with header.
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-4 border-b border-border/50">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className={`h-4 ${c === 0 ? "w-1/4" : "flex-1"}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * SkeletonPageLoader — full page spinner for data loading.
 */
export function SkeletonPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading details...</p>
      </div>
    </div>
  )
}

/**
 * SkeletonGrid — grid of shimmer cards for product/event listings.
 */
export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border rounded-xl space-y-3 bg-card">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
