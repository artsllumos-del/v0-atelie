import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin_principal' | 'admin' | 'colaborador' | 'cliente'
  avatar_url: string | null
  phone: string | null
  document: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  module: string
  action: string
  description: string | null
}

export interface UserPermission {
  id: string
  user_id: string
  permission_id: string
  created_at: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data as User
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('permissions(*)')
      .eq('user_id', userId)

    if (error) throw error
    
    return data?.map((item: any) => item.permissions) || []
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    return []
  }
}

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    
    // Admin principal tem todas as permissões
    if (user?.role === 'admin_principal') return true
    
    // Verificar permissões específicas do colaborador
    const permissions = await getUserPermissions(userId)
    return permissions.some(p => p.name === permissionName)
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
