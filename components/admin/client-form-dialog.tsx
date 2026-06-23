'use client'

import { useState, useEffect } from 'react'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createNewClient, updateClient, type Customer } from '@/lib/supabase/clients'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido').or(z.literal('')).optional().default(''),
  phone: z.string().optional().default(''),
  cpf_cnpj: z.string().optional().default(''),
  type: z.enum(['pessoa_fisica', 'pessoa_juridica']).default('pessoa_fisica'),
  address_street: z.string().optional().default(''),
  address_number: z.string().optional().default(''),
  address_complement: z.string().optional().default(''),
  address_neighborhood: z.string().optional().default(''),
  address_city: z.string().optional().default(''),
  address_state: z.string().optional().default(''),
  address_zip: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  is_active: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const estados = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Customer | null
  onSuccess: () => void
}

export function ClientFormDialog({ open, onOpenChange, client, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!client

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf_cnpj: '',
      type: 'pessoa_fisica',
      address_street: '',
      address_number: '',
      address_complement: '',
      address_neighborhood: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      notes: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (open && client) {
      form.reset({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpf_cnpj: client.cpf_cnpj || '',
        type: (client.type as 'pessoa_fisica' | 'pessoa_juridica') || 'pessoa_fisica',
        address_street: client.address_street || '',
        address_number: client.address_number || '',
        address_complement: client.address_complement || '',
        address_neighborhood: client.address_neighborhood || '',
        address_city: client.address_city || '',
        address_state: client.address_state || '',
        address_zip: client.address_zip || '',
        notes: client.notes || '',
        is_active: client.is_active !== false,
      })
    } else if (open && !client) {
      form.reset({
        name: '',
        email: '',
        phone: '',
        cpf_cnpj: '',
        type: 'pessoa_fisica',
        address_street: '',
        address_number: '',
        address_complement: '',
        address_neighborhood: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        notes: '',
        is_active: true,
      })
    }
  }, [open, client, form])

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      if (isEditing && client?.id) {
        await updateClient(client.id, values)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await createNewClient(values)
        toast.success('Cliente cadastrado com sucesso!')
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const type = form.watch('type')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do cliente' : 'Cadastre um novo cliente'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tipo */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                      <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{type === 'pessoa_juridica' ? 'Razão Social / Nome Fantasia' : 'Nome Completo'} *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CPF/CNPJ e Telefone */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cpf_cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{type === 'pessoa_juridica' ? 'CNPJ' : 'CPF'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={type === 'pessoa_juridica' ? '00.000.000/0000-00' : '000.000.000-00'}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 9 9999-9999" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* E-mail */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="cliente@exemplo.com.br" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Endereço
            </p>

            {/* CEP e Estado */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="address_street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua / Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua das Flores" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="address_neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Apto 2B" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="address_zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="address_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {estados.map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações Internas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anotações sobre o cliente (não visível ao cliente)..."
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
