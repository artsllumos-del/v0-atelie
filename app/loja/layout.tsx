import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/loja/mobile-nav'

const navLinks = [
  { href: '/loja', label: 'Início' },
  { href: '/loja/produtos', label: 'Produtos' },
  { href: '/loja/montador', label: 'Montar Terço' },
  { href: '/loja/sobre', label: 'Sobre' },
]

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Link href="/loja" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <span className="font-serif text-lg font-bold">A</span>
              </div>
              <span className="hidden font-serif text-xl font-semibold sm:inline-block">
                Ateliê Sagrado
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/loja/carrinho">
                <ShoppingCart className="size-5" />
                <span className="sr-only">Carrinho</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/loja/conta">
                <User className="size-5" />
                <span className="sr-only">Minha Conta</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <span className="font-serif text-lg font-bold">A</span>
                </div>
                <span className="font-serif text-xl font-semibold">Ateliê Sagrado</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Terços artesanais feitos com amor, fé e dedicação. 
                Cada peça é única e especial.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-semibold">Links</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold">Contato</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>contato@ateliesagrado.com.br</li>
                <li>(11) 99999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ateliê Sagrado. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
