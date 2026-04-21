'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

interface Material {
  id: string
  name: string
  sku: string
  unit_type: string
  cost_per_unit: number
  current_quantity: number
  minimum_quantity: number
  quantity_in_package: number
  cost_per_package: number
}

export default function EstoqueApp() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [unitFilter, setUnitFilter] = useState('all')
  const supabase = createClient()
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit_type: 'unidades',
    quantity_in_package: '',
    cost_per_package: '',
    minimum_quantity: '',
    current_quantity: '',
    weight_grams: '',
  })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name')

      if (error) throw error
      setMaterials(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar estoque')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const costPerUnit = Number(formData.cost_per_package) / Number(formData.quantity_in_package)
      
      const { error } = await supabase
        .from('materials')
        .insert({
          name: formData.name,
          sku: formData.sku || undefined,
          unit_type: formData.unit_type,
          quantity_in_package: Number(formData.quantity_in_package),
          cost_per_package: Number(formData.cost_per_package),
          cost_per_unit: costPerUnit,
          minimum_quantity: Number(formData.minimum_quantity) || 0,
          current_quantity: Number(formData.current_quantity) || 0,
          weight_grams: formData.weight_grams ? Number(formData.weight_grams) : null,
        })

      if (error) throw error

      toast.success('Material adicionado com sucesso!')
      setFormData({
        name: '',
        sku: '',
        unit_type: 'unidades',
        quantity_in_package: '',
        cost_per_package: '',
        minimum_quantity: '',
        current_quantity: '',
        weight_grams: '',
      })
      setIsOpen(false)
      fetchMaterials()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este material?')) return

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Material deletado')
      fetchMaterials()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (m.sku && m.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchUnit = unitFilter === 'all' || m.unit_type === unitFilter
    return matchSearch && matchUnit
  })

  const stats = {
    total: materials.length,
    lowStock: materials.filter(m => m.minimum_quantity && m.current_quantity < m.minimum_quantity).length,
    totalValue: materials.reduce((sum, m) => sum + (m.current_quantity * m.cost_per_unit), 0),
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground mt-2">Gerencie materiais e controle de quantidade</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Adicionar Material</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Material</DialogTitle>
              <DialogDescription>Cadastre um novo material ao estoque com cálculo automático de custo</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-sm">Conversão de Unidades</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Unidade de Medida *</label>
                    <Select value={formData.unit_type} onValueChange={(value) => setFormData({ ...formData, unit_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gramas">Gramas</SelectItem>
                        <SelectItem value="kilos">Quilos</SelectItem>
                        <SelectItem value="unidades">Unidades</SelectItem>
                        <SelectItem value="metros">Metros</SelectItem>
                        <SelectItem value="centimetros">Centímetros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Peso do Pacote (g)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.weight_grams}
                      onChange={(e) => setFormData({ ...formData, weight_grams: e.target.value })}
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Quantidade por Pacote *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.quantity_in_package}
                    onChange={(e) => setFormData({ ...formData, quantity_in_package: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Custo por Pacote (R$) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost_per_package}
                    onChange={(e) => setFormData({ ...formData, cost_per_package: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Quantidade Atual</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.current_quantity}
                    onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Quantidade Mínima</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.minimum_quantity}
                    onChange={(e) => setFormData({ ...formData, minimum_quantity: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Adicionar Material</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">itens cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">abaixo do mínimo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">custo total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
            <div>
              <CardTitle>Materiais</CardTitle>
              <CardDescription>Lista de todos os materiais cadastrados</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={unitFilter} onValueChange={setUnitFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas unidades</SelectItem>
                  <SelectItem value="gramas">Gramas</SelectItem>
                  <SelectItem value="kilos">Quilos</SelectItem>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="metros">Metros</SelectItem>
                  <SelectItem value="centimetros">Centímetros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || unitFilter !== 'all' ? 'Nenhum resultado encontrado' : 'Nenhum material cadastrado'}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Material</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Custo Unit.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const isLowStock = material.minimum_quantity && material.current_quantity < material.minimum_quantity
                    const percentual = material.minimum_quantity ? (material.current_quantity / material.minimum_quantity) * 100 : 0
                    
                    return (
                      <TableRow key={material.id} className={isLowStock ? 'bg-destructive/5' : ''}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{material.name}</p>
                            {material.sku && <p className="text-xs text-muted-foreground">SKU: {material.sku}</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{material.unit_type}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{material.current_quantity}</p>
                            <Progress value={Math.min(percentual, 100)} className="h-1 w-20" />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{material.minimum_quantity || '-'}</TableCell>
                        <TableCell>R$ {material.cost_per_unit.toFixed(2)}</TableCell>
                        <TableCell>
                          {isLowStock ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              Baixo
                            </Badge>
                          ) : (
                            <Badge variant="outline">OK</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteMaterial(material.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
