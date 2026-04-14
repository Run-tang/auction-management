import { cn } from '@/lib/utils'
import type { AuctionApplyStatus } from '@/types'
import { STATUS_COLORS } from '@/lib/theme'

interface StatusBadgeProps {
  status: AuctionApplyStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_COLORS[status]
  
  if (!config) return null
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      config.bgColor,
      config.color,
      config.borderColor,
      className
    )}>
      {config.label}
    </span>
  )
}
