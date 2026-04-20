'use client'

import {
  Factory,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { filaProducao, pedidos } from '@/lib/mock-data'

const statusConfig = {
  pendente: { label: 'Pendente', color: 'bg-muted text-muted-foreground', icon: Clock },
  em_andamento: { label: 'Em Andamento', color: 'bg-primary/10 text-primary', icon: Play },
  bloqueado: { label: 'Bloqueado', color: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  concluido: { label: 'Concluído', color: 'bg-success/10 text-success', icon: CheckCircle2 },
}

function ProducaoItem({
  pedidoNumero,
  item,
  quantidadeTotal,
  quantidadeProduzida,
  status,
  motivoBloqueio,
  prazo,
  prioridade,
}: {
  pedidoNumero: string
  item: string
  quantidadeTotal: number
  quantidadeProduzida: number
  status: keyof typeof statusConfig
  motivoBloqueio?: string
  prazo?: Date
  prioridade: number
}) {
  const config = statusConfig[status]
  const StatusIcon = config.icon
  const progresso = (quantidadeProduzida / quantidadeTotal) * 100
  const diasRestantes = prazo ? Math.ceil((prazo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  return (
    <Card className={cn(status === 'bloqueado' && 'border-destructive/50')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn('flex size-10 items-center justify-center rounded-lg', config.color)}>
              <StatusIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{pedidoNumero}</span>
                {prioridade === 1 && (
                  <Badge variant="destructive" className="text-xs">
                    Urgente
                  </Badge>
                )}
                <Badge className={cn('text-xs', config.color)}>{config.label}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === 'pendente' && (
                <DropdownMenuItem>
                  <Play className="mr-2 size-4" />
                  Iniciar Produção
                </DropdownMenuItem>
              )}
              {status === 'em_andamento' && (
                <>
                  <DropdownMenuItem>
                    <Pause className="mr-2 size-4" />
                    Pausar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CheckCircle2 className="mr-2 size-4" />
                    Marcar Concluído
                  </DropdownMenuItem>
                </>
              )}
              {status === 'bloqueado' && (
                <DropdownMenuItem>
                  <Play className="mr-2 size-4" />
                  Desbloquear
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">
              {quantidadeProduzida}/{quantidadeTotal}
            </span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>

        {motivoBloqueio && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/5 p-3">
            <AlertCircle className="mt-0.5 size-4 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">Produção Bloqueada</p>
              <p className="text-sm text-muted-foreground">{motivoBloqueio}</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {diasRestantes !== null && (
              <span className={diasRestantes <= 3 ? 'text-destructive' : ''}>
                {diasRestantes <= 0 ? 'Atrasado' : `Prazo: ${diasRestantes} dias`}
              </span>
            )}
          </div>
          {status === 'pendente' && (
            <Button size="sm">
              <Play className="mr-1 size-3" />
              Iniciar
            </Button>
          )}
          {status === 'em_andamento' && (
            <Button size="sm" variant="outline">
              <CheckCircle2 className="mr-1 size-3" />
              Concluir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ProducaoCards() {
  const totalItens = filaProducao.length
  const emAndamento = filaProducao.filter((i) => i.status === 'em_andamento').length
  const bloqueados = filaProducao.filter((i) => i.status === 'bloqueado').length
  const pendentes = filaProducao.filter((i) => i.status === 'pendente').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total na Fila</CardTitle>
          <Factory className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItens}</div>
          <p className="text-xs text-muted-foreground">itens</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
          <Play className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{emAndamento}</div>
          <p className="text-xs text-muted-foreground">produzindo agora</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Bloqueados</CardTitle>
          <AlertTriangle className="size-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{bloqueados}</div>
          <p className="text-xs text-muted-foreground">aguardando material</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendentes}</div>
          <p className="text-xs text-muted-foreground">na fila</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProducaoPage() {
  // Ordenar por prioridade e prazo
  const filaOrdenada = [...filaProducao].sort((a, b) => {
    // Bloqueados primeiro (para destaque)
    if (a.status === 'bloqueado' && b.status !== 'bloqueado') return -1
    if (b.status === 'bloqueado' && a.status !== 'bloqueado') return 1
    // Depois por prioridade
    if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade
    // Depois por prazo
    if (a.prazo && b.prazo) return a.prazo.getTime() - b.prazo.getTime()
    return 0
  })

  const bloqueados = filaOrdenada.filter((i) => i.status === 'bloqueado')
  const emAndamento = filaOrdenada.filter((i) => i.status === 'em_andamento')
  const pendentes = filaOrdenada.filter((i) => i.status === 'pendente')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Produção</h1>
        <p className="text-muted-foreground">Gerencie a fila de produção e acompanhe o progresso</p>
      </div>

      {/* Cards */}
      <ProducaoCards />

      {/* Alertas de Bloqueio */}
      {bloqueados.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-destructive">
              <AlertTriangle className="size-5" />
              Produção Bloqueada
            </CardTitle>
            <CardDescription>
              Itens que não podem ser produzidos por falta de material
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bloqueados.map((item, index) => (
              <ProducaoItem
                key={`${item.pedidoId}-${item.itemIndex}`}
                pedidoNumero={item.pedido?.numero || item.pedidoId}
                item={item.pedido?.itens[item.itemIndex]?.descricao || 'Item'}
                quantidadeTotal={item.quantidadeTotal}
                quantidadeProduzida={item.quantidadeProduzida}
                status={item.status as keyof typeof statusConfig}
                motivoBloqueio={item.motivoBloqueio}
                prazo={item.prazo}
                prioridade={item.prioridade}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Em Andamento */}
      {emAndamento.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Play className="size-5 text-primary" />
              Em Andamento
            </CardTitle>
            <CardDescription>Itens sendo produzidos agora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emAndamento.map((item) => (
              <ProducaoItem
                key={`${item.pedidoId}-${item.itemIndex}`}
                pedidoNumero={item.pedido?.numero || item.pedidoId}
                item={item.pedido?.itens[item.itemIndex]?.descricao || 'Item'}
                quantidadeTotal={item.quantidadeTotal}
                quantidadeProduzida={item.quantidadeProduzida}
                status={item.status as keyof typeof statusConfig}
                prazo={item.prazo}
                prioridade={item.prioridade}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Fila Pendente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Clock className="size-5 text-muted-foreground" />
            Fila de Produção
          </CardTitle>
          <CardDescription>Próximos itens a serem produzidos (ordenados por prioridade)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendentes.length > 0 ? (
            pendentes.map((item) => (
              <ProducaoItem
                key={`${item.pedidoId}-${item.itemIndex}`}
                pedidoNumero={item.pedido?.numero || item.pedidoId}
                item={item.pedido?.itens[item.itemIndex]?.descricao || 'Item'}
                quantidadeTotal={item.quantidadeTotal}
                quantidadeProduzida={item.quantidadeProduzida}
                status={item.status as keyof typeof statusConfig}
                prazo={item.prazo}
                prioridade={item.prioridade}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="size-12 text-success" />
              <h3 className="mt-4 font-serif text-lg font-medium">Fila vazia!</h3>
              <p className="mt-1 text-sm text-muted-foreground">Todos os itens foram produzidos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
