import { createClient } from './client'

export async function getCollaborators(filters?: any) {
  const supabase = createClient()
  let query = supabase.from('collaborators').select('*').order('name', { ascending: true })
  
  if (filters?.role) query = query.eq('role', filters.role)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.department) query = query.eq('department', filters.department)
  
  const { data } = await query
  return data || []
}

export async function getCollaboratorById(id: string) {
  const supabase = createClient()
  const { data } = await supabase.from('collaborators').select('*').eq('id', id).single()
  return data
}

export async function createCollaborator(collaborator: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('collaborators').insert([collaborator]).select().single()
  if (error) throw error
  return data
}

export async function updateCollaborator(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('collaborators').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCollaborator(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('collaborators').delete().eq('id', id)
  if (error) throw error
}

export async function getCollaboratorsByRole(role: string) {
  const supabase = createClient()
  const { data } = await supabase.from('collaborators').select('*').eq('role', role)
  return data || []
}

export async function getCollaboratorsByDepartment(department: string) {
  const supabase = createClient()
  const { data } = await supabase.from('collaborators').select('*').eq('department', department)
  return data || []
}
