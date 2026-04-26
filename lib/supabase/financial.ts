import { createClient } from './client'

export async function getFinancialTransactions(filters?: any) {
  const supabase = createClient()
  let query = supabase.from('financial_transactions').select('*').order('date', { ascending: false })
  
  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.startDate) query = query.gte('date', filters.startDate)
  if (filters?.endDate) query = query.lte('date', filters.endDate)
  
  const { data } = await query
  return data || []
}

export async function createFinancialTransaction(transaction: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('financial_transactions').insert([transaction]).select().single()
  if (error) throw error
  return data
}

export async function updateFinancialTransaction(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('financial_transactions').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteFinancialTransaction(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('financial_transactions').delete().eq('id', id)
  if (error) throw error
}

export async function getFinancialSummary(period?: 'month' | 'year') {
  const supabase = createClient()
  const { data: transactions } = await supabase.from('financial_transactions').select('*')
  
  if (!transactions) return { receitas: 0, despesas: 0, lucro: 0 }
  
  const receitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + (t.amount || 0), 0)
  
  const despesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + (t.amount || 0), 0)
  
  return { receitas, despesas, lucro: receitas - despesas }
}
