'use client'

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ShoppingCart, Heart, Share2, Truck, Shield, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getProductById } from '@/lib/supabase/products'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'

function addToLocalCart(productId: string, quantity: number = 1) {
  const stored = localStorage.getItem('atelie-cart')
  let cart = []
  try {
    cart = stored ? JSON.parse(stored) : []
  } catch (e) {
    cart = []
  }
  
  const existing = cart.find((item: any) => item.productId === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  
  localStorage.setItem('atelie-cart', JSON.stringify(cart))
}

export default function ProdutoPage() {
  const params = useParams()
  const router = useRouter()
  const { data: product, isLoading } = useSWR(`product-${params.id}`, () => getProductById(params.id as string))
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (!product) return
    setIsAdding(true)
    try {
      addToLocalCart(product.id, quantity)
      toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`, {
        action: {
          label: 'Ver Carrinho',
          onClick: () => router.push('/loja/carrinho'),
        },
      })
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho')
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Package className="size-16 text-muted-foreground" />
        <h1 className="font-serif text-2xl font-bold">Produto não encontrado</h1>
        <Button asChild>
          <Link href="/loja/produtos">Ver todos os produtos</Link>
        </Button>
      </div>
    )
  }

  const price = product.sale_price || product.base_price || 0
  const hasDiscount = product.sale_price && product.sale_price < product.base_price

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/loja/produtos">← Voltar para Produtos</Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagem */}
          <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Package className="size-32 text-primary/40" />
            )}
          </div>

          {/* Detalhes */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
              )}
              <h1 className="font-serif text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  R$ {price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    R$ {product.base_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Quantidade */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={isAdding || !product.is_active}
              >
                {isAdding ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 size-4" />
                )}
                {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => toast.info('Favoritos em breve!')}>
                <Heart className="size-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('Link copiado!')
              }}>
                <Share2 className="size-4" />
              </Button>
            </div>

            {/* Status */}
            {!product.is_active && (
              <Badge variant="destructive" className="w-full justify-center py-2">
                Produto indisponível no momento
              </Badge>
            )}

            {/* Informações */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-muted-foreground" />
                <span>Frete grátis acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="size-4 text-muted-foreground" />
                <span>Compra segura com proteção total</span>
              </div>
              {product.production_time_minutes && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-muted-foreground" />
                  <span>Tempo de produção: ~{Math.ceil(product.production_time_minutes / 60)}h</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
