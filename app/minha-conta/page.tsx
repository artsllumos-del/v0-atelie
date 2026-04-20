'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface CustomerOrder {
  id: string
  date: string
  total: number
  status: 'pendente' | 'pagado' | 'enviado' | 'entregue'
  items: number
}

interface CustomizedRosary {
  id: string
  name: string
  createdAt: string
  price: number
  status: 'carrinho' | 'encomenda' | 'pronto'
}

export default function AccountPage() {
  const [orders] = useState<CustomerOrder[]>([
    {
      id: 'PED-001',
      date: '2024-04-10',
      total: 185.90,
      status: 'entregue',
      items: 2
    },
    {
      id: 'PED-002',
      date: '2024-04-05',
      total: 92.50,
      status: 'enviado',
      items: 1
    },
    {
      id: 'PED-003',
      date: '2024-03-28',
      total: 247.30,
      status: 'pagado',
      items: 3
    }
  ])

  const [customRosaries] = useState<CustomizedRosary[]>([
    {
      id: 'CUSTOM-001',
      name: 'Terço de Nossa Senhora Azul',
      createdAt: '2024-04-12',
      price: 125.00,
      status: 'encomenda'
    },
    {
      id: 'CUSTOM-002',
      name: 'Terço Família - Cristal Dourado',
      createdAt: '2024-04-01',
      price: 185.50,
      status: 'pronto'
    }
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'entregue':
      case 'pronto':
        return 'bg-success text-success-foreground'
      case 'enviado':
      case 'encomenda':
        return 'bg-warning text-warning-foreground'
      case 'pagado':
        return 'bg-primary text-primary-foreground'
      case 'pendente':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-border text-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'entregue': return 'Entregue'
      case 'enviado': return 'Enviado'
      case 'pagado': return 'Pagado'
      case 'pendente': return 'Pendente'
      case 'encomenda': return 'Em Encomenda'
      case 'pronto': return 'Pronto'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos, personalizações e preferências</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pedidos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="personalizacoes">Personalizações</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          {/* Pedidos */}
          <TabsContent value="pedidos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
                <CardDescription>Acompanhe todos os seus pedidos e seu status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-foreground">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items} item{order.items > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalizações */}
          <TabsContent value="personalizacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Terços Personalizados</CardTitle>
                <CardDescription>Terços que você criou usando o montador</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {customRosaries.map(rosary => (
                    <div key={rosary.id} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{rosary.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Criado em {new Date(rosary.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(rosary.status)}>
                          {getStatusLabel(rosary.status)}
                        </Badge>
                      </div>
                      <div className="text-2xl mb-4 text-center py-4 bg-secondary rounded">
                        ✨
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">R$ {rosary.price.toFixed(2)}</p>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          {rosary.status === 'carrinho' ? 'Finalizar' : 'Editar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Criar Novo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Crie um novo terço personalizado usando nosso montador
                </p>
                <Link href="/loja/montador">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                    ✨ Começar Novo Terço
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="perfil" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="text-lg font-medium text-foreground">Maria Silva Santos</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-lg font-medium text-foreground">maria@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="text-lg font-medium text-foreground">(11) 98765-4321</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membro desde</p>
                      <p className="text-lg font-medium text-foreground">Janeiro de 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Editar Perfil</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço Principal</p>
                    <p className="text-foreground font-medium">
                      Rua das Flores, 123<br/>
                      Apto 456, Centro<br/>
                      São Paulo, SP 01310-100
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">Gerenciar Endereços</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    <span className="text-foreground">Receber notificações de pedidos por email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    <span className="text-foreground">Receber promoções e ofertas especiais</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="text-foreground">Receber newsletter mensal</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Excluir sua conta é uma ação permanente e não pode ser desfeita.
                </p>
                <Button variant="destructive">Excluir Minha Conta</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
