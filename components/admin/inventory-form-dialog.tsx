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
  category: z.string().min(1, 'Categoria é obrigatória'),
  quantity: z.coerce.number().min(0),
  minimum_quantity: z.coerce.number().min(1),
  unit_cost: z.coerce.number().min(0),
  unit: z.string().min(1, 'Unidade é obrigatória'),
})

type InventoryFormValues = z.infer<typeof inventoryFormSchema>

const categories = [
  'crucifixo',
  'entremeio',
  'conta_menor',
  'conta_maior',
  'fecho',
  'pingente',
  'corrente',
  'embalagem',
  'outros',
]

const units = ['un', 'kg', 'metro', 'dúzia', 'pacote', 'caixa']

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
      category: item.category,
      quantity: item.quantity,
      minimum_quantity: item.minimum_quantity,
      unit_cost: item.unit_cost,
      unit: item.unit,
    } : {
      name: '',
      category: 'outros',
      quantity: 0,
      minimum_quantity: 10,
      unit_cost: 0,
      unit: 'un',
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta de cristal azul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                    <FormLabel>Mínimo*</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
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
                    <FormLabel>Custo Unit. (R$)*</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="un" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((u) => (
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
