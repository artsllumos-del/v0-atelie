'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, ShoppingCart, Menu, Home } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function LojaHeader() {
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
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/loja" className="flex items-center gap-2 font-serif text-xl font-bold text-primary hover:text-primary/80 transition-colors">
          <span>Ateliê Sagrado</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/loja" className="text-sm hover:text-primary transition-colors">Início</Link>
          <Link href="/loja/produtos" className="text-sm hover:text-primary transition-colors">Catálogo</Link>
          <Link href="/loja/montador" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Montar Terço</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/loja/carrinho">
            <Button variant="outline" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Carrinho
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full w-10 h-10">
                {userEmail.charAt(0).toUpperCase() || 'U'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">{userEmail}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/loja/conta" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Minha Conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default function LojaLayout({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen bg-background flex flex-col">
      <LojaHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Ateliê Sagrado. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
