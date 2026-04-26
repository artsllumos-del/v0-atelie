// Funções para gerenciar clientes no Supabase
import { createClient } from './client'

export async function getClients() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createClientRecord(client: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .insert([{
      name: client.name,
      email: client.email,
      phone: client.phone || null,
      address: client.address || null,
      notes: client.notes || null,
      is_company: client.is_company,
      company_name: client.company_name || null,
      cnpj: client.cnpj || null,
      order_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateClient(id: string, client: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .update({
      name: client.name,
      email: client.email,
      phone: client.phone || null,
      address: client.address || null,
      notes: client.notes || null,
      is_company: client.is_company,
      company_name: client.company_name || null,
      cnpj: client.cnpj || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteClient(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getClientById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
