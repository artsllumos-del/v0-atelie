'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { pedidos, clientes } from '@/lib/mock-data'

const clienteAtual = clientes[0]
const pedidosCliente = pedidos.filter((p) => p.clienteId === clienteAtual.id)

const statusConfig = {
  aguardando_pagamento: { label: 'Aguardando', color: 'bg-muted text-muted-foreground', icon: Clock },
  pago: { label: 'Pago', color: 'bg-primary/10 text-primary', icon: CheckCircle2 },
  em_producao: { label: 'Em Produção', color: 'bg-warning/10 text-warning', icon: Clock },
  pronto: { label: 'Pronto', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  enviado: { label: 'Enviado', color: 'bg-primary/10 text-primary', icon: Truck },
  entregue: { label: 'Entregue', color: 'bg-success/10 text-success', icon: Package },
  cancelado: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive', icon: Clock },
}

function PedidoCard({ pedido }: { pedido: typeof pedidos[0] }) {
  const status = statusConfig[pedido.status]
  const StatusIcon = status.icon

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">{pedido.numero}</span>
              <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {pedido.criadoEm.toLocaleDateString('pt-BR')}
            </p>
          </div>
          <span className="text-lg font-bold text-primary">
            {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {pedido.itens.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <Package className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{item.quantidade}x</span>
              <span>{item.descricao}</span>
            </div>
          ))}
        </div>

        {/* Timeline de Status */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
          <StatusIcon className={cn('size-5', status.color.split(' ')[1])} />
          <div className="flex-1">
            <p className="text-sm font-medium">{status.label}</p>
            {pedido.status === 'enviado' && pedido.codigoRastreio && (
              <p className="text-xs text-muted-foreground">
                Rastreio: {pedido.codigoRastreio}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm">
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MeusDados() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Dados Pessoais</CardTitle>
          <CardDescription>Suas informações de cadastro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Nome</label>
              <p className="font-medium">{clienteAtual.nome}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">E-mail</label>
              <p className="font-medium">{clienteAtual.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Telefone</label>
              <p className="font-medium">{clienteAtual.telefone || '-'}</p>
            </div>
          </div>
          <Button variant="outline">Editar dados</Button>
        </CardContent>
      </Card>

      {clienteAtual.endereco && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <MapPin className="size-5" />
              Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p>
                {clienteAtual.endereco.logradouro}, {clienteAtual.endereco.numero}
                {clienteAtual.endereco.complemento && ` - ${clienteAtual.endereco.complemento}`}
              </p>
              <p>
                {clienteAtual.endereco.bairro}, {clienteAtual.endereco.cidade} -{' '}
                {clienteAtual.endereco.estado}
              </p>
              <p>CEP: {clienteAtual.endereco.cep}</p>
            </div>
            <Button variant="outline" className="mt-4">
              Alterar endereço
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MeusPedidos() {
  return (
    <div className="space-y-4">
      {pedidosCliente.length > 0 ? (
        pedidosCliente.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-lg font-medium">Nenhum pedido</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Você ainda não fez nenhum pedido
            </p>
            <Button className="mt-4" asChild>
              <Link href="/loja/produtos">Ver produtos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ContaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary text-lg text-primary-foreground">
            {clienteAtual.nome.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-serif text-2xl font-bold">{clienteAtual.nome}</h1>
          <p className="text-muted-foreground">{clienteAtual.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clienteAtual.totalPedidos}</p>
              <p className="text-sm text-muted-foreground">Pedidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="size-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {pedidosCliente.filter((p) => p.status === 'entregue').length}
              </p>
              <p className="text-sm text-muted-foreground">Entregues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {clienteAtual.totalGasto.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-sm text-muted-foreground">Total gasto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pedidos" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
          <TabsTrigger value="dados">Meus Dados</TabsTrigger>
        </TabsList>
        <TabsContent value="pedidos" className="mt-6">
          <MeusPedidos />
        </TabsContent>
        <TabsContent value="dados" className="mt-6">
          <MeusDados />
        </TabsContent>
      </Tabs>
    </div>
  )
}
