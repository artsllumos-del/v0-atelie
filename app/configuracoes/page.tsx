'use client'

import { Mail, Bell, Lock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/minha-conta">← Voltar</Link>
          </Button>
        </div>

        <h1 className="font-serif text-3xl font-bold mb-8">Configurações</h1>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input placeholder="Seu nome" defaultValue="João Silva" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="seu@email.com" defaultValue="joao@example.com" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input type="tel" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Input type="date" />
                  </div>
                </div>
                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif">Endereço de Entrega</CardTitle>
                <CardDescription>Gerencie seus endereços</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Endereço Principal</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Rua Exemplo, 123 - Apto 456<br />
                    São Paulo, SP - 01000-000
                  </p>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <Button variant="outline" className="w-full">Adicionar Novo Endereço</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Preferências de Notificação</CardTitle>
                <CardDescription>Escolha como deseja ser notificado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="size-5" />
                      <div>
                        <p className="font-medium">Status do Pedido</p>
                        <p className="text-sm text-muted-foreground">Receba atualizações de seus pedidos</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="size-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="size-5" />
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-muted-foreground">Promoções e novidades</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="size-4" />
                  </div>
                </div>
                <Button>Salvar Preferências</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Segurança da Conta</CardTitle>
                <CardDescription>Gerenciar senha e segurança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Senha Atual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label>Nova Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label>Confirmar Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>Alterar Senha</Button>
              </CardContent>
            </Card>

            <Card className="mt-6 border-destructive">
              <CardHeader>
                <CardTitle className="font-serif text-destructive">Zona de Perigo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" className="w-full">
                  <LogOut className="size-4 mr-2" />
                  Sair de Todas as Sessões
                </Button>
                <Button variant="outline" className="w-full">
                  Deletar Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
