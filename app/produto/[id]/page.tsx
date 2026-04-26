'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { ShoppingCart, Heart, Share2, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getProductById } from '@/lib/supabase/products'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'

export default function ProdutoPage() {
  const params = useParams()
  const { data: product, isLoading } = useSWR(`product-${params.id}`, () => getProductById(params.id as string))
  const [quantity, setQuantity] = useState(1)

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produto não encontrado</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/loja">← Voltar para Loja</Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagem */}
          <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-9xl">
            🙏
          </div>

          {/* Detalhes */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">R$ {(product.base_price || 0).toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            {/* Quantidade */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 rounded border hover:bg-muted">−</button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 rounded border hover:bg-muted">+</button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button className="flex-1" size="lg" onClick={() => toast.success('Adicionado ao carrinho!')}>
                <ShoppingCart className="mr-2 size-4" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="size-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="size-4" />
              </Button>
            </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
