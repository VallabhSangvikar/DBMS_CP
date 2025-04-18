import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

// Reusable card skeleton for consistent loading states
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6 space-y-2">
        <Skeleton className="h-6 w-4/5 mb-4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="p-6 space-y-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="p-6 flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
