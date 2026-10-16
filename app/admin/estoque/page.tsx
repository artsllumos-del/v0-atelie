'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  History,
  Scale,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { materiais as materiaisIniciais } from '@/lib/mock-data'
import type { CategoriaMaterial, Material } from '@/lib/types'

const categorias: { value: CategoriaMaterial; label: string }[] = [
  { value: 'contas', label: 'Contas' },
  { value: 'crucifixos', label: 'Crucifixos' },
  { value: 'entremeios', label: 'Entremeios' },
  { value: 'fios', label: 'Fios' },
  { value: 'acabamentos', label: 'Acabamentos' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'outros', label: 'Outros' },
]

const unidadesCompra = [
  { value: 'gramas', label: 'Gramas' },
  { value: 'pacote', label: 'Pacote' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'metros', label: 'Metros' },
]

function getStatusEstoque(material: Material) {
  const percentual = (material.quantidadeDisponivel / material.estoqueMinimo) * 100

  if (percentual < 100) {
    return { status: 'critico', label: 'Crítico', color: 'bg-destructive text-destructive-foreground' }
  }
  if (percentual < 150) {
    return { status: 'baixo', label: 'Baixo', color: 'bg-warning text-warning-foreground' }
  }
  return { status: 'ok', label: 'OK', color: 'bg-success text-success-foreground' }
}

