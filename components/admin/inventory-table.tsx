// Tabela de estoque
'use client'

import { useState } from 'react'
import {
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  TrendingDown,
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
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { deleteInventoryItem } from '@/lib/supabase/inventory'

interface InventoryTableProps {
  items: any[]
  onEdit: (item: any) => void
  onRefresh: () => void
}

export function InventoryTable({ items, onEdit, onRefresh }: InventoryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteInventoryItem(id)
      toast.success('Item deletado com sucesso')
      onRefresh()
    } catch (error) {
      toast.error('Erro ao deletar item')
    } finally {
      setDeletingId(null)
    }
  }

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { status: 'Zerado', variant: 'destructive' as const }
    if (quantity <= minQuantity) return { status: 'Crítico', variant: 'destructive' as const }
    if (quantity <= minQuantity * 2) return { status: 'Baixo', variant: 'secondary' as const }
    return { status: 'Normal', variant: 'default' as const }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-center">Quantidade</TableHead>
            <TableHead className="text-center">Mínimo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Custo Unitário</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum item cadastrado
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const { status, variant } = getStockStatus(item.quantity, item.minimum_quantity || 10)
              const stockPercentage = Math.min((item.quantity / (item.minimum_quantity || 10)) * 100, 100)

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.category?.charAt(0).toUpperCase() + item.category?.slice(1).replace(/_/g, ' ') || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <p className="font-semibold">{item.quantity}</p>
                      <Progress value={stockPercentage} className="h-1 w-16 mx-auto" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.minimum_quantity || 10}</TableCell>
                  <TableCell>
                    <Badge variant={variant}>{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">R$ {(item.unit_cost || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
