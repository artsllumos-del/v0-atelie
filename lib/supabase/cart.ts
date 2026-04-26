import { createClient } from './client'

export async function getCart(userId: string) {
  const supabase = createClient()
  const { data } = await supabase.from('cart_items').select('*').eq('user_id', userId)
  return data || []
}

export async function addToCart(userId: string, productId: string, quantity: number = 1, customization?: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('cart_items').insert([{
    user_id: userId,
    product_id: productId,
    quantity,
    customization
  }]).select().single()
  if (error) throw error
  return data
}

export async function updateCartItem(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('cart_items').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function removeFromCart(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('cart_items').delete().eq('id', id)
  if (error) throw error
}

export async function clearCart(userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId)
  if (error) throw error
}
