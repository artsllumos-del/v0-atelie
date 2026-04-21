'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, Menu, BarChart3, Package, ShoppingCart, Users, DollarSign, Settings } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const navItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Estoque', href: '/admin/estoque' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/admin/pedidos' },
  { icon: Users, label: 'Clientes', href: '/admin/clientes' },
  { icon: DollarSign, label: 'Financeiro', href: '/admin/financeiro' },
  { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
]

function AdminSidebar() {
  const pathname = usePathname()
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <h1 className="font-serif text-xl font-bold text-primary">Ateliê Sagrado</h1>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
      toast.success('Logout realizado')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <div className="border-b bg-card flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <Menu className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-semibold">Admin</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full w-10 h-10">
            {userEmail.charAt(0).toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs">{userEmail}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!userData || !['admin_principal', 'admin', 'colaborador'].includes(userData.role)) {
        router.push('/loja')
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
