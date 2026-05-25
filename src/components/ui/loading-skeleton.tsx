import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

const variantClasses: Record<string, string> = {
  card: 'h-48 w-full rounded-xl',
  text: 'h-4 w-full rounded',
  chart: 'h-64 w-full rounded-xl',
  hero: 'h-72 w-full rounded-2xl',
}

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'chart' | 'hero'
  className?: string
  lines?: number
}

export function LoadingSkeleton({ variant = 'text', className, lines = 1 }: LoadingSkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4 rounded', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    )
  }

  return <Skeleton className={cn(variantClasses[variant], className)} />
}
