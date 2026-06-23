import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TimelineStatus = 'completed' | 'current' | 'pending' | 'error'

export interface TimelineStep {
  id: string
  label: string
  description?: string
  timestamp?: Date | string
  status: TimelineStatus
  icon?: React.ReactNode
}

interface TimelineProps {
  steps: TimelineStep[]
  variant?: 'vertical' | 'horizontal'
  compact?: boolean
}

const statusConfig = {
  completed: {
    bg: 'bg-success/10',
    text: 'text-success',
    icon: Check,
    badge: 'Concluído',
  },
  current: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    icon: Clock,
    badge: 'Em andamento',
  },
  pending: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    icon: null,
    badge: 'Pendente',
  },
  error: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    icon: AlertCircle,
    badge: 'Erro',
  },
}

export function Timeline({ steps, variant = 'vertical', compact = false }: TimelineProps) {
  if (variant === 'horizontal') {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const config = statusConfig[step.status]
            const Icon = config.icon

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div className={cn('flex size-8 items-center justify-center rounded-full', config.bg)}>
                    {Icon && <Icon className={cn('size-4', config.text)} />}
                  </div>
                  <p className="mt-2 text-center text-xs font-medium">{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn('mx-2 h-1 flex-1', step.status === 'completed' ? 'bg-success' : 'bg-muted')} />
                )}
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const config = statusConfig[step.status]
        const Icon = config.icon

        return (
          <div key={step.id}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn('flex size-8 items-center justify-center rounded-full', config.bg)}>
                  {Icon && <Icon className={cn('size-4', config.text)} />}
                </div>
                {index < steps.length - 1 && <div className="mt-2 h-12 w-1 bg-border" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{step.label}</h4>
                    {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
                  </div>
                  <Badge variant="secondary">{config.badge}</Badge>
                </div>
                {step.timestamp && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(step.timestamp).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CompactTimeline({ steps }: { steps: TimelineStep[] }) {
  const completedCount = steps.filter(s => s.status === 'completed').length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Progresso</p>
        <Badge variant="secondary">{completedCount} de {steps.length}</Badge>
      </div>
      <div className="flex gap-1">
        {steps.map(step => {
          const config = statusConfig[step.status]
          return (
            <div
              key={step.id}
              className={cn('h-2 flex-1 rounded-full', config.bg)}
              title={step.label}
            />
          )
        })}
      </div>
    </div>
  )
}
