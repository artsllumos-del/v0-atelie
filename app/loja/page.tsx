'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, ShoppingCart, Package } from 'lucide-react'
import Link from 'next/link'

export default function LojaPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary py-20 px-4 rounded-lg">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Terços Artesanais Sagrados
          </h1>
          <p className="text-lg text-muted-foreground">
            Cada peça é feita com dedicação e amor. Personalize seu terço e sinta a diferença da qualidade artesanal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/loja/montador">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Montar Meu Terço
              </Button>
            </Link>
            <Link href="/loja/produtos">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Package className="w-5 h-5" />
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Destaque */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-serif font-bold mb-8">Por que Escolher?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Sparkles className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Artesanal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cada terço é feito à mão com atenção especial aos detalhes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShoppingCart className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Personalizado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monte seu terço escolhendo cores, materiais e tamanho
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Usamos apenas os melhores materiais e técnicas tradicionais
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-12 px-4 rounded-lg max-w-6xl mx-auto w-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold">Comece Agora</h2>
          <p className="text-muted-foreground">Crie seu terço personalizado em poucos minutos</p>
          <Link href="/loja/montador">
            <Button size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Montar Terço
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
