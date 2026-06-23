'use client'

import { Suspense } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  ArrowRight,
  Users,
  Boxes,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getInventoryItems, getLowStockItems } from '@/lib/supabase/inventory'
import { getProducts } from '@/lib/supabase/products'
import { getClients } from '@/lib/supabase/clients'

// KPI Card Component
function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  href,
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  href?: string
}) {
  const content = (
    <Card className={cn('transition-all', href && 'hover:shadow-md hover:border-primary/20 cursor-pointer')}>
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
                  trend === 'up' && 'text-emerald-600',
                  trend === 'down' && 'text-red-600'
                )}
              >
                <TrendingUp className={cn('size-3', trend === 'down' && 'rotate-180')} />
                {trendValue}
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

// Stat item for quick stats
function StatItem({ label, value, variant = 'default' }: { label: string; value: number | string; variant?: 'default' | 'warning' | 'danger' }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn(
        'font-medium',
        variant === 'warning' && 'text-amber-600',
        variant === 'danger' && 'text-red-600'
      )}>
        {value}
      </span>
    </div>
  )
}

// Quick action button
function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full justify-start gap-3 h-12">
        {icon}
        <span>{label}</span>
        <ArrowRight className="ml-auto size-4 text-muted-foreground" />
      </Button>
    </Link>
  )
}

// Empty state component
function EmptyState({ icon, title, description, action }: { 
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
      {action && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={action.href}>
            <Plus className="size-4 mr-2" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  )
}

// Stock item component
function StockItem({ name, current, minimum, category }: { 
  name: string
  current: number
  minimum: number
  category?: string
}) {
  const percentage = Math.min((current / minimum) * 100, 100)
  const isCritical = current === 0
  const isLow = current > 0 && current <= minimum

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0">
      <div className={cn(
        'flex size-10 items-center justify-center rounded-lg shrink-0',
        isCritical ? 'bg-red-100 text-red-600' : isLow ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
      )}>
        <Package className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{name}</p>
          {category && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {category}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={percentage} className={cn(
            'h-1.5 flex-1',
            isCritical && '[&>div]:bg-red-500',
            isLow && !isCritical && '[&>div]:bg-amber-500'
          )} />
          <span className={cn(
            'text-xs font-medium shrink-0',
            isCritical ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-muted-foreground'
          )}>
            {current}/{minimum}
          </span>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton
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

// Main Dashboard
function DashboardContent() {
  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 300000,
  }
  
  const { data: inventory = [], isLoading: loadingInventory } = useSWR('dashboard-inventory', getInventoryItems, swrConfig)
  const { data: lowStock = [] } = useSWR('dashboard-lowstock', () => getLowStockItems(10), swrConfig)
  const { data: products = [], isLoading: loadingProducts } = useSWR('dashboard-products', getProducts, swrConfig)
  const { data: clients = [], isLoading: loadingClients } = useSWR('dashboard-clients', getClients, swrConfig)

  const isLoading = loadingInventory || loadingProducts || loadingClients

  // Calculate KPIs from real data
  const totalInventoryValue = inventory.reduce((acc, item) =>
    acc + ((item.current_quantity ?? 0) * (item.unit_cost ?? 0)), 0
  )

  const criticalStockCount = lowStock.filter((item) =>
    (item.current_quantity ?? 0) === 0
  ).length

  const lowStockCount = lowStock.filter((item) => {
    const qty = item.current_quantity ?? 0
    return qty > 0 && qty <= (item.minimum_quantity ?? 10)
  }).length

  const activeProducts = products.filter((p: any) => p.status === 'active' || p.ativo).length

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vinda ao seu painel de controle</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total em Estoque"
          value={inventory.length}
          description="itens cadastrados"
          icon={<Boxes className="size-5" />}
          href="/admin/estoque"
        />
        <KPICard
          title="Estoque Baixo"
          value={lowStockCount + criticalStockCount}
          description={criticalStockCount > 0 ? `${criticalStockCount} zerados` : 'itens para repor'}
          icon={<AlertTriangle className="size-5" />}
          href="/admin/estoque"
        />
        <KPICard
          title="Produtos Ativos"
          value={activeProducts || products.length}
          description="prontos para venda"
          icon={<Package className="size-5" />}
          href="/admin/produtos"
        />
        <KPICard
          title="Clientes"
          value={clients.length}
          description="cadastrados"
          icon={<Users className="size-5" />}
          href="/admin/clientes"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Stock Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-600" />
                  Estoque Baixo
                </CardTitle>
                <CardDescription>Itens que precisam de reposicao</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/estoque">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {lowStock.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="size-5 text-emerald-600" />}
                  title="Estoque em dia"
                  description="Todos os itens estao acima do minimo"
                />
              ) : (
                <div className="divide-y">
                  {lowStock.slice(0, 5).map((item: any) => (
                    <StockItem
                      key={item.id}
                      name={item.name}
                      current={item.current_quantity ?? 0}
                      minimum={item.minimum_quantity ?? 10}
                      category={item.category}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-serif">Produtos Recentes</CardTitle>
                <CardDescription>Ultimos produtos cadastrados</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/produtos">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <EmptyState
                  icon={<Package className="size-5 text-muted-foreground" />}
                  title="Nenhum produto"
                  description="Comece cadastrando seus produtos"
                  action={{ label: "Novo Produto", href: "/admin/produtos" }}
                />
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 4).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{product.name || product.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category || product.categoria}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R$ {(product.price || product.precoVenda || 0).toFixed(2)}
                        </p>
                        <Badge variant={product.status === 'active' || product.ativo ? 'default' : 'secondary'} className="text-xs">
                          {product.status === 'active' || product.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Acoes Rapidas</CardTitle>
              <CardDescription>Atalhos para tarefas comuns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                icon={<Plus className="size-4" />}
                label="Novo Item no Estoque"
                href="/admin/estoque"
              />
              <QuickAction
                icon={<Package className="size-4" />}
                label="Novo Produto"
                href="/admin/produtos"
              />
              <QuickAction
                icon={<Users className="size-4" />}
                label="Novo Cliente"
                href="/admin/clientes"
              />
              <QuickAction
                icon={<DollarSign className="size-4" />}
                label="Calcular Preco"
                href="/admin/precificacao"
              />
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Resumo</CardTitle>
              <CardDescription>Visao geral do seu negocio</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              <StatItem 
                label="Valor em Estoque" 
                value={`R$ ${totalInventoryValue.toFixed(2)}`} 
              />
              <StatItem 
                label="Itens Criticos" 
                value={criticalStockCount}
                variant={criticalStockCount > 0 ? 'danger' : 'default'}
              />
              <StatItem 
                label="Estoque Baixo" 
                value={lowStockCount}
                variant={lowStockCount > 0 ? 'warning' : 'default'}
              />
              <StatItem 
                label="Total Produtos" 
                value={products.length} 
              />
              <StatItem 
                label="Total Clientes" 
                value={clients.length} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
