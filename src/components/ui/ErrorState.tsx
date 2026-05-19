import * as React from "react"

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-lg font-medium text-destructive">{title}</div>
      {message && <div className="text-sm text-muted-foreground">{message}</div>}
      {onRetry && (
        <button className="btn" onClick={onRetry} data-testid="retry-btn">
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
