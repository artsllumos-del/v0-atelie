'use client'

import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

const mockCartItems = [
  { id: 1, name: 'Terço Azul Clássico', price: 89.90, quantity: 1, image: '🙏' },
  { id: 2, name: 'Terço Rosa Quartzo', price: 129.90, quantity: 1, image: '🙏' },
]

export default function CarrinhePage() {
  const [items, setItems] = useState(mockCartItems)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 12.00
  const total = subtotal + shipping

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleQuantity = (id: number, quantity: number) => {
    if (quantity > 0) {
      setItems(items.map(item => item.id === id ? { ...item, quantity } : item))
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="mx-auto size-16 text-muted-foreground mb-4" />
            <h1 className="font-serif text-2xl font-bold mb-2">Carrinho vazio</h1>
            <p className="text-muted-foreground mb-6">Que tal explorar nossa coleção?</p>
            <Button asChild><Link href="/loja">Voltar para loja</Link></Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/loja"><ArrowLeft className="size-4" /></Link>
          </Button>
          <h1 className="font-serif text-2xl font-bold">Carrinho de Compras</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded">
                      <Minus className="size-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="font-bold w-24 text-right">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>R$ {shipping.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/checkout">Prosseguir para Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/loja">Continuar Comprando</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
