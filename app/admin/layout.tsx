'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Calculator,
  FileText,
  ShoppingCart,
  Factory,
  Users,
  DollarSign,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  LogOut,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface NavItem {
  href: string
  label: string
  icon: ReactNode
  badge?: number
  description?: string
}

const mainNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="size-5" />, description: 'Visao geral' },
  { href: '/admin/estoque', label: 'Estoque', icon: <Boxes className="size-5" />, description: 'Materiais' },
  { href: '/admin/produtos', label: 'Produtos', icon: <Package className="size-5" />, description: 'Catalogo' },
  { href: '/admin/precificacao', label: 'Precificacao', icon: <Calculator className="size-5" />, description: 'Custos' },
]

const salesNavItems: NavItem[] = [
  { href: '/admin/orcamentos', label: 'Orcamentos', icon: <FileText className="size-5" />, description: 'Propostas' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingCart className="size-5" />, description: 'Vendas' },
  { href: '/admin/producao', label: 'Producao', icon: <Factory className="size-5" />, description: 'Fila' },
]

const managementNavItems: NavItem[] = [
  { href: '/admin/clientes', label: 'Clientes', icon: <Users className="size-5" />, description: 'Contatos' },
  { href: '/admin/financeiro', label: 'Financeiro', icon: <DollarSign className="size-5" />, description: 'Fluxo' },
  { href: '/admin/configuracoes', label: 'Configuracoes', icon: <Settings className="size-5" />, description: 'Sistema' },
]

function NavLink({ item, collapsed, onClick }: { item: NavItem; collapsed: boolean; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      <span className={cn('shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>
        {item.icon}
      </span>
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && item.badge && item.badge > 0 && (
        <Badge variant={isActive ? 'secondary' : 'default'} className="size-5 justify-center rounded-full p-0 text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

function NavSection({ title, items, collapsed, onClick }: { 
  title: string
  items: NavItem[]
  collapsed: boolean
  onClick?: () => void 
}) {
  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onClick} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {items.map((item) => (
        <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onClick} />
      ))}
    </div>
  )
}

function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b px-4', collapsed && 'justify-center px-2')}>
        {collapsed ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="font-serif text-lg font-bold">A</span>
          </div>
        ) : (
          <Link href="/admin" className="flex items-center gap-3" onClick={onNavigate}>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-serif text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">Atelie Sagrado</h1>
              <p className="text-xs text-muted-foreground">Gestao Artesanal</p>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          <NavSection title="Principal" items={mainNavItems} collapsed={collapsed} onClick={onNavigate} />
          {!collapsed && <Separator />}
          <NavSection title="Vendas" items={salesNavItems} collapsed={collapsed} onClick={onNavigate} />
          {!collapsed && <Separator />}
          <NavSection title="Gestao" items={managementNavItems} collapsed={collapsed} onClick={onNavigate} />
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn('border-t p-3', collapsed && 'flex justify-center')}>
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">Atelie Sagrado v2.0</p>
            <p className="text-xs text-muted-foreground">Sistema de Gestao</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success('Desconectado com sucesso')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Erro ao desconectar')
    }
  }

  // Get page title from pathname
  const getPageTitle = () => {
    const allItems = [...mainNavItems, ...salesNavItems, ...managementNavItems]
    const current = allItems.find(item => 
      pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
    )
    return current?.label || 'Dashboard'
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden border-r bg-card transition-all duration-300 lg:block',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} />
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-20 z-50 size-6 rounded-full border bg-card shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn('flex flex-1 flex-col transition-all duration-300', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:px-6">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>

          {/* Page Title - Mobile */}
          <div className="lg:hidden">
            <h1 className="font-serif text-lg font-semibold">{getPageTitle()}</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="h-9 bg-muted/50 pl-9 focus-visible:bg-background"
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="size-5" />
          </Button>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  <span className="sr-only">Notificacoes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificacoes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma notificacao
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">AS</AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium md:inline-block">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/configuracoes">
                    <Settings className="mr-2 size-4" />
                    Configuracoes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="flex items-center gap-2 border-b bg-card px-4 py-3 md:hidden">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Buscar..."
              className="h-9 flex-1"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
