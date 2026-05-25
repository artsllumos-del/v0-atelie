'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Loader2,
  TrendingDown,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getInventoryItems, getLowStockItems } from '@/lib/supabase/inventory'
import { InventoryFormDialog } from '@/components/admin/inventory-form-dialog'
import { InventoryTable } from '@/components/admin/inventory-table'

const categorias = [
  { value: 'all', label: 'Todas' },
  { value: 'contas', label: 'Contas' },
  { value: 'entremeio', label: 'Entremeios' },
  { value: 'corrente', label: 'Correntes' },
  { value: 'crucifixo', label: 'Crucifixos' },
  { value: 'fecho', label: 'Fechos' },
  { value: 'pingente', label: 'Pingentes' },
  { value: 'embalagem', label: 'Embalagens' },
  { value: 'outros', label: 'Outros' },
]

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'critical', label: 'Criticos' },
  { value: 'low', label: 'Baixo' },
  { value: 'normal', label: 'Normal' },
]

// Card view for inventory item
function InventoryCard({ item, onEdit }: { item: any; onEdit: (item: any) => void }) {
  const currentQty = item.current_quantity || item.quantity || 0
  const minQty = item.minimum_quantity || 10
  const percentage = Math.min((currentQty / minQty) * 100, 100)
  const isCritical = currentQty === 0
  const isLow = currentQty > 0 && currentQty <= minQty

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isCritical && 'border-red-200 bg-red-50/50',
        isLow && !isCritical && 'border-amber-200 bg-amber-50/50'
      )}
      onClick={() => onEdit(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {item.supplier || 'Sem fornecedor'}
            </p>
          </div>
          <Badge variant={item.category === 'contas' ? 'default' : 'secondary'} className="shrink-0 text-xs">
            {item.category || 'Outros'}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estoque</span>
            <span className={cn(
              'font-semibold',
              isCritical && 'text-red-600',
              isLow && !isCritical && 'text-amber-600'
            )}>
              {currentQty} / {minQty}
            </span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              'h-2',
              isCritical && '[&>div]:bg-red-500',
              isLow && !isCritical && '[&>div]:bg-amber-500'
            )} 
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Custo</span>
          <span className="font-medium">R$ {(item.unit_cost || 0).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Stats card component
function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  variant = 'default' 
}: { 
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
  variant?: 'default' | 'warning' | 'danger' | 'success'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          'rounded-lg p-2',
          variant === 'default' && 'bg-primary/10 text-primary',
          variant === 'warning' && 'bg-amber-100 text-amber-600',
          variant === 'danger' && 'bg-red-100 text-red-600',
          variant === 'success' && 'bg-emerald-100 text-emerald-600'
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          'text-2xl font-bold',
          variant === 'warning' && 'text-amber-600',
          variant === 'danger' && 'text-red-600'
        )}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const { data: items = [], isLoading, mutate } = useSWR('inventory-items', getInventoryItems)
  const { data: lowStockItems = [] } = useSWR('low-stock-items', () => getLowStockItems(100))

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchCategoria = categoriaFilter === 'all' || item.category === categoriaFilter
      
      const currentQty = item.current_quantity || item.quantity || 0
      const minQty = item.minimum_quantity || 10
      
      let matchStatus = true
      if (statusFilter === 'critical') {
        matchStatus = currentQty === 0
      } else if (statusFilter === 'low') {
        matchStatus = currentQty > 0 && currentQty <= minQty
      } else if (statusFilter === 'normal') {
        matchStatus = currentQty > minQty
      }
      
      return matchSearch && matchCategoria && matchStatus
    })
  }, [items, searchTerm, categoriaFilter, statusFilter])

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

  // Calculate stats
  const totalValue = items.reduce((acc, item) => 
    acc + ((item.current_quantity || item.quantity || 0) * (item.unit_cost || 0)), 0
  )
  const criticalItems = items.filter((item) => 
    (item.current_quantity || item.quantity || 0) === 0
  ).length
  const lowItems = items.filter((item) => {
    const qty = item.current_quantity || item.quantity || 0
    const min = item.minimum_quantity || 10
    return qty > 0 && qty <= min
  }).length
  const normalItems = items.length - criticalItems - lowItems

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

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Itens"
          value={items.length}
          description="itens cadastrados"
          icon={<Package className="size-5" />}
        />
        <StatsCard
          title="Zerados"
          value={criticalItems}
          description="precisam reposicao urgente"
          icon={<AlertTriangle className="size-5" />}
          variant={criticalItems > 0 ? 'danger' : 'default'}
        />
        <StatsCard
          title="Estoque Baixo"
          value={lowItems}
          description="abaixo do minimo"
          icon={<TrendingDown className="size-5" />}
          variant={lowItems > 0 ? 'warning' : 'default'}
        />
        <StatsCard
          title="Valor em Estoque"
          value={`R$ ${totalValue.toFixed(2)}`}
          description="custo total dos materiais"
          icon={<Package className="size-5" />}
          variant="success"
        />
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Itens de Estoque</CardTitle>
              <CardDescription>
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'} encontrados
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'grid')}>
                <TabsList className="h-9">
                  <TabsTrigger value="table" className="px-3">
                    <List className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="px-3">
                    <LayoutGrid className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou fornecedor..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewMode === 'table' ? (
            <InventoryTable 
              items={filteredItems} 
              onEdit={handleEdit}
              onRefresh={() => mutate()}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Package className="size-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-medium">Nenhum item encontrado</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tente ajustar os filtros ou adicione novos itens
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <InventoryCard key={item.id} item={item} onEdit={handleEdit} />
                ))
              )}
            </div>
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
