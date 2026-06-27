'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockItems: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar estatísticas
        const [ordersRes, productsRes, materialsRes] = await Promise.all([
          supabase.from('orders').select('id, total_value', { count: 'exact' }),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('materials').select('id, current_quantity, minimum_quantity'),
        ])

        const lowStock = materialsRes.data?.filter(
          m => m.minimum_quantity && m.current_quantity < m.minimum_quantity
        ).length || 0

        const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0

        setStats({
          totalOrders: ordersRes.count || 0,
          totalRevenue,
          totalProducts: productsRes.count || 0,
          lowStockItems: lowStock,
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const KPICard = ({ title, value, icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao painel de controle</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-4 h-4" />}
          trend={`${stats.totalOrders} pedidos registrados`}
        />
        <KPICard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-4 h-4" />}
          trend="Faturamento acumulado"
        />
        <KPICard
          title="Produtos"
          value={stats.totalProducts}
          icon={<Package className="w-4 h-4" />}
          trend={`${stats.totalProducts} produtos cadastrados`}
        />
        <KPICard
          title="Estoque Baixo"
          value={stats.lowStockItems}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend={`${stats.lowStockItems} itens com alerta`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/estoque" className="block p-2 hover:bg-muted rounded-lg transition">
              <p className="font-medium">Gerenciar Estoque</p>
              <p className="text-sm text-muted-foreground">Controlar materiais e quantidade</p>
            </a>
            <a href="/admin/produtos" className="block p-2 hover:bg-muted rounded-lg transition">
              <p className="font-medium">Produtos</p>
              <p className="text-sm text-muted-foreground">Criar e editar produtos</p>
            </a>
            <a href="/admin/pedidos" className="block p-2 hover:bg-muted rounded-lg transition">
              <p className="font-medium">Pedidos</p>
              <p className="text-sm text-muted-foreground">Acompanhar produção</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>Status geral da aplicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Banco de Dados</span>
              <Badge className="bg-green-500">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API</span>
              <Badge className="bg-green-500">Funcional</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache</span>
              <Badge className="bg-green-500">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
