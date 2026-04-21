'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CarrinhoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Carrinho de Compras</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <Link href="/loja/montador">
                  <Button>Monte um Terço Agora</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>R$ 0,00</span>
                </div>
              </div>
              <Button disabled className="w-full">
                Ir para Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
