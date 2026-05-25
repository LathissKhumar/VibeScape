"use client";

import { cn } from '@/lib/utils'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface ErrorStateProps {
  title: string
  message: string
  retryAction?: () => Promise<void> | void
  className?: string
}

export function ErrorState({ title, message, retryAction, className }: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (!retryAction) return
    setRetrying(true)
    try {
      await retryAction()
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center',
        'rounded-2xl border border-error/20 bg-error-container/10',
        className
      )}
    >
      <AlertTriangle className="h-8 w-8 text-error" />
      <h3 className="font-[var(--font-outfit)] text-lg font-semibold text-error">{title}</h3>
      <p className="max-w-sm text-sm text-on-surface-variant">{message}</p>
      {retryAction && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center gap-2 rounded-full bg-error/20 px-5 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/30 disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', retrying && 'animate-spin')} />
          {retrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
    </div>
  )
}
