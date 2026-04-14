import { cn } from '@/lib/utils'
import { THEME } from '@/lib/theme'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn(
      'bg-white border-b border-slate-200 px-6 py-4',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: THEME.primary.light }}>
              <Icon size={20} style={{ color: THEME.primary.DEFAULT }} />
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
