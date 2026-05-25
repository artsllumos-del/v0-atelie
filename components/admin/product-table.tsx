'use client'

import { useState } from 'react'
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  Clock,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { deleteProduct, updateProduct } from '@/lib/supabase/products'

interface ProductTableProps {
  products: any[]
  onEdit: (product: any) => void
  onRefresh: () => void
}

type SortField = 'name' | 'base_price' | 'sale_price' | 'time' | 'status'
type SortDirection = 'asc' | 'desc'

export function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'base_price':
        aValue = a.base_price || 0
        bValue = b.base_price || 0
        break
      case 'sale_price':
        aValue = a.sale_price || a.base_price || 0
        bValue = b.sale_price || b.base_price || 0
        break
      case 'time':
        aValue = a.production_time_minutes || 0
        bValue = b.production_time_minutes || 0
        break
      case 'status':
        aValue = a.is_active ? 1 : 0
        bValue = b.is_active ? 1 : 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    
    try {
      setDeletingId(productToDelete.id)
      await deleteProduct(productToDelete.id)
      toast.success('Produto deletado com sucesso')
      onRefresh()
    } catch (error) {
      toast.error('Erro ao deletar produto')
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleToggleActive = async (product: any) => {
    try {
      await updateProduct(product.id, { is_active: !product.is_active })
      toast.success(product.is_active ? 'Produto desativado' : 'Produto ativado')
      onRefresh()
    } catch (error) {
      toast.error('Erro ao atualizar produto')
    }
  }

  const getMarginInfo = (basePrice: number, salePrice?: number) => {
    const price = salePrice || basePrice
    if (basePrice <= 0) return { margin: 0, label: 'Sem custo', variant: 'secondary' as const, color: '' }
    const margin = ((price - basePrice) / basePrice) * 100
    if (margin >= 50) return { margin, label: 'Otima', variant: 'default' as const, color: 'text-emerald-600' }
    if (margin >= 30) return { margin, label: 'Boa', variant: 'secondary' as const, color: 'text-amber-600' }
    if (margin >= 0) return { margin, label: 'Baixa', variant: 'destructive' as const, color: 'text-red-600' }
    return { margin, label: 'Negativa', variant: 'destructive' as const, color: 'text-red-600' }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 size-3 text-muted-foreground" />
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 size-3" />
      : <ArrowDown className="ml-1 size-3" />
  }

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <Button 
      variant="ghost" 
      className={cn('h-auto p-0 font-medium hover:bg-transparent', className)}
      onClick={() => handleSort(field)}
    >
      {children}
      <SortIcon field={field} />
    </Button>
  )

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Package className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-medium">Nenhum produto cadastrado</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece adicionando seus produtos ao catalogo
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[35%]">
                <SortableHeader field="name">Produto</SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader field="base_price" className="justify-end">Custo</SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader field="sale_price" className="justify-end">Venda</SortableHeader>
              </TableHead>
              <TableHead className="text-center">Margem</TableHead>
              <TableHead className="text-center">
                <SortableHeader field="time">Tempo</SortableHeader>
              </TableHead>
              <TableHead className="text-center">
                <SortableHeader field="status">Status</SortableHeader>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => {
              const { margin, label, variant, color } = getMarginInfo(product.base_price, product.sale_price)

              return (
                <TableRow 
                  key={product.id}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !product.is_active && 'opacity-60'
                  )}
                  onClick={() => onEdit(product)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex size-10 items-center justify-center rounded-lg shrink-0',
                        product.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        <Package className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {(product.base_price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-primary">
                      R$ {(product.sale_price || product.base_price || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant={variant}>{label}</Badge>
                      <span className={cn('text-xs font-medium', color)}>
                        {margin > 0 ? `+${margin.toFixed(0)}%` : `${margin.toFixed(0)}%`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="size-3" />
                      <span className="text-sm">{formatTime(product.production_time_minutes || 0)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acoes</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                          {product.is_active ? (
                            <>
                              <EyeOff className="mr-2 size-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 size-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(product)}
                          disabled={deletingId === product.id}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Voce tem certeza que deseja excluir &quot;{productToDelete?.name}&quot;? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
