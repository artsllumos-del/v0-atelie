'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  DollarSign,
  Clock,
  Layers,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { produtos, materiais } from '@/lib/mock-data'
import type { Produto } from '@/lib/types'
import Link from 'next/link'

function ProdutoCard({ produto }: { produto: Produto }) {
  const margemSaudavel = produto.margemLucro >= 40
  const margemBaixa = produto.margemLucro < 30

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">{produto.nome}</CardTitle>
              <CardDescription className="line-clamp-1">{produto.descricao}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 size-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 size-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Componentes */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="size-4" />
          <span>{produto.componentes.length} componentes</span>
        </div>

        {/* Custos */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Custo Total</span>
            <span className="font-medium">
              {produto.custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Preço de Venda</span>
            <span className="font-semibold text-primary">
              {produto.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Margem e Tempo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                'text-xs',
                margemSaudavel && 'bg-success text-success-foreground',
                margemBaixa && 'bg-destructive text-destructive-foreground',
                !margemSaudavel && !margemBaixa && 'bg-warning text-warning-foreground'
              )}
            >
              {produto.margemLucro}% margem
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{produto.tempoProducaoMinutos}min</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Ativo</span>
          <Switch checked={produto.ativo} />
        </div>
      </CardContent>
    </Card>
  )
}

function ProdutosCards() {
  const totalProdutos = produtos.length
  const produtosAtivos = produtos.filter((p) => p.ativo).length
  const custoMedio = produtos.reduce((acc, p) => acc + p.custoTotal, 0) / produtos.length
  const margemMedia = produtos.reduce((acc, p) => acc + p.margemLucro, 0) / produtos.length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProdutos}</div>
          <p className="text-xs text-muted-foreground">{produtosAtivos} ativos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Custo Médio</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {custoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">por produto</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Margem Média</CardTitle>
          <DollarSign className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{margemMedia.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">lucro bruto</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(produtos.reduce((acc, p) => acc + p.tempoProducaoMinutos, 0) / produtos.length)}min
          </div>
          <p className="text-xs text-muted-foreground">de produção</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')

  const filteredProdutos = produtos.filter((produto) => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = categoriaFilter === 'all' || produto.categoria === categoriaFilter
    return matchSearch && matchCategoria
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seus produtos e composições</p>
        </div>
        <Button asChild>
          <Link href="/admin/produtos/novo">
            <Plus className="mr-2 size-4" />
            Novo Produto
          </Link>
        </Button>
      </div>

      {/* Cards */}
      <ProdutosCards />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-9"
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
            <SelectItem value="terco">Terço</SelectItem>
            <SelectItem value="rosario">Rosário</SelectItem>
            <SelectItem value="pulseira">Pulseira</SelectItem>
            <SelectItem value="dezena">Dezena</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Produtos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProdutos.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12">
          <Package className="size-12 text-muted-foreground" />
          <h3 className="mt-4 font-serif text-lg font-medium">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente ajustar os filtros ou adicione um novo produto
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin/produtos/novo">
              <Plus className="mr-2 size-4" />
              Novo Produto
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
