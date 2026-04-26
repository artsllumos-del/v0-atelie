import { createClient } from './client'

export async function getQuotes(filters?: any) {
  const supabase = createClient()
  let query = supabase.from('quotes').select('*').order('created_at', { ascending: false })
  
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.clientId) query = query.eq('client_id', filters.clientId)
  if (filters?.startDate) query = query.gte('created_at', filters.startDate)
  if (filters?.endDate) query = query.lte('created_at', filters.endDate)
  
  const { data } = await query
  return data || []
}

export async function getQuoteById(id: string) {
  const supabase = createClient()
  const { data } = await supabase.from('quotes').select('*').eq('id', id).single()
  return data
}

export async function createQuote(quote: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('quotes').insert([quote]).select().single()
  if (error) throw error
  return data
}

export async function updateQuote(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('quotes').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteQuote(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) throw error
}

export async function getQuotesByStatus(status: string) {
  const supabase = createClient()
  const { data } = await supabase.from('quotes').select('*').eq('status', status).order('created_at', { ascending: false })
  return data || []
}

export async function addQuoteItem(item: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('quote_items').insert([item]).select().single()
  if (error) throw error
  return data
}

export async function getQuoteItems(quoteId: string) {
  const supabase = createClient()
  const { data } = await supabase.from('quote_items').select('*').eq('quote_id', quoteId)
  return data || []
}
