// Funções para gerenciar produtos no Supabase
import { createClient } from './client'

export async function getProducts() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Error fetching products:', err)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('Error fetching product:', err)
    return null
  }
}

export async function createProduct(product: any) {
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}
