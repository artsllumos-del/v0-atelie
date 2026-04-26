import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, Star, Package, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProducts } from '@/lib/supabase/products'

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-background py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Sparkles className="size-3.5" />
            Feito à mão com amor
          </Badge>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Terços artesanais que{' '}
            <span className="text-primary">tocam a alma</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Cada peça é única, confeccionada com materiais selecionados e muito carinho. 
            Encontre o terço perfeito ou crie o seu próprio, personalizado do seu jeito.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/loja/montador">
                <Sparkles className="mr-2 size-4" />
                Montar meu terço
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/loja/produtos">
                Ver coleção
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: 'Feito com Amor',
      description: 'Cada terço é confeccionado manualmente, com atenção aos detalhes e carinho em cada nó.',
    },
    {
      icon: Star,
      title: 'Materiais Premium',
      description: 'Utilizamos cristais, pérolas e metais de alta qualidade para garantir durabilidade.',
    },
    {
      icon: Package,
      title: 'Embalagem Especial',
      description: 'Todos os terços são embalados com cuidado, perfeitos para presente.',
    },
  ]

  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <feature.icon className="size-7 text-primary" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ produto }: { produto: any }) {
  const price = produto.sale_price || produto.base_price || 0
  
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 p-8">
        <div className="flex size-full items-center justify-center rounded-xl bg-card/50 backdrop-blur">
          <span className="text-5xl">🙏</span>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {produto.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{produto.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {produto.sale_price && produto.sale_price < produto.base_price && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {produto.base_price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              R$ {price.toFixed(2)}
            </span>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/produto/${produto.id}`}>
              Ver detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

async function ProductsSection() {
  const products = await getProducts()
  const produtosDestaque = products.filter((p: any) => p.is_active).slice(0, 4)

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">Destaques</h2>
            <p className="mt-2 text-muted-foreground">Nossos terços mais amados</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/loja/produtos">
              Ver todos
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        {produtosDestaque.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {produtosDestaque.map((produto: any) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
            <Package className="size-16 text-muted-foreground" />
            <h3 className="mt-4 font-serif text-xl font-medium">
              Em breve novos produtos
            </h3>
            <p className="mt-2 text-muted-foreground">
              Estamos preparando peças especiais para você
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
            Monte seu terço personalizado
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Escolha cada detalhe: contas, cores, entremeio e crucifixo. 
            Crie uma peça única e especial.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/loja/montador">
              <Sparkles className="mr-2 size-4" />
              Começar agora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default async function LojaPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <CTASection />
    </>
  )
}
