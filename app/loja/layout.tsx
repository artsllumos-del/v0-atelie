import { Metadata } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Ateliê Sagrado | Loja de Terços Artesanais',
  description: 'Descubra nossa coleção exclusiva de terços artesanais. Personalize seu terço com contas especiais, cores e materiais premium.',
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Header da Loja */}
          <header className="border-b border-border bg-card sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif font-bold">✦</span>
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold text-foreground">Ateliê Sagrado</h1>
                  <p className="text-xs text-muted-foreground">Terços Artesanais</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/loja" className="text-foreground hover:text-primary transition-colors font-medium">Loja</a>
                <a href="/loja/montador" className="text-foreground hover:text-primary transition-colors font-medium">Montar Terço</a>
                <a href="/minha-conta" className="text-foreground hover:text-primary transition-colors font-medium">Minha Conta</a>
                <a href="/carrinho" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <span>🛒</span>
                </a>
              </nav>
              <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-secondary py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4">Sobre</h3>
                  <p className="text-sm text-muted-foreground">Artesanato sagrado com qualidade premium, feito com dedicação e fé.</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4">Loja</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terços Prontos</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Personalizados</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Materiais</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4">Atendimento</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Envios</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-4">Conta</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Meus Pedidos</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Minhas Personalizações</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sair</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 Ateliê Sagrado. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
