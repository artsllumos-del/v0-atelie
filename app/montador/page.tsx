'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

const stages = [
  { id: 'size', label: 'Tamanho', description: 'Escolha o tamanho do terço' },
  { id: 'cross', label: 'Crucifixo', description: 'Selecione o crucifixo' },
  { id: 'center', label: 'Entremeio', description: 'Escolha o entremeio' },
  { id: 'small-beads', label: 'Contas Menores', description: 'Selecione as contas menores' },
  { id: 'large-beads', label: 'Contas Maiores', description: 'Escolha as contas maiores' },
  { id: 'closure', label: 'Fecho', description: 'Selecione o fecho' },
  { id: 'packaging', label: 'Embalagem', description: 'Escolha a embalagem' },
  { id: 'review', label: 'Revisão', description: 'Confirme seu pedido' },
]

export default function MontadorPage() {
  const [currentStage, setCurrentStage] = useState(0)
  const [customization, setCustomization] = useState({
    size: null,
    cross: null,
    center: null,
    smallBeads: null,
    largeBeads: null,
    closure: null,
    packaging: null,
  })
  const [quantity, setQuantity] = useState(1)

  const basePrice = 89.90
  const totalPrice = basePrice * quantity

  const handleNext = () => {
    if (currentStage < stages.length - 1) setCurrentStage(currentStage + 1)
  }

  const handlePrev = () => {
    if (currentStage > 0) setCurrentStage(currentStage - 1)
  }

  const handleAddToCart = () => {
    // TODO: Add to cart logic
    alert('Adicionado ao carrinho!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary">
            <ArrowLeft className="size-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="font-serif text-2xl font-semibold">Montador de Terços</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{`${currentStage + 1} de ${stages.length}`}</h2>
                <span className="text-sm text-muted-foreground">{stages[currentStage].label}</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stage Content */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">{stages[currentStage].label}</CardTitle>
                <CardDescription>{stages[currentStage].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Placeholder for stage-specific content */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="relative aspect-square rounded-lg border-2 border-muted hover:border-primary cursor-pointer transition-colors p-4 flex flex-col items-center justify-center text-center"
                    >
                      <div className="size-20 rounded-lg bg-muted mb-2"></div>
                      <p className="text-sm font-medium">Opção {item}</p>
                      <p className="text-xs text-muted-foreground">R$ 15,00</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStage === 0}
                className="flex-1"
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStage === stages.length - 1}
                className="flex-1"
              >
                Próximo
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Seu Terço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🙏</div>
                    <p className="text-sm text-muted-foreground">Visualização</p>
                  </div>
                </div>

                {/* Progress dots */}
                <div className="space-y-2">
                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        index <= currentStage
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {stage.label}
                      {index <= currentStage && ' ✓'}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço base</span>
                    <span>R$ {basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 rounded bg-muted hover:bg-muted/80"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 rounded bg-muted hover:bg-muted/80"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {totalPrice.toFixed(2)}</span>
                </div>

                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 size-4" />
                  Adicionar ao Carrinho
                </Button>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