function MaterialRow({ material }: { material: Material }) {
  const statusEstoque = getStatusEstoque(material)
  const percentualEstoque = Math.min((material.quantidadeDisponivel / material.estoqueMinimo) * 100, 100)

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{material.nome}</p>
            <p className="text-sm text-muted-foreground">{material.categoria}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>{material.unidadeCompra}</p>
          {material.pesoCompra && (
            <p className="text-muted-foreground">{material.pesoCompra}g</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>{material.unidadeUso}</p>
          {material.relacaoConversao && (
            <p className="text-muted-foreground">
              {material.relacaoConversao.toFixed(2)} un/g
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Progress value={percentualEstoque} className="h-2" />
          </div>
          <span className="text-sm font-medium">
            {material.quantidadeDisponivel}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{material.estoqueMinimo}</span>
      </TableCell>
      <TableCell>
        <Badge className={cn('text-xs', statusEstoque.color)}>
          {statusEstoque.label}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-medium">
          {material.custoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 size-4" />
              Adicionar Entrada
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 size-4" />
              Ver Histórico
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

function AddMaterialDialog({ onSave }: { onSave: (material: Material) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nome: '', categoria: 'contas' as CategoriaMaterial, fornecedor: '', unidadeCompra: 'pacote' as Material['unidadeCompra'],
    pesoCompra: '', quantidadeEstimada: '', precoCompra: '', estoqueMinimo: '', quantidadeDisponivel: '',
  })
  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const reset = () => setForm({ nome: '', categoria: 'contas', fornecedor: '', unidadeCompra: 'pacote', pesoCompra: '', quantidadeEstimada: '', precoCompra: '', estoqueMinimo: '', quantidadeDisponivel: '' })
  const estimated = Number(form.quantidadeEstimada) || 0
  const purchasePrice = Number(form.precoCompra) || 0
  const unitCost = estimated > 0 ? purchasePrice / estimated : purchasePrice

  const save = () => {
    if (!form.nome.trim() || purchasePrice <= 0 || Number(form.estoqueMinimo) < 0) return
    const now = new Date()
    const material: Material = {
      id: `mat-${Date.now()}`, nome: form.nome.trim(), categoria: form.categoria, unidadeCompra: form.unidadeCompra, unidadeUso: 'unidade',
      fornecedor: form.fornecedor.trim() || undefined, pesoCompra: Number(form.pesoCompra) || undefined, quantidadeEstimada: estimated || undefined,
      relacaoConversao: estimated && Number(form.pesoCompra) ? estimated / Number(form.pesoCompra) : undefined,
      quantidadeDisponivel: Number(form.quantidadeDisponivel) || estimated, estoqueMinimo: Number(form.estoqueMinimo) || 0,
      precoCompra: purchasePrice, custoUnitario: unitCost, criadoEm: now, atualizadoEm: now,
    }
    onSave(material); reset(); setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="mr-2 size-4" />Adicionar Material</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">Adicionar Material</DialogTitle><DialogDescription>Cadastre o lote comprado e veja o custo por unidade automaticamente.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2"><Label htmlFor="material-nome">Nome do Material</Label><Input id="material-nome" value={form.nome} onChange={(e) => setField('nome', e.target.value)} placeholder="Ex: Contas de Cristal 6mm" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label>Categoria</Label><Select value={form.categoria} onValueChange={(value) => setField('categoria', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categorias.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="material-fornecedor">Fornecedor</Label><Input id="material-fornecedor" value={form.fornecedor} onChange={(e) => setField('fornecedor', e.target.value)} placeholder="Nome do fornecedor" /></div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4"><div className="mb-3 flex items-center gap-2"><Scale className="size-4 text-primary" /><span className="text-sm font-medium">Conversão de Unidades</span></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label>Unidade de Compra</Label><Select value={form.unidadeCompra} onValueChange={(value) => setField('unidadeCompra', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{unidadesCompra.map((unit) => <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-2"><Label htmlFor="material-peso">Peso do Pacote (g)</Label><Input id="material-peso" type="number" min="0" value={form.pesoCompra} onChange={(e) => setField('pesoCompra', e.target.value)} /></div></div>
            <div className="mt-4 grid gap-2"><Label htmlFor="material-quantidade">Quantidade no Pacote</Label><Input id="material-quantidade" type="number" min="0" value={form.quantidadeEstimada} onChange={(e) => setField('quantidadeEstimada', e.target.value)} placeholder="Ex: 200" /><p className="text-xs text-muted-foreground">Exemplo: pacote com 200 bolinhas divide o custo total por 200.</p></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><div className="grid gap-2 sm:col-span-1"><Label htmlFor="material-preco">Custo total (R$)</Label><Input id="material-preco" type="number" min="0" step="0.01" value={form.precoCompra} onChange={(e) => setField('precoCompra', e.target.value)} placeholder="11,00" /></div><div className="grid gap-2"><Label htmlFor="material-estoque">Estoque mínimo</Label><Input id="material-estoque" type="number" min="0" value={form.estoqueMinimo} onChange={(e) => setField('estoqueMinimo', e.target.value)} /></div><div className="grid gap-2"><Label htmlFor="material-disponivel">Saldo inicial</Label><Input id="material-disponivel" type="number" min="0" value={form.quantidadeDisponivel} onChange={(e) => setField('quantidadeDisponivel', e.target.value)} /></div></div>
          <div className="rounded-lg bg-primary/10 p-3 text-sm">Custo unitário calculado: <strong>{unitCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save} disabled={!form.nome.trim() || purchasePrice <= 0}>Salvar Material</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EstoqueCards({ materiais }: { materiais: Material[] }) {
  const totalMateriais = materiais.length
  const materiaisCriticos = materiais.filter((m) => m.quantidadeDisponivel < m.estoqueMinimo).length
  const materiaisBaixos = materiais.filter(
    (m) => m.quantidadeDisponivel >= m.estoqueMinimo && m.quantidadeDisponivel < m.estoqueMinimo * 1.5
  ).length
  const valorTotalEstoque = materiais.reduce((acc, m) => acc + m.quantidadeDisponivel * m.custoUnitario, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Materiais</CardTitle>
          <Package className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMateriais}</div>
          <p className="text-xs text-muted-foreground">itens cadastrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Crítico</CardTitle>
          <AlertTriangle className="size-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{materiaisCriticos}</div>
          <p className="text-xs text-muted-foreground">abaixo do mínimo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
          <AlertTriangle className="size-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{materiaisBaixos}</div>
          <p className="text-xs text-muted-foreground">próximo do mínimo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
          <Package className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {valorTotalEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          <p className="text-xs text-muted-foreground">custo total</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EstoquePage() {
  const [materiais, setMateriais] = useState<Material[]>(materiaisIniciais)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const saved = window.localStorage.getItem('as_inventory')
    if (saved) {
      try { setMateriais(JSON.parse(saved).map((item: Material) => ({ ...item, criadoEm: new Date(item.criadoEm), atualizadoEm: new Date(item.atualizadoEm) }))) } catch { window.localStorage.removeItem('as_inventory') }
    }
  }, [])

  const saveMateriais = (next: Material[]) => { setMateriais(next); window.localStorage.setItem('as_inventory', JSON.stringify(next)) }
  const filteredMateriais = materiais.filter((material) => {
    const matchSearch = material.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = categoriaFilter === 'all' || material.categoria === categoriaFilter
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'critico' && material.quantidadeDisponivel < material.estoqueMinimo) ||
      (statusFilter === 'baixo' &&
        material.quantidadeDisponivel >= material.estoqueMinimo &&
        material.quantidadeDisponivel < material.estoqueMinimo * 1.5) ||
      (statusFilter === 'ok' && material.quantidadeDisponivel >= material.estoqueMinimo * 1.5)

    return matchSearch && matchCategoria && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Gerencie seus materiais e controle o estoque</p>
        </div>
        <AddMaterialDialog onSave={(material) => saveMateriais([...materiais, material])} />
      </div>

      {/* Cards */}
      <EstoqueCards materiais={materiais} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-serif">Materiais</CardTitle>
              <CardDescription>Lista completa de materiais cadastrados</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar material..."
                  className="w-full pl-9 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
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
                  <TableHead className="w-[300px]">Material</TableHead>
                  <TableHead>Un. Compra</TableHead>
                  <TableHead>Un. Uso</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Custo Un.</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMateriais.length > 0 ? (
                  filteredMateriais.map((material) => (
                    <MaterialRow key={material.id} material={material} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum material encontrado.
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
