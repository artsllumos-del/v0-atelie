'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  customization?: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Terço de Cristal Premium',
      price: 185.90,
      quantity: 1,
      category: 'premium',
      customization: 'Contas azuis com peça central em prata'
    },
    {
      id: '2',
      name: 'Terço Madeira Natural',
      price: 92.50,
      quantity: 2,
      category: 'decorativo'
    }
  ])

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const discount = couponApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 200 ? 0 : 15.00
  const total = subtotal - discount + shipping

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'ATELIE10') {
      setCouponApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Carrinho</h1>
          
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Carrinho Vazio</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não adicionou nenhum produto ao carrinho. Explore nossa loja!
              </p>
              <Link href="/loja">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Voltar para Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Imagem */}
                    <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">💎</span>
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      </div>
                      
                      {item.customization && (
                        <p className="text-xs text-muted-foreground mb-2 italic">
                          {item.customization}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="font-bold text-primary">R$ {item.price.toFixed(2)}</p>
                        
                        {/* Quantidade */}
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                            className="w-12 text-center border-l border-r border-border bg-transparent text-foreground"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-secondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remover */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors self-start"
                    >
                      ✕
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo e Checkout */}
          <div className="space-y-4">
            {/* Cupom */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cupom de Desconto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: ATELIE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-input text-foreground"
                  />
                  <Button
                    onClick={applyCoupon}
                    variant="outline"
                    size="sm"
                    disabled={couponApplied}
                  >
                    {couponApplied ? '✓' : 'Aplicar'}
                  </Button>
                </div>
                {couponApplied && (
                  <Badge className="w-full justify-center bg-success text-success-foreground">
                    Cupom aplicado! 10% de desconto
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Resumo do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between pb-2 border-b border-border text-success">
                    <span>Desconto (10%)</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <Badge className="bg-success text-success-foreground">Grátis</Badge>
                    ) : (
                      `R$ ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-success">✓ Parabéns! Frete grátis acima de R$ 200</p>
                )}

                <div className="pt-2 flex justify-between font-bold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Botão Checkout */}
            <Link href="/checkout" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base">
                Prosseguir para Checkout
              </Button>
            </Link>

            {/* Continuar Comprando */}
            <Link href="/loja">
              <Button variant="outline" className="w-full">
                Continuar Comprando
              </Button>
            </Link>

            {/* Info */}
            <Card className="border-accent bg-accent/20">
              <CardContent className="pt-4 text-xs text-muted-foreground">
                <p className="mb-2">✓ Produtos 100% artesanais</p>
                <p className="mb-2">✓ Entrega em 7-10 dias úteis</p>
                <p>✓ Garantia de satisfação</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
