import * as React from "react"
import { Skeleton } from "./skeleton"

type Props = React.ComponentProps<typeof Skeleton> & { variant?: "text" | "avatar" | "rect" }

export function LoadingSkeleton({ variant = "text", className, ...props }: Props) {
  const base = "w-full"
  const variantClass =
    variant === "avatar" ? "h-10 w-10 rounded-full" : variant === "rect" ? "h-24 rounded-lg" : "h-4 rounded"
  return <Skeleton className={[base, variantClass, className].filter(Boolean).join(" ")} {...props} />
}

export default LoadingSkeleton
