'use client'

import useSWR from 'swr'
import { Package, Heart, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getOrders } from '@/lib/supabase/orders'
import Link from 'next/link'

export default function ClientDashboard() {
  const { data: orders = [] } = useSWR('user-orders', () => getOrders())

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0),
    activeOrders: orders.filter((o: any) => !['entregue', 'cancelado'].includes(o.status)).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">Minha Conta</h1>
          <Button variant="outline" asChild>
            <Link href="/configuracoes">
              <Settings className="size-4 mr-2" />
              Configurações
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pedidos Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pedidos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">
              <Package className="size-4 mr-2" />
              Meus Pedidos
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="size-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <Card key={order.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">Pedido #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {(order.total || 0).toFixed(2)}</p>
                        <Badge className="mt-1">{order.status || 'Processando'}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhum pedido realizado</p>
                    <Button asChild>
                      <Link href="/loja">Explorar Loja</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="size-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum favorito ainda</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
