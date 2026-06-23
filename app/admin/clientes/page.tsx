'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  Plus,
  Search,
  Users,
  Loader2,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { getClients } from '@/lib/supabase/clients'
import { ClientFormDialog } from '@/components/admin/client-form-dialog'
import { ClientTable } from '@/components/admin/client-table'


export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const { data: clients = [], isLoading, error, mutate } = useSWR('clients', getClients, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 300000,
  })

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar clientes')
    }
  }, [error])

  const filteredClients = clients.filter((client) => {
    const matchSearch = (client.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchType = typeFilter === 'all' ||
      (typeFilter === 'pessoa' && client.type !== 'pessoa_juridica') ||
      (typeFilter === 'empresa' && client.type === 'pessoa_juridica')
    return matchSearch && matchType
  })

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setFormDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setFormDialogOpen(false)
    setSelectedClient(null)
  }

  const handleOpenChange = (open: boolean) => {
    setFormDialogOpen(open)
    if (!open) {
      setSelectedClient(null)
    }
  }

  const handleFormSuccess = () => {
    mutate()
  }

  const totalClients = clients.length
  const totalCompanies = clients.filter((c) => c.type === 'pessoa_juridica').length
  const totalSpent = clients.reduce((acc, c) => acc + (c.total_spent || 0), 0)
  const totalOrders = clients.reduce((acc, c) => acc + (c.total_orders || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seu relacionamento com clientes</p>
        </div>
        <Button onClick={() => { setSelectedClient(null); setFormDialogOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">{totalCompanies} empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
            <ShoppingBag className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">pedidos realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalOrders > 0 ? totalSpent / totalOrders : 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">por pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <ShoppingBag className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">valor total recebido</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Clientes</CardTitle>
              <CardDescription>Lista de todos os clientes cadastrados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="w-full pl-9 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pessoa">Pessoas</SelectItem>
                  <SelectItem value="empresa">Empresas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ClientTable 
              clients={filteredClients} 
              onEdit={handleEdit}
            />
          )}
        </CardContent>
      </Card>

      <ClientFormDialog 
        open={formDialogOpen}
        onOpenChange={handleOpenChange}
        client={selectedClient}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
