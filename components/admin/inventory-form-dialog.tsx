// Formulário para gerenciar estoque
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { toast } from 'sonner'
import { createInventoryItem, updateInventoryItem } from '@/lib/supabase/inventory'

const inventoryFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  supplier: z.string().min(1, 'Fornecedor é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  unit_type: z.string().min(1, 'Tipo de unidade é obrigatório'),
  current_quantity: z.coerce.number().min(0, 'Quantidade deve ser >= 0'),
  minimum_quantity: z.coerce.number().min(1, 'Mínimo deve ser >= 1'),
  unit_cost: z.coerce.number().min(0, 'Custo deve ser >= 0'),
  weight_per_unit: z.coerce.number().min(0, 'Peso deve ser >= 0').optional(),
  calculation_method: z.enum(['fixed', 'weight'], { errorMap: () => ({ message: 'Método inválido' }) }),
  status: z.enum(['active', 'inactive'], { errorMap: () => ({ message: 'Status inválido' }) }),
  notes: z.string().optional(),
})

type InventoryFormValues = z.infer<typeof inventoryFormSchema>

const categories = [
  'contas',
  'entremeio',
  'corrente',
  'crucifixo',
  'fecho',
  'pingente',
  'embalagem',
  'outros',
]

const unitTypes = ['unidade', 'kg', 'metro', 'dúzia', 'pacote', 'caixa']

const calculationMethods = [
  { value: 'fixed', label: 'Preço Fixo' },
  { value: 'weight', label: 'Cálculo por Peso' },
]

interface InventoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: any
  onSuccess: () => void
}

export function InventoryFormDialog({ open, onOpenChange, item, onSuccess }: InventoryFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!item

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: item ? {
      name: item.name,
      description: item.description || '',
      supplier: item.supplier,
      category: item.category,
      unit_type: item.unit_type,
      current_quantity: item.current_quantity,
      minimum_quantity: item.minimum_quantity,
      unit_cost: item.unit_cost,
      weight_per_unit: item.weight_per_unit || 0,
      calculation_method: item.calculation_method || 'fixed',
      status: item.status || 'active',
      notes: item.notes || '',
    } : {
      name: '',
      description: '',
      supplier: '',
      category: 'contas',
      unit_type: 'unidade',
      current_quantity: 0,
      minimum_quantity: 10,
      unit_cost: 0,
      weight_per_unit: 0,
      calculation_method: 'fixed',
      status: 'active',
      notes: '',
    },
  })

  async function onSubmit(values: InventoryFormValues) {
    try {
      setIsLoading(true)
      
      if (isEditing) {
        await updateInventoryItem(item.id, values)
        toast.success('Item atualizado com sucesso')
      } else {
        await createInventoryItem(values as any)
        toast.success('Item criado com sucesso')
      }
      
      onOpenChange(false)
      onSuccess()
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Item' : 'Novo Item de Estoque'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do item' : 'Adicione um novo item ao estoque'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta de cristal azul" {...field} disabled={isLoading} />
                  </FormControl>
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
                    <Input placeholder="Detalhes do item" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Fornecedor A" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
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
                    <FormLabel>Tipo Unidade*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitTypes.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Atual*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} disabled={isLoading} />
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
                    <FormLabel>Quantidade Mínima*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Unitário (R$)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} disabled={isLoading} />
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
                      <Input type="number" step="0.001" placeholder="0" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>Para cálculo por peso</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="calculation_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Cálculo*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {calculationMethods.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Como calcular o preço deste item</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
