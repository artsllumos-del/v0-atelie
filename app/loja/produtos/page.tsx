'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

export default function ProdutosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catálogo de Produtos</h1>
        <p className="text-muted-foreground mt-2">Conheça nossa coleção de terços</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle>Terço Premium {i}</CardTitle>
              <CardDescription>Contas de cristal cristalino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">R$ 0,00</div>
              <Button className="w-full" variant="outline">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-12 bg-muted rounded-lg">
        <p className="text-muted-foreground">Catálogo em construção</p>
      </div>
    </div>
  )
}
