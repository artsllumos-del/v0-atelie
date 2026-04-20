'use client'

import { useState } from 'react'
import { mockProducts } from '@/lib/mock-data'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [cartCount, setCartCount] = useState(0)

  const categories = ['todos', 'religiosos', 'decorativos', 'personalizados', 'premium']
  
  const filteredProducts = selectedCategory === 'todos' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory)

  const addToCart = (product: Product) => {
    setCartCount(prev => prev + 1)
    // TODO: Integrar com carrinho real
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent to-background py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Terços Artesanais Premium</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de terços feitos à mão com materiais nobres. 
            Cada peça é única e carregada de espiritualidade.
          </p>
          <a href="/loja/montador" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            ✨ Montar Meu Terço Personalizado
          </a>
        </div>
      </section>

      {/* Filtros */}
      <section className="border-b border-border py-8 sticky top-24 bg-card z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="aspect-square bg-gradient-to-br from-accent to-background flex items-center justify-center relative overflow-hidden">
                  {/* Imagem decorativa */}
                  <div className="text-6xl opacity-50">💎</div>
                  {product.stock < 5 && product.stock > 0 && (
                    <Badge className="absolute top-3 right-3 bg-warning text-warning-foreground">
                      Últimas peças
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                      Fora de Estoque
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.retailPrice.toFixed(2)}
                    </span>
                    {product.cost && (
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {(product.retailPrice * 1.2).toFixed(2)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Quer algo Especial?</h2>
          <p className="text-muted-foreground mb-8">
            Use nosso montador de terços personalizado para criar a peça dos seus sonhos. 
            Escolha cores, materiais, tamanho das contas e muito mais!
          </p>
          <a href="/loja/montador" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            ✨ Começar Customização
          </a>
        </div>
      </section>
    </div>
  )
}
