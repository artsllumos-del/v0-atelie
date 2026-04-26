'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { Search, Package, ShoppingCart, Heart, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getProducts } from '@/lib/supabase/products'
import { toast } from 'sonner'

function ProductCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex items-center justify-center">
        <span className="text-6xl">🙏</span>
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            'absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-all',
            liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          )}
        >
          <Heart className={cn('size-5', liked && 'fill-current')} />
        </button>
      </div>
      <CardContent className="p-5">
        <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            R$ {(product.base_price || 0).toFixed(2)}
          </span>
          <Button size="sm" onClick={() => toast.success('Adicionado ao carrinho!')}>
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: products = [], isLoading } = useSWR('products-page', getProducts)

  const filteredProducts = products
    .filter((p: any) => p.is_active && p.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
            <Package className="size-16 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-xl font-medium">
              Nenhum produto encontrado
            </h3>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
