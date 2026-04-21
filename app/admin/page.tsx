'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react'

const stats = [
  {
    title: 'Total de Vendas',
    value: 'R$ 0,00',
    description: 'Nenhuma venda registrada',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    title: 'Pedidos Pendentes',
    value: '0',
    description: 'Aguardando confirmação',
    icon: ShoppingCart,
    color: 'text-blue-500',
  },
  {
    title: 'Itens em Estoque',
    value: '0',
    description: 'Materiais cadastrados',
    icon: Package,
    color: 'text-orange-500',
  },
  {
    title: 'Clientes Ativos',
    value: '0',
    description: 'No último mês',
    icon: Users,
    color: 'text-purple-500',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Boas-vindas ao Ateliê Sagrado</CardTitle>
          <CardDescription>
            Sistema de gestão para produção artesanal de terços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">Sistema em desenvolvimento</p>
              <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                Use o menu lateral para navegar entre os módulos disponíveis
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <Package className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Estoque</h3>
              <p className="text-xs text-muted-foreground mt-1">Gerenciar materiais e quantidades</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <ShoppingCart className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Pedidos</h3>
              <p className="text-xs text-muted-foreground mt-1">Acompanhar vendas e encomendas</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <Users className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Clientes</h3>
              <p className="text-xs text-muted-foreground mt-1">Gerenciar base de clientes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
