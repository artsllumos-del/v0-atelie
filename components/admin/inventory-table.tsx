'use client'

import { useState } from 'react'
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { deleteInventoryItem } from '@/lib/supabase/inventory'

interface InventoryTableProps {
  items: any[]
  onEdit: (item: any) => void
  onRefresh: () => void
}

type SortField = 'name' | 'category' | 'quantity' | 'cost' | 'status'
type SortDirection = 'asc' | 'desc'

export function InventoryTable({ items, onEdit, onRefresh }: InventoryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
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

  const sortedItems = [...items].sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'category':
        aValue = (a.category || '').toLowerCase()
        bValue = (b.category || '').toLowerCase()
        break
      case 'quantity':
        aValue = a.current_quantity || a.quantity || 0
        bValue = b.current_quantity || b.quantity || 0
        break
      case 'cost':
        aValue = a.unit_cost || 0
        bValue = b.unit_cost || 0
        break
      case 'status':
        const aQty = a.current_quantity || a.quantity || 0
        const aMin = a.minimum_quantity || 10
        const bQty = b.current_quantity || b.quantity || 0
        const bMin = b.minimum_quantity || 10
        aValue = aQty === 0 ? 0 : aQty <= aMin ? 1 : 2
        bValue = bQty === 0 ? 0 : bQty <= bMin ? 1 : 2
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    
    try {
      setDeletingId(itemToDelete.id)
      await deleteInventoryItem(itemToDelete.id)
      toast.success('Item deletado com sucesso')
      onRefresh()
    } catch (error) {
      toast.error('Erro ao deletar item')
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { label: 'Zerado', variant: 'destructive' as const, color: 'text-red-600' }
    if (quantity <= minQuantity) return { label: 'Critico', variant: 'destructive' as const, color: 'text-red-600' }
    if (quantity <= minQuantity * 1.5) return { label: 'Baixo', variant: 'secondary' as const, color: 'text-amber-600' }
    return { label: 'Normal', variant: 'default' as const, color: 'text-emerald-600' }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 size-3 text-muted-foreground" />
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 size-3" />
      : <ArrowDown className="ml-1 size-3" />
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button 
      variant="ghost" 
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <SortIcon field={field} />
    </Button>
  )

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Package className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-medium">Nenhum item cadastrado</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece adicionando seus materiais ao estoque
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
                <SortableHeader field="name">Nome</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="category">Categoria</SortableHeader>
              </TableHead>
              <TableHead className="text-center">
                <SortableHeader field="quantity">Quantidade</SortableHeader>
              </TableHead>
              <TableHead className="text-center">
                <SortableHeader field="status">Status</SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader field="cost">Custo</SortableHeader>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => {
              const currentQty = item.current_quantity || item.quantity || 0
              const minQty = item.minimum_quantity || 10
              const { label, variant, color } = getStockStatus(currentQty, minQty)
              const stockPercentage = Math.min((currentQty / (minQty * 2)) * 100, 100)

              return (
                <TableRow 
                  key={item.id}
                  className={cn(
                    'cursor-pointer transition-colors',
                    currentQty === 0 && 'bg-red-50/50 hover:bg-red-50',
                    currentQty > 0 && currentQty <= minQty && 'bg-amber-50/50 hover:bg-amber-50'
                  )}
                  onClick={() => onEdit(item)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.supplier && (
                        <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'Outros'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn('font-semibold', color)}>{currentQty}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>min: {minQty}</span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className={cn(
                          'h-1.5 w-16',
                          currentQty === 0 && '[&>div]:bg-red-500',
                          currentQty > 0 && currentQty <= minQty && '[&>div]:bg-amber-500',
                          currentQty > minQty && '[&>div]:bg-emerald-500'
                        )} 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={variant}>{label}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {(item.unit_cost || 0).toFixed(2)}
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
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(item)}
                          disabled={deletingId === item.id}
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
            <AlertDialogTitle>Excluir item?</AlertDialogTitle>
            <AlertDialogDescription>
              Voce tem certeza que deseja excluir &quot;{itemToDelete?.name}&quot;? Esta acao nao pode ser desfeita.
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
