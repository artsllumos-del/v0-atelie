'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CurrencyInput } from '@/components/ui/currency-input'
import { toast } from 'sonner'
import { formatCurrency, calcUnitCostFromPackage } from '@/lib/currency'
import { createInventoryItem, updateInventoryItem, type InventoryItem } from '@/lib/supabase/inventory'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  supplier: z.string().min(1, 'Fornecedor é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  unit_type: z.string().min(1, 'Tipo de unidade é obrigatório'),
  current_quantity: z.coerce.number().min(0),
  minimum_quantity: z.coerce.number().min(0),
  unit_cost: z.coerce.number().min(0),
  package_quantity: z.coerce.number().min(0.001).default(1),
  package_cost: z.coerce.number().min(0).default(0),
  freight_cost: z.coerce.number().min(0).default(0),
  weight_per_unit: z.coerce.number().min(0).optional().default(0),
  calculation_method: z.enum(['fixed', 'package', 'weight']),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional().default(''),
})

type FormValues = z.infer<typeof schema>

const categories = [
  { value: 'contas', label: 'Contas' },
  { value: 'entremeio', label: 'Entremeio' },
  { value: 'corrente', label: 'Corrente' },
  { value: 'crucifixo', label: 'Crucifixo' },
  { value: 'fecho', label: 'Fecho' },
  { value: 'pingente', label: 'Pingente' },
  { value: 'embalagem', label: 'Embalagem' },
  { value: 'fio', label: 'Fio' },
  { value: 'outros', label: 'Outros' },
]

const unitTypes = [
  { value: 'unidade', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'grama', label: 'Grama (g)' },
  { value: 'metro', label: 'Metro (m)' },
  { value: 'dúzia', label: 'Dúzia' },
  { value: 'pacote', label: 'Pacote' },
  { value: 'caixa', label: 'Caixa' },
]

const calcMethods = [
  { value: 'fixed', label: 'Preço Fixo (informar manualmente)' },
  { value: 'package', label: 'Por Pacote (calcula automaticamente)' },
  { value: 'weight', label: 'Por Peso' },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem | null
  onSuccess: () => void
}

export function InventoryFormDialog({ open, onOpenChange, item, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!item

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      supplier: '',
      category: 'contas',
      unit_type: 'unidade',
      current_quantity: 0,
      minimum_quantity: 10,
      unit_cost: 0,
      package_quantity: 1,
      package_cost: 0,
      freight_cost: 0,
      weight_per_unit: 0,
      calculation_method: 'fixed',
      status: 'active',
      notes: '',
    },
  })

  const method = useWatch({ control: form.control, name: 'calculation_method' })
  const packageCost = useWatch({ control: form.control, name: 'package_cost' })
  const freightCost = useWatch({ control: form.control, name: 'freight_cost' })
  const packageQty = useWatch({ control: form.control, name: 'package_quantity' })

  // Calcula custo unitário ao vivo quando método for 'package'
  const calculatedUnitCost =
    method === 'package'
      ? calcUnitCostFromPackage(
          Number(packageCost) || 0,
          Number(freightCost) || 0,
          Number(packageQty) || 1
        )
      : null

  // Preenche form ao editar
  useEffect(() => {
    if (open && item) {
      form.reset({
        name: item.name || '',
        description: item.description || '',
        supplier: item.supplier || '',
        category: item.category || 'contas',
        unit_type: item.unit_type || 'unidade',
        current_quantity: item.current_quantity || 0,
        minimum_quantity: item.minimum_quantity || 10,
        unit_cost: item.unit_cost || 0,
        package_quantity: item.package_quantity || 1,
        package_cost: item.package_cost || 0,
        freight_cost: item.freight_cost || 0,
        weight_per_unit: item.weight_per_unit || 0,
        calculation_method: (item.calculation_method as 'fixed' | 'package' | 'weight') || 'fixed',
        status: (item.status as 'active' | 'inactive') || 'active',
        notes: item.notes || '',
      })
    } else if (open && !item) {
      form.reset({
        name: '',
        description: '',
        supplier: '',
        category: 'contas',
        unit_type: 'unidade',
        current_quantity: 0,
        minimum_quantity: 10,
        unit_cost: 0,
        package_quantity: 1,
        package_cost: 0,
        freight_cost: 0,
        weight_per_unit: 0,
        calculation_method: 'fixed',
        status: 'active',
        notes: '',
      })
    }
  }, [open, item, form])

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      // Se método for pacote, calcula o unit_cost
      const payload = {
        ...values,
        unit_cost:
          values.calculation_method === 'package'
            ? calcUnitCostFromPackage(values.package_cost, values.freight_cost, values.package_quantity)
            : values.unit_cost,
      }

      if (isEditing && item?.id) {
        await updateInventoryItem(item.id, payload)
        toast.success('Item atualizado com sucesso!')
      } else {
        await createInventoryItem(payload)
        toast.success('Item adicionado ao estoque!')
      }

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isEditing ? 'Editar Item' : 'Novo Item de Estoque'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do material' : 'Adicione um novo material ao estoque'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
          >
            {/* Identificação */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Material *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta de cristal azul 8mm" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitTypes.map((u) => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do fornecedor" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Estoque */}
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estoque
            </p>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="current_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd Atual</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="any" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimum_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd Mínima</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="any" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Custo */}
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Custo
            </p>

            <FormField
              control={form.control}
              name="calculation_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Cálculo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {calcMethods.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Método: Preço Fixo */}
            {method === 'fixed' && (
              <FormField
                control={form.control}
                name="unit_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Unitário (R$) *</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        placeholder="0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Método: Por Pacote */}
            {method === 'package' && (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">
                  Informe o custo do pacote e a quantidade — o custo unitário será calculado automaticamente.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="package_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qtd no Pacote *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            step="any"
                            placeholder="Ex: 200"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>unidades no pacote</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="package_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custo do Pacote (R$) *</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                            placeholder="0,00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="freight_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frete (R$)</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          onValueChange={(num) => form.setValue('freight_cost', num)}
                          disabled={isLoading}
                          placeholder="0,00"
                        />
                      </FormControl>
                      <FormDescription>Rateado neste material</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preview do cálculo */}
                {calculatedUnitCost !== null && (
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-1">
                    <p className="text-xs font-medium text-primary">Custo calculado automaticamente</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        ({formatCurrency(Number(packageCost))} + {formatCurrency(Number(freightCost))}) ÷ {Number(packageQty)} unid.
                      </span>
                      <span className="font-bold text-primary text-base">
                        = {formatCurrency(calculatedUnitCost)} / un.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Método: Por Peso */}
            {method === 'weight' && (
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="unit_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo por kg (R$) *</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          onValueChange={(num) => form.setValue('unit_cost', num)}
                          disabled={isLoading}
                          placeholder="0,00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight_per_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso por Unidade (g)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min={0} placeholder="0.000" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Separator />

            {/* Status e notas */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Detalhes opcionais" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input placeholder="Notas adicionais" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar Item' : 'Adicionar ao Estoque'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
