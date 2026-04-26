'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/loja', label: 'Início' },
  { href: '/loja/produtos', label: 'Produtos' },
  { href: '/loja/montador', label: 'Montar Terço' },
  { href: '/loja/sobre', label: 'Sobre' },
]

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SheetDescription className="sr-only">Navegue pelas páginas da loja</SheetDescription>
        <div className="flex flex-col gap-6 pt-6">
          <Link href="/loja" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-serif text-lg font-bold">A</span>
            </div>
            <span className="font-serif text-xl font-semibold">Ateliê Sagrado</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
