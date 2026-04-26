'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { getQuotes } from '@/lib/supabase/quotes'
import {
  Plus,
  Search,
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  ArrowRight,
  User,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Orcamento, StatusOrcamento } from '@/lib/types'

const statusConfig: Record<StatusOrcamento, { label: string; color: string; icon: typeof Clock }> = {
  rascunho: { label: 'Rascunho', color: 'bg-muted text-muted-foreground', icon: FileText },
  enviado: { label: 'Enviado', color: 'bg-primary/10 text-primary', icon: Send },
  aprovado: { label: 'Aprovado', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  recusado: { label: 'Recusado', color: 'bg-destructive/10 text-destructive', icon: XCircle },
  expirado: { label: 'Expirado', color: 'bg-muted text-muted-foreground', icon: Clock },
}

function OrcamentoRow({ orcamento }: { orcamento: Orcamento }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const status = statusConfig[orcamento.status]
  const StatusIcon = status.icon
  const diasValidade = Math.ceil((orcamento.validadeAte.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setDetailsOpen(true)}>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className={cn('flex size-10 items-center justify-center rounded-lg', status.color)}>
              <StatusIcon className="size-5" />
            </div>
            <div>
              <p className="font-medium">#{orcamento.id.split('-')[1]}</p>
              <p className="text-sm text-muted-foreground">
                {orcamento.criadoEm.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>{orcamento.cliente?.nome}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">{orcamento.itens.length} itens</span>
        </TableCell>
        <TableCell>
          <span className="font-medium">
            {orcamento.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </TableCell>
        <TableCell>
          <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>
        </TableCell>
        <TableCell>
          <span className={cn('text-sm', diasValidade <= 3 && diasValidade > 0 && 'text-warning', diasValidade <= 0 && 'text-destructive')}>
            {diasValidade <= 0 ? 'Expirado' : `${diasValidade} dias`}
          </span>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 size-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 size-4" />
                Duplicar
              </DropdownMenuItem>
              {orcamento.status === 'rascunho' && (
                <DropdownMenuItem>
                  <Send className="mr-2 size-4" />
                  Enviar
                </DropdownMenuItem>
              )}
              {orcamento.status === 'aprovado' && (
                <DropdownMenuItem className="text-success">
                  <ArrowRight className="mr-2 size-4" />
                  Converter em Pedido
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Modal de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Orçamento #{orcamento.id.split('-')[1]}</DialogTitle>
            <DialogDescription>
              Criado em {orcamento.criadoEm.toLocaleDateString('pt-BR')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cliente */}
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <User className="size-4" />
                Cliente
              </div>
              <p className="font-medium">{orcamento.cliente?.nome}</p>
              <p className="text-sm text-muted-foreground">{orcamento.cliente?.email}</p>
            </div>

            {/* Itens */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 text-sm font-medium">Itens do Orçamento</div>
              <div className="space-y-2">
                {orcamento.itens.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{item.descricao}</p>
                      <p className="text-xs text-muted-foreground">{item.quantidade}x</p>
                    </div>
                    <span className="text-sm font-medium">
                      {item.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Valores */}
            <div className="rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{orcamento.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                {orcamento.desconto > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto</span>
                    <span>-{orcamento.desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}
                {orcamento.taxaEntrega > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span>{orcamento.taxaEntrega.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {orcamento.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Validade */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>Válido até {orcamento.validadeAte.toLocaleDateString('pt-BR')}</span>
            </div>

            {orcamento.observacoes && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">{orcamento.observacoes}</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {orcamento.status === 'aprovado' && (
              <Button className="flex-1">
                <ArrowRight className="mr-2 size-4" />
                Converter em Pedido
              </Button>
            )}
            {orcamento.status === 'rascunho' && (
              <>
                <Button variant="outline">
                  <Edit className="mr-2 size-4" />
                  Editar
                </Button>
                <Button>
                  <Send className="mr-2 size-4" />
                  Enviar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OrcamentosCards({ quotes }: { quotes: any[] }) {
  const totalOrcamentos = quotes.length
  const rascunhos = quotes.filter((o) => o.status === 'rascunho' || !o.is_active).length
  const enviados = quotes.filter((o) => o.is_active && o.status !== 'rascunho').length
  const valorTotal = quotes.reduce((acc, o) => acc + (o.total || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          <FileText className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrcamentos}</div>
          <p className="text-xs text-muted-foreground">orçamentos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rascunhos</CardTitle>
          <FileText className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rascunhos}</div>
          <p className="text-xs text-muted-foreground">a enviar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
          <Send className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enviados}</div>
          <p className="text-xs text-muted-foreground">aguardando resposta</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
          <FileText className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">em orçamentos</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrcamentosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { data: quotes = [], isLoading } = useSWR('quotes-admin', getQuotes)

  const filteredOrcamentos = quotes.filter((quote: any) => {
    const matchSearch =
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.client_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground">Crie e gerencie orçamentos para seus clientes</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Novo Orçamento
        </Button>
      </div>

      {/* Cards */}
      <OrcamentosCards quotes={quotes} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Lista de Orçamentos</CardTitle>
              <CardDescription>Todos os orçamentos criados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="w-full pl-9 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {Object.entries(statusConfig).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrcamentos.length > 0 ? (
                  filteredOrcamentos.map((orcamento) => (
                    <OrcamentoRow key={orcamento.id} orcamento={orcamento} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum orçamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
