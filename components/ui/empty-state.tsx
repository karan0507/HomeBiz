/**
 * Empty State Components
 * Used when no data is available
 */

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {Icon && (
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}

export function NoResults({ onClear }: { onClear?: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your filters or search terms
      </p>
      {onClear && (
        <Button onClick={onClear} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
