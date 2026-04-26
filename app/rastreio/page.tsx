'use client'

import { Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const mockOrder = {
  id: 'PED-001',
  status: 'em_transito',
  date: new Date('2024-04-20'),
  estimatedDelivery: new Date('2024-04-28'),
  items: [
    { name: 'Terço Azul Clássico', quantity: 1, price: 89.90 },
  ],
  total: 101.90,
  tracking: '1234567890123',
  timeline: [
    { status: 'Pedido Confirmado', date: new Date('2024-04-20'), completed: true },
    { status: 'Preparado para Envio', date: new Date('2024-04-21'), completed: true },
    { status: 'Em Trânsito', date: new Date('2024-04-23'), completed: true },
    { status: 'Entrega Prevista', date: new Date('2024-04-28'), completed: false },
  ],
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/minha-conta">← Voltar para Conta</Link>
          </Button>
        </div>

        <h1 className="font-serif text-3xl font-bold mb-2">Rastrear Pedido</h1>
        <p className="text-muted-foreground mb-8">Pedido #{mockOrder.id}</p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Status do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Em Trânsito</p>
                    <p className="text-sm text-muted-foreground">
                      Estimativa: {mockOrder.estimatedDelivery.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrder.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-10 items-center justify-center rounded-full ${
                            item.completed ? 'bg-success/10' : 'bg-muted'
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle className="size-5 text-success" />
                          ) : (
                            <Clock className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        {index < mockOrder.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${item.completed ? 'bg-success/30' : 'bg-muted'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold">{item.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">R$ {item.price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between pt-4 font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {mockOrder.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Código de Rastreio</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-3 rounded block font-mono break-all">
                  {mockOrder.tracking}
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Contatar Suporte
                </Button>
                <Button variant="outline" className="w-full">
                  Relatar Problema
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
