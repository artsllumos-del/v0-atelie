'use client'

import { createClient } from './client'

export type Customer = {
  id: string
  user_id: string | null
  name: string
  email: string
  phone: string
  cpf_cnpj: string
  type: string
  address_street: string
  address_number: string
  address_complement: string
  address_neighborhood: string
  address_city: string
  address_state: string
  address_zip: string
  total_orders: number
  total_spent: number
  notes: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getClients(): Promise<Customer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as Customer[]
}

export async function getClientById(id: string): Promise<Customer> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Customer
}

function buildCustomerPayload(customer: Partial<Customer>) {
  return {
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    cpf_cnpj: customer.cpf_cnpj || '',
    type: customer.type || 'pessoa_fisica',
    address_street: customer.address_street || '',
    address_number: customer.address_number || '',
    address_complement: customer.address_complement || '',
    address_neighborhood: customer.address_neighborhood || '',
    address_city: customer.address_city || '',
    address_state: customer.address_state || '',
    address_zip: customer.address_zip || '',
    notes: customer.notes || '',
    is_active: customer.is_active !== false,
  }
}

export async function createNewClient(customer: Partial<Customer>): Promise<Customer> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .insert([buildCustomerPayload(customer)])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Customer
}

export async function updateClient(id: string, customer: Partial<Customer>): Promise<Customer> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customers')
    .update(buildCustomerPayload(customer))
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Customer
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
