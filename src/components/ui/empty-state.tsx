"use client";

import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-12 text-center',
        'glass-card rounded-2xl',
        className
      )}
    >
      <div className="rounded-full bg-surface-container p-4">
        <Icon className="h-8 w-8 text-outline" />
      </div>
      <h3 className="font-[var(--font-outfit)] text-xl font-semibold text-on-surface">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-on-surface-variant">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  )
}
