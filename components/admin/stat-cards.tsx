import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardData {
  label: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'destructive' | 'warning' | 'info'
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  destructive: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
}

export function StatCard({
  label,
  value,
  unit,
  change,
  changeLabel,
  icon,
  color = 'primary',
}: StatCardData) {
  const isPositive = change !== undefined && change >= 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-xs font-medium">
                {isPositive ? (
                  <ArrowUpRight className="size-3 text-success" />
                ) : (
                  <ArrowDownRight className="size-3 text-destructive" />
                )}
                <span className={isPositive ? 'text-success' : 'text-destructive'}>
                  {isPositive ? '+' : ''}{change}%
                </span>
                {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          {icon && <div className={cn('flex size-10 items-center justify-center rounded-lg', colorClasses[color])}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCardGrid({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}

export function CompactStatCard({
  label,
  value,
  change,
}: {
  label: string
  value: string | number
  change?: number
}) {
  const isPositive = change !== undefined && change >= 0

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold">{value}</span>
        {change !== undefined && (
          <Badge
            variant="secondary"
            className={cn(
              'text-xs gap-0.5',
              isPositive && 'bg-success/10 text-success',
              !isPositive && 'bg-destructive/10 text-destructive'
            )}
          >
            {isPositive ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>
    </div>
  )
}
