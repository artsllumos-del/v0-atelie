'use client'

import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { transacoes, produtos, pedidos, kpiDashboard } from '@/lib/mock-data'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Dados para gráficos
const dadosReceitaMensal = [
  { mes: 'Jan', receita: 2800, custos: 1200 },
  { mes: 'Fev', receita: 3200, custos: 1400 },
  { mes: 'Mar', receita: 4250, custos: 1800 },
  { mes: 'Abr', receita: 3800, custos: 1600 },
  { mes: 'Mai', receita: 4500, custos: 1900 },
  { mes: 'Jun', receita: 5200, custos: 2100 },
]

const dadosLucroProduto = produtos.map((p) => ({
  nome: p.nome.split(' ').slice(0, 2).join(' '),
  lucro: p.precoVenda - p.custoTotal,
  margem: p.margemLucro,
}))

const chartConfig = {
  receita: {
    label: 'Receita',
    color: 'hsl(var(--chart-1))',
  },
  custos: {
    label: 'Custos',
    color: 'hsl(var(--chart-3))',
  },
  lucro: {
    label: 'Lucro',
    color: 'hsl(var(--chart-2))',
  },
}

function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  variant = 'default',
}: {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'success' | 'destructive'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={cn(
            'rounded-lg p-2',
            variant === 'success' && 'bg-success/10 text-success',
            variant === 'destructive' && 'bg-destructive/10 text-destructive',
            variant === 'default' && 'bg-primary/10 text-primary'
          )}
        >
          {icon}
        </div>
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

function TransacaoItem({ transacao }: { transacao: typeof transacoes[0] }) {
  const isReceita = transacao.tipo === 'receita'

  return (
    <div className="flex items-center gap-4 py-3">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-lg',
          isReceita ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}
      >
        {isReceita ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />}
      </div>
      <div className="flex-1">
        <p className="font-medium">{transacao.descricao}</p>
        <p className="text-sm text-muted-foreground">{transacao.data.toLocaleDateString('pt-BR')}</p>
      </div>
      <span
        className={cn('text-lg font-semibold', isReceita ? 'text-success' : 'text-destructive')}
      >
        {isReceita ? '+' : '-'}
        {transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  )
}

function FluxoCaixaTab() {
  const receitas = transacoes.filter((t) => t.tipo === 'receita')
  const despesas = transacoes.filter((t) => t.tipo === 'despesa')
  const totalReceitas = receitas.reduce((acc, t) => acc + t.valor, 0)
  const totalDespesas = despesas.reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalReceitas - totalDespesas

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Total de Receitas"
          value={totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={<TrendingUp className="size-5" />}
          variant="success"
        />
        <KPICard
          title="Total de Despesas"
          value={totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={<TrendingDown className="size-5" />}
          variant="destructive"
        />
        <KPICard
          title="Saldo"
          value={saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={<DollarSign className="size-5" />}
          variant={saldo >= 0 ? 'success' : 'destructive'}
        />
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Receita vs Custos</CardTitle>
          <CardDescription>Comparativo mensal</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart data={dadosReceitaMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
              <Bar dataKey="custos" fill="var(--color-custos)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif">Transações Recentes</CardTitle>
            <CardDescription>Últimas movimentações financeiras</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
        </CardHeader>
        <CardContent className="divide-y">
          {transacoes.slice(0, 6).map((transacao) => (
            <TransacaoItem key={transacao.id} transacao={transacao} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function LucratividadeTab() {
  const produtoMaisLucrativo = produtos.reduce((max, p) =>
    p.precoVenda - p.custoTotal > max.precoVenda - max.custoTotal ? p : max
  )

  return (
    <div className="space-y-6">
      {/* Destaque */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Package className="size-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Produto mais lucrativo</p>
            <h3 className="font-serif text-xl font-bold">{produtoMaisLucrativo.nome}</h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">
                Margem: {produtoMaisLucrativo.margemLucro}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                Lucro:{' '}
                {(produtoMaisLucrativo.precoVenda - produtoMaisLucrativo.custoTotal).toLocaleString(
                  'pt-BR',
                  { style: 'currency', currency: 'BRL' }
                )}
                /un
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Lucro por Produto */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Lucro por Produto</CardTitle>
          <CardDescription>Comparativo de lucratividade</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart data={dadosLucroProduto} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="lucro" fill="var(--color-lucro)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Análise por Produto</CardTitle>
          <CardDescription>Detalhamento de custos e lucros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                  <Package className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{produto.nome}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      Custo:{' '}
                      {produto.custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span>
                      Venda:{' '}
                      {produto.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">
                    {(produto.precoVenda - produto.custoTotal).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                  <Badge
                    className={cn(
                      'mt-1',
                      produto.margemLucro >= 40 && 'bg-success/10 text-success',
                      produto.margemLucro < 30 && 'bg-destructive/10 text-destructive',
                      produto.margemLucro >= 30 && produto.margemLucro < 40 && 'bg-warning/10 text-warning'
                    )}
                  >
                    {produto.margemLucro}% margem
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FinanceiroPage() {
  const receitaTotal = transacoes.filter((t) => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
  const despesaTotal = transacoes.filter((t) => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0)
  const lucroLiquido = receitaTotal - despesaTotal

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho financeiro do seu negócio</p>
        </div>
        <Select defaultValue="mes">
          <SelectTrigger className="w-40">
            <Calendar className="mr-2 size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semana">Esta semana</SelectItem>
            <SelectItem value="mes">Este mês</SelectItem>
            <SelectItem value="trimestre">Este trimestre</SelectItem>
            <SelectItem value="ano">Este ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Mensal"
          value={kpiDashboard.receitaMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          trend={kpiDashboard.variacaoReceita > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(kpiDashboard.variacaoReceita)}%`}
          description="vs. mês anterior"
          icon={<DollarSign className="size-5" />}
        />
        <KPICard
          title="Lucro Líquido"
          value={lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          icon={<TrendingUp className="size-5" />}
          variant="success"
        />
        <KPICard
          title="Margem Média"
          value={`${kpiDashboard.margemLucroMedia}%`}
          trend={kpiDashboard.variacaoMargem > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(kpiDashboard.variacaoMargem)}%`}
          description="vs. mês anterior"
          icon={<CreditCard className="size-5" />}
        />
        <KPICard
          title="Pedidos Ativos"
          value={kpiDashboard.pedidosAtivos.toString()}
          description="em andamento"
          icon={<ShoppingCart className="size-5" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="fluxo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fluxo">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="lucratividade">Lucratividade</TabsTrigger>
        </TabsList>

        <TabsContent value="fluxo">
          <FluxoCaixaTab />
        </TabsContent>

        <TabsContent value="lucratividade">
          <LucratividadeTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
