// Componente de tabela para produtos
'use client'

import { useState } from 'react'
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
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
import { toast } from 'sonner'
import { deleteProduct } from '@/lib/supabase/products'

interface ProductTableProps {
  products: any[]
  onEdit: (product: any) => void
  onRefresh: () => void
}

export function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteProduct(id)
      toast.success('Produto deletado com sucesso')
      onRefresh()
    } catch (error) {
      toast.error('Erro ao deletar produto')
    } finally {
      setDeletingId(null)
    }
  }

  const getMarginStatus = (basePrice: number, salePrice?: number) => {
    const price = salePrice || basePrice
    if (price <= 0) return { status: 'Sem preço', variant: 'secondary' as const }
    const margin = ((price - basePrice) / basePrice) * 100
    if (margin >= 40) return { status: 'Saudável', variant: 'default' as const }
    if (margin >= 20) return { status: 'Normal', variant: 'secondary' as const }
    return { status: 'Baixo', variant: 'destructive' as const }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Preço Base</TableHead>
            <TableHead className="text-right">Preço Venda</TableHead>
            <TableHead className="text-center">Tempo (min)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const { status, variant } = getMarginStatus(product.base_price, product.sale_price)

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">R$ {product.base_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">R$ {(product.sale_price || product.base_price).toFixed(2)}</TableCell>
                  <TableCell className="text-center text-sm">{product.production_time_minutes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={variant}>{status}</Badge>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
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
