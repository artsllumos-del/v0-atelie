'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { getInventoryItems, getLowStockItems } from '@/lib/supabase/inventory'
import { InventoryFormDialog } from '@/components/admin/inventory-form-dialog'
import { InventoryTable } from '@/components/admin/inventory-table'

const categorias = ['crucifixo', 'entremeio', 'conta_menor', 'conta_maior', 'fecho', 'pingente', 'corrente', 'embalagem', 'outros']

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const { data: items = [], isLoading, error, mutate } = useSWR('inventory-items', getInventoryItems)
  const { data: lowStockItems = [] } = useSWR('low-stock-items', () => getLowStockItems(5))

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar estoque')
    }
  }, [error])

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = categoriaFilter === 'all' || item.category === categoriaFilter
    return matchSearch && matchCategoria
  })

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setFormDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setFormDialogOpen(false)
    setSelectedItem(null)
  }

  const handleOpenChange = (open: boolean) => {
    setFormDialogOpen(open)
    if (!open) {
      setSelectedItem(null)
    }
  }

  const handleFormSuccess = () => {
    mutate()
  }

  const totalValue = items.reduce((acc, item) => acc + ((item.current_quantity || item.quantity || 0) * (item.unit_cost || 0)), 0)
  const criticalItems = lowStockItems.filter((item: any) => (item.current_quantity || item.quantity) === 0).length
  const lowItems = lowStockItems.filter((item: any) => (item.current_quantity || item.quantity) > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Gerencie seus materiais e controle o estoque</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setFormDialogOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Novo Item
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">itens cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fora de Estoque</CardTitle>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">zerados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
            <AlertTriangle className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowItems}</div>
            <p className="text-xs text-muted-foreground">abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
            <Package className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">custo do estoque</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Itens de Estoque</CardTitle>
              <CardDescription>Lista completa de materiais cadastrados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar item..."
                  className="w-full pl-9 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
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
            <InventoryTable 
              items={filteredItems} 
              onEdit={handleEdit}
              onRefresh={() => mutate()}
            />
          )}
        </CardContent>
      </Card>

      <InventoryFormDialog 
        open={formDialogOpen}
        onOpenChange={handleOpenChange}
        item={selectedItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
