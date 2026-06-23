'use client'

import { createClient } from './client'

export type Notification = {
  id: string
  user_id: string
  type: 'pedido' | 'orcamento' | 'sistema' | 'entrega' | 'pagamento' | 'estoque'
  title: string
  message: string
  related_order_id: string | null
  is_read: boolean
  created_at: string
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return []
  return (data || []) as Notification[]
}

export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
}

export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
}

export async function deleteNotification(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('notifications').delete().eq('id', id)
}

export async function createNotification(
  userId: string,
  notification: Pick<Notification, 'type' | 'title' | 'message' | 'related_order_id'>
): Promise<void> {
  const supabase = createClient()
  await supabase.from('notifications').insert([
    {
      user_id: userId,
      type: notification.type,
      title: notification.title,
      message: notification.message || '',
      related_order_id: notification.related_order_id || null,
      is_read: false,
    },
  ])
}
