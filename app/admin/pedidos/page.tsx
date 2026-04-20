'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  XCircle,
  CreditCard,
  User,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { pedidos } from '@/lib/mock-data'
import type { Pedido, StatusPedido } from '@/lib/types'

const statusConfig: Record<StatusPedido, { label: string; color: string; icon: typeof Clock }> = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: 'bg-muted text-muted-foreground', icon: CreditCard },
  pago: { label: 'Pago', color: 'bg-primary/10 text-primary', icon: CheckCircle2 },
  em_producao: { label: 'Em Produção', color: 'bg-warning/10 text-warning', icon: Clock },
  pronto: { label: 'Pronto', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  enviado: { label: 'Enviado', color: 'bg-primary/10 text-primary', icon: Truck },
  entregue: { label: 'Entregue', color: 'bg-success/10 text-success', icon: Package },
  cancelado: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive', icon: XCircle },
}

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'bg-muted text-muted-foreground' },
  normal: { label: 'Normal', color: 'bg-primary/10 text-primary' },
  alta: { label: 'Alta', color: 'bg-warning/10 text-warning' },
  urgente: { label: 'Urgente', color: 'bg-destructive/10 text-destructive' },
}

function PedidoCard({ pedido, view = 'kanban' }: { pedido: Pedido; view?: 'kanban' | 'lista' }) {
  const status = statusConfig[pedido.status]
  const prioridade = prioridadeConfig[pedido.prioridade]
  const StatusIcon = status.icon
  const diasRestantes = pedido.prazoEntrega
    ? Math.ceil((pedido.prazoEntrega.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  if (view === 'lista') {
    return (
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm">
        <div className={cn('flex size-10 items-center justify-center rounded-lg', status.color)}>
          <StatusIcon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{pedido.numero}</span>
            <Badge variant="outline" className={cn('text-xs', prioridade.color)}>
              {prioridade.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pedido.cliente?.nome}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">
            {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          {diasRestantes !== null && (
            <p className={cn('text-xs', diasRestantes <= 3 ? 'text-destructive' : 'text-muted-foreground')}>
              {diasRestantes <= 0 ? 'Atrasado' : `${diasRestantes} dias`}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 size-4" />
              Imprimir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <span className="font-medium">{pedido.numero}</span>
            <Badge variant="outline" className={cn('ml-2 text-xs', prioridade.color)}>
              {prioridade.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 size-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <User className="size-3.5" />
          <span className="truncate">{pedido.cliente?.nome}</span>
        </div>

        <div className="mb-3 space-y-1">
          {pedido.itens.slice(0, 2).map((item, index) => (
            <p key={index} className="text-sm text-muted-foreground truncate">
              {item.quantidade}x {item.descricao}
            </p>
          ))}
          {pedido.itens.length > 2 && (
            <p className="text-xs text-muted-foreground">+{pedido.itens.length - 2} itens</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {diasRestantes !== null && (
              <span className={diasRestantes <= 3 ? 'text-destructive' : ''}>
                {diasRestantes <= 0 ? 'Atrasado' : `${diasRestantes}d`}
              </span>
            )}
          </div>
          <span className="font-semibold">
            {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function KanbanColumn({ title, status, pedidosList }: { title: string; status: StatusPedido[]; pedidosList: Pedido[] }) {
  const filteredPedidos = pedidosList.filter((p) => status.includes(p.status))

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-xl bg-muted/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Badge variant="secondary">{filteredPedidos.length}</Badge>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {filteredPedidos.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} view="kanban" />
        ))}
        {filteredPedidos.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">Nenhum pedido</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PedidosKanban() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn title="Em Produção" status={['em_producao', 'pago']} pedidosList={pedidos} />
      <KanbanColumn title="Pronto" status={['pronto']} pedidosList={pedidos} />
      <KanbanColumn title="Enviado" status={['enviado']} pedidosList={pedidos} />
      <KanbanColumn title="Entregue" status={['entregue']} pedidosList={pedidos} />
    </div>
  )
}

function PedidosCards() {
  const pedidosAtivos = pedidos.filter((p) => !['entregue', 'cancelado'].includes(p.status)).length
  const pedidosEmProducao = pedidos.filter((p) => p.status === 'em_producao').length
  const pedidosProntos = pedidos.filter((p) => p.status === 'pronto').length
  const receitaPendente = pedidos
    .filter((p) => !['entregue', 'cancelado'].includes(p.status))
    .reduce((acc, p) => acc + p.total, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Ativos</CardTitle>
          <Package className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pedidosAtivos}</div>
          <p className="text-xs text-muted-foreground">em andamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Em Produção</CardTitle>
          <Clock className="size-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pedidosEmProducao}</div>
          <p className="text-xs text-muted-foreground">aguardando</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Prontos</CardTitle>
          <CheckCircle2 className="size-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pedidosProntos}</div>
          <p className="text-xs text-muted-foreground">para enviar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita Pendente</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {receitaPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">a receber</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchSearch =
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || pedido.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos e acompanhe o status</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Cards */}
      <PedidosCards />

      {/* Tabs: Kanban e Lista */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pedido..."
                className="w-full pl-9 sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(statusConfig).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="kanban" className="mt-4">
          <PedidosKanban />
        </TabsContent>

        <TabsContent value="lista" className="mt-4 space-y-3">
          {filteredPedidos.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} view="lista" />
          ))}
          {filteredPedidos.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12">
              <Package className="size-12 text-muted-foreground" />
              <h3 className="mt-4 font-serif text-lg font-medium">Nenhum pedido encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Tente ajustar os filtros</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
