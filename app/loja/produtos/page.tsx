'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Package, ShoppingCart, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { produtos } from '@/lib/mock-data'

const categorias = [
  { value: 'all', label: 'Todas' },
  { value: 'terco', label: 'Terços' },
  { value: 'rosario', label: 'Rosários' },
  { value: 'pulseira', label: 'Pulseiras' },
  { value: 'dezena', label: 'Dezenas' },
]

function ProductCard({ produto }: { produto: typeof produtos[0] }) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square bg-gradient-to-br from-accent to-muted p-6">
        <div className="flex size-full items-center justify-center rounded-xl bg-card/50 backdrop-blur">
          <Package className="size-20 text-primary/30" />
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            'absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-all',
            liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          )}
        >
          <Heart className={cn('size-5', liked && 'fill-current')} />
        </button>
        {produto.precoOverride && (
          <Badge className="absolute left-3 top-3 bg-primary">
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {produto.categoria}
          </Badge>
        </div>
        <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
          {produto.nome}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {produto.descricao}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {produto.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <Button size="sm">
            <ShoppingCart className="mr-1 size-4" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('all')
  const [ordenacao, setOrdenacao] = useState('nome')

  const filteredProdutos = produtos
    .filter((produto) => {
      const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategoria = categoriaFilter === 'all' || produto.categoria === categoriaFilter
      return matchSearch && matchCategoria && produto.ativo
    })
    .sort((a, b) => {
      if (ordenacao === 'preco-asc') return a.precoVenda - b.precoVenda
      if (ordenacao === 'preco-desc') return b.precoVenda - a.precoVenda
      return a.nome.localeCompare(b.nome)
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b bg-gradient-to-br from-accent/50 to-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">Nossos Produtos</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Terços artesanais feitos com dedicação e materiais de qualidade
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filtros */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-36">
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
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="preco-asc">Menor preço</SelectItem>
                <SelectItem value="preco-desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CTA Montador */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary">
                <Sparkles className="size-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  Monte seu próprio terço
                </h3>
                <p className="text-sm text-muted-foreground">
                  Personalize cada detalhe e crie uma peça única
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/loja/montador">
                <Sparkles className="mr-2 size-4" />
                Começar
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Grid de Produtos */}
        {filteredProdutos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProdutos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
            <Package className="size-16 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-xl font-medium">
              Nenhum produto encontrado
            </h3>
            <p className="mt-2 text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('')
                setCategoriaFilter('all')
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
