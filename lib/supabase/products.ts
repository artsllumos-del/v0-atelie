// Funções para gerenciar produtos no Supabase
import { supabase } from './client'

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: product.name,
      description: product.description,
      base_price: product.base_price,
      sale_price: product.sale_price || product.base_price,
      production_time_minutes: product.production_time_minutes,
      is_customizable: product.is_customizable,
      is_active: product.is_active,
      created_at: new Date().toISOString(),
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateProduct(id: string, product: any) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: product.name,
      description: product.description,
      base_price: product.base_price,
      sale_price: product.sale_price || product.base_price,
      production_time_minutes: product.production_time_minutes,
      is_customizable: product.is_customizable,
      is_active: product.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}
