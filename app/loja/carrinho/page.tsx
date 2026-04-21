'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { produtos } from '@/lib/mock-data'

// Dados mock do carrinho
const carrinhoInicial = [
  { produtoId: 'prod-001', produto: produtos[0], quantidade: 2 },
  { produtoId: 'prod-003', produto: produtos[2], quantidade: 1 },
]

function ItemCarrinho({
  item,
  onUpdateQuantidade,
  onRemover,
}: {
  item: typeof carrinhoInicial[0]
  onUpdateQuantidade: (quantidade: number) => void
  onRemover: () => void
}) {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex size-20 items-center justify-center rounded-xl bg-muted">
        <Package className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{item.produto.nome}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
              {item.produto.descricao}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={onRemover}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => onUpdateQuantidade(Math.max(1, item.quantidade - 1))}
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantidade}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => onUpdateQuantidade(item.quantidade + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <span className="text-lg font-bold text-primary">
            {(item.produto.precoVenda * item.quantidade).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function CarrinhoPage() {
  const [carrinho, setCarrinho] = useState(carrinhoInicial)
  const [cupom, setCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(false)
  const [desconto, setDesconto] = useState(0)

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.produto.precoVenda * item.quantidade,
    0
  )
  const frete = subtotal > 200 ? 0 : 15
  const total = subtotal - desconto + frete

  const handleUpdateQuantidade = (index: number, quantidade: number) => {
    setCarrinho((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantidade } : item))
    )
  }

  const handleRemover = (index: number) => {
    setCarrinho((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAplicarCupom = () => {
    if (cupom.toUpperCase() === 'PRIMEIRACOMPRA') {
      setDesconto(subtotal * 0.1)
      setCupomAplicado(true)
    }
  }

  if (carrinho.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16">
          <ShoppingCart className="size-16 text-muted-foreground" />
          <h2 className="mt-4 font-serif text-2xl font-bold">Carrinho vazio</h2>
          <p className="mt-2 text-muted-foreground">
            Você ainda não adicionou nenhum produto
          </p>
          <Button className="mt-6" asChild>
            <Link href="/loja/produtos">Ver produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Meu Carrinho</h1>
      <p className="mt-1 text-muted-foreground">
        {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'} no carrinho
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Itens */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="divide-y p-4">
              {carrinho.map((item, index) => (
                <ItemCarrinho
                  key={item.produtoId}
                  item={item}
                  onUpdateQuantidade={(q) => handleUpdateQuantidade(index, q)}
                  onRemover={() => handleRemover(index)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Cupom */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="size-4" />
                Cupom de desconto
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  disabled={cupomAplicado}
                />
                <Button
                  variant="outline"
                  onClick={handleAplicarCupom}
                  disabled={cupomAplicado || !cupom}
                >
                  Aplicar
                </Button>
              </div>
              {cupomAplicado && (
                <Badge variant="secondary" className="mt-2 gap-1">
                  <Tag className="size-3" />
                  PRIMEIRACOMPRA aplicado - 10% de desconto
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Desconto</span>
                  <span>
                    -{desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>
                  {frete === 0 ? (
                    <span className="text-success">Grátis</span>
                  ) : (
                    frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  )}
                </span>
              </div>
              {frete > 0 && (
                <p className="text-xs text-muted-foreground">
                  Frete grátis para compras acima de R$ 200
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-xl text-primary">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/loja/checkout">
                  Finalizar Compra
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
