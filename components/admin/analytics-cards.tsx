import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnalyticsData {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down'
  trendValue?: string
  icon: React.ReactNode
  color?: 'primary' | 'success' | 'destructive' | 'warning'
}

export function AnalyticsCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  color = 'primary',
}: AnalyticsData) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    destructive: 'bg-destructive/10 text-destructive',
    warning: 'bg-warning/10 text-warning',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('rounded-lg p-2', colorClasses[color])}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {trend && trendValue && (
              <span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-destructive'
                )}
              >
                {trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {trendValue}
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function StockStatusCard({
  name,
  current,
  minimum,
  unit,
}: {
  name: string
  current: number
  minimum: number
  unit: string
}) {
  const percentage = Math.min((current / minimum) * 100, 100)
  const status = current === 0 ? 'critical' : current <= minimum ? 'low' : 'normal'

  const statusColors = {
    critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Fora de estoque' },
    low: { bg: 'bg-warning/10', text: 'text-warning', label: 'Estoque baixo' },
    normal: { bg: 'bg-success/10', text: 'text-success', label: 'Normal' },
  }

  const colors = statusColors[status]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium leading-none">{name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {current} / {minimum} {unit}
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full transition-all', colors.bg)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <Badge className={cn('ml-2', colors.bg, colors.text)} variant="secondary">
            {colors.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export function RevenueCard({
  title,
  revenue,
  target,
  variance,
}: {
  title: string
  revenue: number
  target: number
  variance: number
}) {
  const percentage = (revenue / target) * 100
  const isBelowTarget = revenue < target

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Versus meta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.min(percentage, 100).toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full transition-all', isBelowTarget ? 'bg-warning' : 'bg-success')}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-lg font-bold">
              {target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="text-right">
            <p className={cn('text-xs font-medium', isBelowTarget ? 'text-destructive' : 'text-success')}>
              {isBelowTarget ? '-' : '+'}
              {Math.abs(variance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
