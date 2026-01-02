import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`test-card h-full relative overflow-hidden flex flex-col ${className}`}>
      {/* Icon skeleton */}
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      
      {/* Description skeleton */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4 flex-1" />

      {/* Status skeleton */}
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function SkeletonTestGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <Skeleton className="h-8 w-48 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-14 w-3/4 max-w-2xl mx-auto mb-4" />
        <Skeleton className="h-14 w-1/2 max-w-xl mx-auto mb-6" />
        <Skeleton className="h-6 w-2/3 max-w-lg mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-14 w-40 rounded-2xl" />
          <Skeleton className="h-14 w-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
