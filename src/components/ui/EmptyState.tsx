import * as React from "react"

export function EmptyState({ title = "Nothing here", description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="text-lg font-medium">{title}</div>
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </div>
  )
}

export default EmptyState
