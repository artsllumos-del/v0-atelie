'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCollaborators } from '@/lib/supabase/collaborators'
import { cn } from '@/lib/utils'

const roleConfig = {
  admin: { label: 'Administrador', color: 'bg-destructive/10 text-destructive' },
  manager: { label: 'Gerenciador', color: 'bg-primary/10 text-primary' },
  artisan: { label: 'Artesão', color: 'bg-success/10 text-success' },
  production: { label: 'Produção', color: 'bg-warning/10 text-warning' },
  packaging: { label: 'Embalagem', color: 'bg-info/10 text-info' },
}

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-success/10 text-success' },
  inactive: { label: 'Inativo', color: 'bg-muted text-muted-foreground' },
  vacation: { label: 'Férias', color: 'bg-warning/10 text-warning' },
}

export default function CollaboratorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const { data: collaborators = [] } = useSWR('collaborators-admin', getCollaborators)

  const filteredCollaborators = collaborators.filter((collab: any) => {
    const matchSearch = (collab.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = roleFilter === 'all' || collab.role === roleFilter
    const matchDept = departmentFilter === 'all' || collab.department === departmentFilter
    return matchSearch && matchRole && matchDept
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground">Gerencie a equipe da ateliê</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Novo Colaborador
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.filter((c: any) => c.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(collaborators.map((c: any) => c.department)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(roleConfig).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Colaboradores</CardTitle>
          <CardDescription>Lista completa da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCollaborators.map((collab: any) => (
              <div key={collab.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition">
                <div className="flex-1">
                  <h3 className="font-medium">{collab.name}</h3>
                  <p className="text-sm text-muted-foreground">{collab.email}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge className={cn('text-xs', roleConfig[collab.role as keyof typeof roleConfig]?.color)}>
                      {roleConfig[collab.role as keyof typeof roleConfig]?.label}
                    </Badge>
                    <Badge className={cn('text-xs', statusConfig[collab.status as keyof typeof statusConfig]?.color)}>
                      {statusConfig[collab.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-right mr-4">
                  <p>{collab.department}</p>
                  <p className="text-xs">Desde {new Date(collab.hired_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 size-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
