import { Suspense } from 'react'
import {
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { kpiDashboard, alertas, insights, pedidos, filaProducao, materiais } from '@/lib/mock-data'

function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
}: {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {trend && trendValue && (
              <span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-destructive'
                )}
              >
                {trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
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

function AlertCard({
  severity,
  title,
  message,
}: {
  severity: 'error' | 'warning' | 'info'
  title: string
  message: string
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        severity === 'error' && 'border-destructive/50 bg-destructive/5',
        severity === 'warning' && 'border-warning/50 bg-warning/5',
        severity === 'info' && 'border-primary/50 bg-primary/5'
      )}
    >
      <AlertTriangle
        className={cn(
          'mt-0.5 size-5 shrink-0',
          severity === 'error' && 'text-destructive',
          severity === 'warning' && 'text-warning',
          severity === 'info' && 'text-primary'
        )}
      />
      <div className="flex-1">
        <p
          className={cn(
            'font-medium',
            severity === 'error' && 'text-destructive',
            severity === 'warning' && 'text-warning-foreground',
            severity === 'info' && 'text-primary'
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

function InsightCard({ icon, message }: { icon: string; message: string }) {
  const Icon = icon === 'alert-triangle' ? AlertTriangle : icon === 'trending-up' ? TrendingUp : Lightbulb

  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="size-4 text-primary" />
      </div>
      <p className="text-sm leading-relaxed text-foreground">{message}</p>
    </div>
  )
}

function PedidoCard({
  numero,
  cliente,
  status,
  prazo,
  total,
}: {
  numero: string
  cliente: string
  status: string
  prazo?: Date
  total: number
}) {
  const statusConfig = {
    em_producao: { label: 'Em Produção', color: 'bg-warning text-warning-foreground', icon: Clock },
    pronto: { label: 'Pronto', color: 'bg-success text-success-foreground', icon: CheckCircle2 },
    enviado: { label: 'Enviado', color: 'bg-primary text-primary-foreground', icon: Truck },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.em_producao
  const StatusIcon = config.icon
  const diasRestantes = prazo ? Math.ceil((prazo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div className={cn('flex size-10 items-center justify-center rounded-lg', config.color)}>
        <StatusIcon className="size-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{numero}</span>
          <Badge variant="outline" className="text-xs">
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{cliente}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        {diasRestantes !== null && (
          <p className={cn('text-xs', diasRestantes <= 3 ? 'text-destructive' : 'text-muted-foreground')}>
            {diasRestantes <= 0 ? 'Atrasado' : `${diasRestantes} dias`}
          </p>
        )}
      </div>
    </div>
  )
}

function ProducaoItem({
  pedido,
  item,
  quantidadeTotal,
  quantidadeProduzida,
  status,
  motivoBloqueio,
}: {
  pedido: string
  item: string
  quantidadeTotal: number
  quantidadeProduzida: number
  status: string
  motivoBloqueio?: string
}) {
  const progresso = (quantidadeProduzida / quantidadeTotal) * 100

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{pedido}</span>
            {status === 'bloqueado' && (
              <Badge variant="destructive" className="text-xs">
                Bloqueado
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{item}</p>
        </div>
        <span className="text-sm text-muted-foreground">
          {quantidadeProduzida}/{quantidadeTotal}
        </span>
      </div>
      <Progress value={progresso} className="mt-3 h-2" />
      {motivoBloqueio && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3" />
          {motivoBloqueio}
        </div>
      )}
    </div>
  )
}

function EstoqueBaixoItem({ nome, atual, minimo }: { nome: string; atual: number; minimo: number }) {
  const percentual = (atual / minimo) * 100
  const critico = atual < minimo

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-lg',
          critico ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
        )}
      >
        <Package className="size-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{nome}</p>
        <div className="mt-1 flex items-center gap-2">
          <Progress value={Math.min(percentual, 100)} className="h-1.5 flex-1" />
          <span className={cn('text-xs font-medium', critico ? 'text-destructive' : 'text-warning')}>
            {atual}/{minimo}
          </span>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const alertasNaoLidos = alertas.filter((a) => !a.lido)
  const materiaisEstoqueBaixo = materiais.filter((m) => m.quantidadeDisponivel <= m.estoqueMinimo * 1.2)

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu ateliê</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Pedidos Ativos"
            value={kpiDashboard.pedidosAtivos.toString()}
            description="em produção ou prontos"
            icon={<ShoppingCart className="size-5" />}
          />
          <KPICard
            title="Estoque Baixo"
            value={kpiDashboard.itensEstoqueBaixo.toString()}
            description="itens abaixo do mínimo"
            icon={<AlertTriangle className="size-5" />}
          />
          <KPICard
            title="Receita Mensal"
            value={kpiDashboard.receitaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            trend={kpiDashboard.variacaoReceita > 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(kpiDashboard.variacaoReceita)}%`}
            description="vs. mês anterior"
            icon={<DollarSign className="size-5" />}
          />
          <KPICard
            title="Margem Média"
            value={`${kpiDashboard.margemLucroMedia}%`}
            trend={kpiDashboard.variacaoMargem > 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(kpiDashboard.variacaoMargem)}%`}
            description="vs. mês anterior"
            icon={<TrendingUp className="size-5" />}
          />
        </div>

        {/* Alertas e Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <AlertTriangle className="size-5 text-destructive" />
                Alertas
              </CardTitle>
              <CardDescription>Situações que requerem sua atenção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertasNaoLidos.length > 0 ? (
                alertasNaoLidos.map((alerta) => (
                  <AlertCard
                    key={alerta.id}
                    severity={alerta.severidade}
                    title={alerta.titulo}
                    message={alerta.mensagem}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Nenhum alerta no momento
                </p>
              )}
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Lightbulb className="size-5 text-primary" />
                Insights
              </CardTitle>
              <CardDescription>Recomendações inteligentes para o seu negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.map((insight) => (
                <InsightCard key={insight.id} icon={insight.icone} message={insight.mensagem} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pedidos e Produção */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pedidos Recentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos e status</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/pedidos">Ver todos</a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pedidos.slice(0, 4).map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  numero={pedido.numero}
                  cliente={pedido.cliente?.nome || 'Cliente'}
                  status={pedido.status}
                  prazo={pedido.prazoEntrega}
                  total={pedido.total}
                />
              ))}
            </CardContent>
          </Card>

          {/* Fila de Produção */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Fila de Produção</CardTitle>
                <CardDescription>Itens aguardando produção</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/producao">Ver todos</a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {filaProducao.map((item, index) => (
                <ProducaoItem
                  key={`${item.pedidoId}-${item.itemIndex}`}
                  pedido={item.pedido?.numero || item.pedidoId}
                  item={item.pedido?.itens[item.itemIndex]?.descricao || 'Item'}
                  quantidadeTotal={item.quantidadeTotal}
                  quantidadeProduzida={item.quantidadeProduzida}
                  status={item.status}
                  motivoBloqueio={item.motivoBloqueio}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Estoque Baixo */}
        {materiaisEstoqueBaixo.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Materiais com Estoque Baixo</CardTitle>
                <CardDescription>Itens que precisam de reposição</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/estoque">Ver estoque</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {materiaisEstoqueBaixo.map((material) => (
                  <EstoqueBaixoItem
                    key={material.id}
                    nome={material.nome}
                    atual={material.quantidadeDisponivel}
                    minimo={material.estoqueMinimo}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Suspense>
  )
}
