'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  History,
  Scale,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { materiais } from '@/lib/mock-data'
import type { CategoriaMaterial, Material } from '@/lib/types'

const categorias: { value: CategoriaMaterial; label: string }[] = [
  { value: 'contas', label: 'Contas' },
  { value: 'crucifixos', label: 'Crucifixos' },
  { value: 'entremeios', label: 'Entremeios' },
  { value: 'fios', label: 'Fios' },
  { value: 'acabamentos', label: 'Acabamentos' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'outros', label: 'Outros' },
]

const unidadesCompra = [
  { value: 'gramas', label: 'Gramas' },
  { value: 'pacote', label: 'Pacote' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'metros', label: 'Metros' },
]

function getStatusEstoque(material: Material) {
  const percentual = (material.quantidadeDisponivel / material.estoqueMinimo) * 100

  if (percentual < 100) {
    return { status: 'critico', label: 'Crítico', color: 'bg-destructive text-destructive-foreground' }
  }
  if (percentual < 150) {
    return { status: 'baixo', label: 'Baixo', color: 'bg-warning text-warning-foreground' }
  }
  return { status: 'ok', label: 'OK', color: 'bg-success text-success-foreground' }
}

function MaterialRow({ material }: { material: Material }) {
  const statusEstoque = getStatusEstoque(material)
  const percentualEstoque = Math.min((material.quantidadeDisponivel / material.estoqueMinimo) * 100, 100)

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{material.nome}</p>
            <p className="text-sm text-muted-foreground">{material.categoria}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>{material.unidadeCompra}</p>
          {material.pesoCompra && (
            <p className="text-muted-foreground">{material.pesoCompra}g</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>{material.unidadeUso}</p>
          {material.relacaoConversao && (
            <p className="text-muted-foreground">
              {material.relacaoConversao.toFixed(2)} un/g
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Progress value={percentualEstoque} className="h-2" />
          </div>
          <span className="text-sm font-medium">
            {material.quantidadeDisponivel}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{material.estoqueMinimo}</span>
      </TableCell>
      <TableCell>
        <Badge className={cn('text-xs', statusEstoque.color)}>
          {statusEstoque.label}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-medium">
          {material.custoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 size-4" />
              Adicionar Entrada
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 size-4" />
              Ver Histórico
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

function AddMaterialDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Adicionar Material
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Adicionar Material</DialogTitle>
          <DialogDescription>
            Cadastre um novo material no estoque. O sistema irá calcular automaticamente a conversão.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome do Material</Label>
            <Input id="nome" placeholder="Ex: Contas de Cristal 6mm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input id="fornecedor" placeholder="Nome do fornecedor" />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              <span className="text-sm font-medium">Conversão de Unidades</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unidadeCompra">Unidade de Compra</Label>
                <Select>
                  <SelectTrigger id="unidadeCompra">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesCompra.map((un) => (
                      <SelectItem key={un.value} value={un.value}>
                        {un.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pesoCompra">Peso do Pacote (g)</Label>
                <Input id="pesoCompra" type="number" placeholder="80" />
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Label htmlFor="quantidadeEstimada">Quantidade Estimada de Unidades</Label>
              <Input id="quantidadeEstimada" type="number" placeholder="60" />
              <p className="text-xs text-muted-foreground">
                O sistema irá melhorar essa conversão com o tempo, baseado no consumo real.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="precoCompra">Preço de Compra (R$)</Label>
              <Input id="precoCompra" type="number" step="0.01" placeholder="25.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input id="estoqueMinimo" type="number" placeholder="100" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Salvar Material</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EstoqueCards() {
  const totalMateriais = materiais.length
  const materiaisCriticos = materiais.filter((m) => m.quantidadeDisponivel < m.estoqueMinimo).length
  const materiaisBaixos = materiais.filter(
    (m) => m.quantidadeDisponivel >= m.estoqueMinimo && m.quantidadeDisponivel < m.estoqueMinimo * 1.5
  ).length
  const valorTotalEstoque = materiais.reduce((acc, m) => acc + m.quantidadeDisponivel * m.custoUnitario, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Materiais</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMateriais}</div>
          <p className="text-xs text-muted-foreground">itens cadastrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Crítico</CardTitle>
          <AlertTriangle className="size-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{materiaisCriticos}</div>
          <p className="text-xs text-muted-foreground">abaixo do mínimo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
          <AlertTriangle className="size-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{materiaisBaixos}</div>
          <p className="text-xs text-muted-foreground">próximo do mínimo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
          <Package className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {valorTotalEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">custo total</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EstoquePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredMateriais = materiais.filter((material) => {
    const matchSearch = material.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = categoriaFilter === 'all' || material.categoria === categoriaFilter
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'critico' && material.quantidadeDisponivel < material.estoqueMinimo) ||
      (statusFilter === 'baixo' &&
        material.quantidadeDisponivel >= material.estoqueMinimo &&
        material.quantidadeDisponivel < material.estoqueMinimo * 1.5) ||
      (statusFilter === 'ok' && material.quantidadeDisponivel >= material.estoqueMinimo * 1.5)

    return matchSearch && matchCategoria && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Gerencie seus materiais e controle o estoque</p>
        </div>
        <AddMaterialDialog />
      </div>

      {/* Cards */}
      <EstoqueCards />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Materiais</CardTitle>
              <CardDescription>Lista completa de materiais cadastrados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar material..."
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
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Material</TableHead>
                  <TableHead>Un. Compra</TableHead>
                  <TableHead>Un. Uso</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custo Un.</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMateriais.length > 0 ? (
                  filteredMateriais.map((material) => (
                    <MaterialRow key={material.id} material={material} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum material encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
