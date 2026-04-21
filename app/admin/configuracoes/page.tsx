'use client'

import { useState } from 'react'
import {
  Settings,
  Store,
  Palette,
  Bell,
  Shield,
  Database,
  Save,
  Moon,
  Sun,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

function ConfiguracoesGerais() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Store className="size-5" />
            Informações da Loja
          </CardTitle>
          <CardDescription>Dados básicos do seu ateliê</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome-loja">Nome da Loja</Label>
            <Input id="nome-loja" defaultValue="Ateliê Sagrado" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              defaultValue="Terços artesanais feitos com amor, fé e dedicação."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="contato@ateliesagrado.com.br" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" defaultValue="(11) 99999-9999" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" defaultValue="São Paulo, SP" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Database className="size-5" />
            Configurações de Estoque
          </CardTitle>
          <CardDescription>Defina alertas e comportamentos do estoque</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Alertas de estoque baixo</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações quando materiais estiverem baixos
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Bloquear vendas sem estoque</Label>
              <p className="text-sm text-muted-foreground">
                Impedir vendas de produtos com materiais insuficientes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Ajuste automático de conversão</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que o sistema ajuste a relação peso/unidade
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConfiguracoesAparencia() {
  const [tema, setTema] = useState('light')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Palette className="size-5" />
            Aparência
          </CardTitle>
          <CardDescription>Personalize a aparência do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Tema</Label>
            <div className="flex gap-2">
              <Button
                variant={tema === 'light' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setTema('light')}
              >
                <Sun className="mr-2 size-4" />
                Claro
              </Button>
              <Button
                variant={tema === 'dark' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setTema('dark')}
              >
                <Moon className="mr-2 size-4" />
                Escuro
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label>Cor principal</Label>
            <div className="flex gap-2">
              {['#b8860b', '#8b4513', '#2f4f4f', '#4a4a4a', '#8b0000'].map((cor) => (
                <button
                  key={cor}
                  className="size-10 rounded-lg border-2 border-transparent transition-all hover:scale-110 focus:border-foreground"
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Personalização da Loja</CardTitle>
          <CardDescription>Configure a aparência da loja pública</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mostrar montador de terços</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que clientes montem terços personalizados
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Exibir produtos sem estoque</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar produtos indisponíveis com aviso
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConfiguracoesNotificacoes() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Bell className="size-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure quando e como receber alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Novos pedidos</Label>
              <p className="text-sm text-muted-foreground">
                Receber alerta quando um novo pedido for criado
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Estoque crítico</Label>
              <p className="text-sm text-muted-foreground">
                Alerta quando materiais atingirem o mínimo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Prazos de entrega</Label>
              <p className="text-sm text-muted-foreground">
                Lembrete de pedidos com prazo próximo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Margem baixa</Label>
              <p className="text-sm text-muted-foreground">
                Alerta quando margem de lucro estiver abaixo do mínimo
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Canais de Notificação</CardTitle>
          <CardDescription>Escolha onde receber as notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>E-mail</Label>
              <p className="text-sm text-muted-foreground">contato@ateliesagrado.com.br</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações no sistema</Label>
              <p className="text-sm text-muted-foreground">Alertas no painel administrativo</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConfiguracoesSeguranca() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Shield className="size-5" />
            Segurança
          </CardTitle>
          <CardDescription>Gerencie a segurança da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Alterar senha</Label>
            <div className="space-y-2">
              <Input type="password" placeholder="Senha atual" />
              <Input type="password" placeholder="Nova senha" />
              <Input type="password" placeholder="Confirmar nova senha" />
            </div>
            <Button className="mt-2 w-fit">Alterar senha</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Sessões Ativas</CardTitle>
          <CardDescription>Gerencie onde sua conta está conectada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Este dispositivo</p>
              <p className="text-sm text-muted-foreground">São Paulo, Brasil - Chrome</p>
            </div>
            <Badge variant="secondary">Atual</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Backup de Dados</CardTitle>
          <CardDescription>Exporte seus dados para backup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Exportar todos os dados</p>
              <p className="text-sm text-muted-foreground">
                Baixar todos os dados em formato JSON
              </p>
            </div>
            <Button variant="outline">Exportar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <Button>
          <Save className="mr-2 size-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <ConfiguracoesGerais />
        </TabsContent>

        <TabsContent value="aparencia">
          <ConfiguracoesAparencia />
        </TabsContent>

        <TabsContent value="notificacoes">
          <ConfiguracoesNotificacoes />
        </TabsContent>

        <TabsContent value="seguranca">
          <ConfiguracoesSeguranca />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'secondary'; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variant === 'secondary' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'} ${className}`}>
      {children}
    </span>
  )
}
