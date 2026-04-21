'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function LojaHeader() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
        setIsLoggedIn(true)
      }
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      setUserEmail('')
      router.push('/loja')
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

          {isLoggedIn ? (
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
          ) : (
            <Link href="/auth">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default function LojaLayout({ children }: { children: React.ReactNode }) {
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
