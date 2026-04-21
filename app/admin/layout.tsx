'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Store,
  LogOut,
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

interface NavItem {
  href: string
  label: string
  icon: ReactNode
  badge?: number
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="size-5" /> },
  { href: '/admin/estoque', label: 'Estoque', icon: <Boxes className="size-5" />, badge: 2 },
  { href: '/admin/produtos', label: 'Produtos', icon: <Package className="size-5" /> },
  { href: '/admin/precificacao', label: 'Precificação', icon: <Calculator className="size-5" /> },
  { href: '/admin/orcamentos', label: 'Orçamentos', icon: <FileText className="size-5" /> },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingCart className="size-5" />, badge: 3 },
  { href: '/admin/producao', label: 'Produção', icon: <Factory className="size-5" /> },
  { href: '/admin/clientes', label: 'Clientes', icon: <Users className="size-5" /> },
  { href: '/admin/financeiro', label: 'Financeiro', icon: <DollarSign className="size-5" /> },
  { href: '/admin/configuracoes', label: 'Configurações', icon: <Settings className="size-5" /> },
]

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      {item.icon}
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant={isActive ? 'secondary' : 'default'} className="size-5 justify-center rounded-full p-0 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )
}

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b px-4', collapsed && 'justify-center px-2')}>
        {collapsed ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="font-serif text-lg font-bold">A</span>
          </div>
        ) : (
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-serif text-lg font-bold">A</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">Ateliê Sagrado</h1>
              <p className="text-xs text-muted-foreground">Gestão Artesanal</p>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn('border-t p-3', collapsed && 'flex justify-center')}>
        <Link
          href="/loja"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
        >
          <Store className="size-5" />
          {!collapsed && <span>Ver Loja</span>}
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden border-r bg-card transition-all duration-300 lg:block',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <SidebarContent collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-50 size-6 rounded-full border bg-card shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn('flex flex-1 flex-col transition-all duration-300', collapsed ? 'lg:ml-16' : 'lg:ml-64')}>
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm lg:px-6">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="size-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Search */}
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="h-9 bg-muted/50 pl-9 focus-visible:bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    3
                  </span>
                  <span className="sr-only">Notificações</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium text-destructive">Estoque Crítico</span>
                  <span className="text-sm text-muted-foreground">Entremeio Divino Espírito Santo abaixo do mínimo</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium text-destructive">Produção Bloqueada</span>
                  <span className="text-sm text-muted-foreground">Pedido #PED-2024-002 aguardando material</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium text-warning">Prazo Próximo</span>
                  <span className="text-sm text-muted-foreground">Pedido #PED-2024-002 vence em 4 dias</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">AS</AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium md:inline-block">Artesã</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
