'use client'

import { createClient } from './client'

export type SettingKey = 'loja' | 'sistema' | 'precificacao' | 'notificacoes'

export async function getSetting<T = Record<string, unknown>>(key: SettingKey): Promise<T | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) return null
  return data?.value as T
}

export async function saveSetting<T = Record<string, unknown>>(
  key: SettingKey,
  value: T
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw new Error(error.message)
}

export async function getAllSettings(): Promise<Record<SettingKey, unknown>> {
  const supabase = createClient()
  const { data, error } = await supabase.from('settings').select('key, value')

  if (error) return {} as Record<SettingKey, unknown>

  return (data || []).reduce(
    (acc, row) => ({ ...acc, [row.key]: row.value }),
    {} as Record<SettingKey, unknown>
  )
}
