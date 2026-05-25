'use client'

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

export async function createNewClient(client: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .insert([{
      name: client.name,
      email: client.email,
      phone: client.phone || null,
      address: client.address || null,
      city: client.city || null,
      state: client.state || null,
      zip_code: client.zip_code || null,
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
      city: client.city || null,
      state: client.state || null,
      zip_code: client.zip_code || null,
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
