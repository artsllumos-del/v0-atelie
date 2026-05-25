'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  Plus,
  Search,
  Package,
  Loader2,
  TrendingUp,
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
import { getProducts } from '@/lib/supabase/products'
import { ProductFormDialog } from '@/components/admin/product-form-dialog'
import { ProductTable } from '@/components/admin/product-table'

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const { data: products = [], isLoading, error, mutate } = useSWR('products', getProducts)

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar produtos')
    }
  }, [error])

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'ativo' && product.is_active) ||
      (statusFilter === 'inativo' && !product.is_active)
    return matchSearch && matchStatus
  })

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setFormDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setFormDialogOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenChange = (open: boolean) => {
    setFormDialogOpen(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }

  const handleFormSuccess = () => {
    mutate()
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p: any) => p.is_active).length
  const avgProductionTime = Math.round(
    products.reduce((acc: number, p: any) => acc + (p.production_time_minutes || 0), 0) / Math.max(totalProducts, 1)
  )
  const totalBasePrice = products.reduce((acc: number, p: any) => acc + (p.base_price || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de terços e produtos</p>
        </div>
        <Button onClick={() => { setSelectedProduct(null); setFormDialogOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Novo Produto
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Ativos</CardTitle>
            <TrendingUp className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeProducts}</div>
            <p className="text-xs text-muted-foreground">disponíveis para venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProductionTime}</div>
            <p className="text-xs text-muted-foreground">minutos de produção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Base</CardTitle>
            <Package className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalBasePrice.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">soma dos preços base</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Produtos</CardTitle>
              <CardDescription>Lista de todos os produtos cadastrados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto..."
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
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
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
            <ProductTable 
              products={filteredProducts} 
              onEdit={handleEdit}
              onRefresh={() => mutate()}
            />
          )}
        </CardContent>
      </Card>

      <ProductFormDialog 
        open={formDialogOpen}
        onOpenChange={handleOpenChange}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
