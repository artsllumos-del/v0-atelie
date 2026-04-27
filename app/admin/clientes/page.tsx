'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { clientes, pedidos } from '@/lib/mock-data'
import type { Cliente } from '@/lib/types'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ClienteRow({ cliente, onSelect }: { cliente: Cliente; onSelect: (c: Cliente) => void }) {
  return (
    <TableRow className="cursor-pointer" onClick={() => onSelect(cliente)}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(cliente.nome)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{cliente.nome}</p>
            <p className="text-sm text-muted-foreground">{cliente.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span className="text-sm">{cliente.telefone || '-'}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-muted-foreground" />
          <span className="font-medium">{cliente.totalPedidos}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">
          {cliente.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {cliente.ultimoPedido?.toLocaleDateString('pt-BR') || '-'}
        </span>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSelect(cliente)}>
              <Eye className="mr-2 size-4" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

function ClienteDetails({ cliente, open, onClose }: { cliente: Cliente | null; open: boolean; onClose: () => void }) {
  if (!cliente) return null

  const pedidosCliente = pedidos.filter((p) => p.clienteId === cliente.id)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 font-serif">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {getInitials(cliente.nome)}
              </AvatarFallback>
            </Avatar>
            {cliente.nome}
          </SheetTitle>
          <SheetDescription>Cliente desde {cliente.criadoEm.toLocaleDateString('pt-BR')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contato */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{cliente.email}</span>
              </div>
              {cliente.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{cliente.telefone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          {cliente.endereco && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p>
                    {cliente.endereco.logradouro}, {cliente.endereco.numero}
                    {cliente.endereco.complemento && ` - ${cliente.endereco.complemento}`}
                  </p>
                  <p>
                    {cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.estado}
                  </p>
                  <p>CEP: {cliente.endereco.cep}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="size-4" />
                Total de Pedidos
              </div>
              <p className="mt-1 text-2xl font-bold">{cliente.totalPedidos}</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="size-4" />
                Total Gasto
              </div>
              <p className="mt-1 text-2xl font-bold">
                {cliente.totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>

          {/* Histórico de Pedidos */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Histórico de Pedidos</h3>
            {pedidosCliente.length > 0 ? (
              <div className="space-y-2">
                {pedidosCliente.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{pedido.numero}</p>
                      <p className="text-sm text-muted-foreground">
                        {pedido.criadoEm.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {pedido.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum pedido encontrado</p>
            )}
          </div>

          {/* Observações */}
          {cliente.observacoes && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Observações</h3>
              <p className="rounded-lg bg-muted/50 p-3 text-sm">{cliente.observacoes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ClientesCards() {
  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter((c) => {
    const umMesAtras = new Date()
    umMesAtras.setMonth(umMesAtras.getMonth() - 1)
    return c.ultimoPedido && c.ultimoPedido >= umMesAtras
  }).length
  const ticketMedio = clientes.reduce((acc, c) => acc + c.totalGasto, 0) / clientes.reduce((acc, c) => acc + c.totalPedidos, 0)
  const receitaTotal = clientes.reduce((acc, c) => acc + c.totalGasto, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClientes}</div>
          <p className="text-xs text-muted-foreground">cadastrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
          <User className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clientesAtivos}</div>
          <p className="text-xs text-muted-foreground">último mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">por pedido</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
          <DollarSign className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {receitaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">todas as vendas</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const filteredClientes = clientes.filter((cliente) => {
    return (
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e histórico de compras</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards */}
      <ClientesCards />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Lista de Clientes</CardTitle>
              <CardDescription>Todos os clientes cadastrados</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <ClienteRow
                      key={cliente.id}
                      cliente={cliente}
                      onSelect={setSelectedCliente}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Sheet */}
      <ClienteDetails
        cliente={selectedCliente}
        open={!!selectedCliente}
        onClose={() => setSelectedCliente(null)}
      />
    </div>
  )
}
