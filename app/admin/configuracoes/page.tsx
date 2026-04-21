'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Save } from 'lucide-react'

export default function ConfiguracaesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
          <CardDescription>Dados básicos do negócio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da Empresa</label>
            <input type="text" placeholder="Ateliê Sagrado" className="w-full mt-1 px-3 py-2 border rounded-lg" disabled />
          </div>
          <div>
            <label className="text-sm font-medium">CNPJ/CPF</label>
            <input type="text" placeholder="00.000.000/0000-00" className="w-full mt-1 px-3 py-2 border rounded-lg" disabled />
          </div>
          <Button disabled><Save className="w-4 h-4 mr-2" />Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Gerencie as notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">As notificações estão habilitadas por padrão</p>
        </CardContent>
      </Card>
    </div>
  )
}
