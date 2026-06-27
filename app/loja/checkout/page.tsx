'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Package,
  CreditCard,
  QrCode,
  Truck,
  Check,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { produtos } from '@/lib/mock-data'

// Dados mock
const carrinhoMock = [
  { produtoId: 'prod-001', produto: produtos[0], quantidade: 2 },
  { produtoId: 'prod-003', produto: produtos[2], quantidade: 1 },
]

const etapas = ['Endereço', 'Pagamento', 'Confirmação']

function EtapaEndereco({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Endereço de Entrega</h2>
        <p className="text-sm text-muted-foreground">
          Informe o endereço onde deseja receber seu pedido
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" placeholder="Seu nome completo" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" placeholder="(11) 99999-9999" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" placeholder="00000-000" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" placeholder="123" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" placeholder="Rua, Avenida..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input id="complemento" placeholder="Apartamento, bloco..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" placeholder="Bairro" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" placeholder="Cidade" />
          </div>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onNext}>
        Continuar para Pagamento
      </Button>
    </div>
  )
}

function EtapaPagamento({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [metodoPagamento, setMetodoPagamento] = useState('pix')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Forma de Pagamento</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja pagar seu pedido
        </p>
      </div>

      <RadioGroup
        value={metodoPagamento}
        onValueChange={setMetodoPagamento}
        className="space-y-3"
      >
        <label
          htmlFor="pix"
          className={cn(
            'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
            metodoPagamento === 'pix' && 'border-primary bg-primary/5'
          )}
        >
          <RadioGroupItem value="pix" id="pix" />
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <QrCode className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Pix</p>
            <p className="text-sm text-muted-foreground">
              Pagamento instantâneo - sem taxa
            </p>
          </div>
        </label>

        <label
          htmlFor="cartao"
          className={cn(
            'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
            metodoPagamento === 'cartao' && 'border-primary bg-primary/5'
          )}
        >
          <RadioGroupItem value="cartao" id="cartao" />
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Cartão de Crédito</p>
            <p className="text-sm text-muted-foreground">
              Parcele em até 3x sem juros
            </p>
          </div>
        </label>
      </RadioGroup>

      {metodoPagamento === 'cartao' && (
        <Card>
          <CardContent className="grid gap-4 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="numero-cartao">Número do Cartão</Label>
              <Input id="numero-cartao" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome-cartao">Nome no Cartão</Label>
              <Input id="nome-cartao" placeholder="Como está no cartão" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="validade">Validade</Label>
                <Input id="validade" placeholder="MM/AA" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Voltar
        </Button>
        <Button className="flex-1" size="lg" onClick={onNext}>
          Finalizar Pedido
        </Button>
      </div>
    </div>
  )
}

function EtapaConfirmacao() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success/10">
        <Check className="size-10 text-success" />
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold">Pedido Confirmado!</h2>
        <p className="mt-2 text-muted-foreground">
          Obrigado por comprar no Ateliê Sagrado
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Número do Pedido</span>
              <span className="font-mono font-semibold">#PED-2024-005</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Previsão de Entrega</span>
              <span className="font-medium">7-10 dias úteis</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Você receberá um e-mail com os detalhes do pedido e informações de rastreamento.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/loja/conta/pedidos">Acompanhar Pedido</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/loja">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const [etapaAtual, setEtapaAtual] = useState(0)

  const subtotal = carrinhoMock.reduce(
    (acc, item) => acc + item.produto.precoVenda * item.quantidade,
    0
  )
  const frete = 15
  const total = subtotal + frete

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/loja/carrinho">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-success" />
            <span className="font-medium">Checkout Seguro</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8">
            {etapas.map((etapa, index) => (
              <div key={etapa} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-sm font-medium',
                    index < etapaAtual && 'bg-success text-success-foreground',
                    index === etapaAtual && 'bg-primary text-primary-foreground',
                    index > etapaAtual && 'bg-muted text-muted-foreground'
                  )}
                >
                  {index < etapaAtual ? <Check className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'hidden text-sm font-medium sm:inline-block',
                    index <= etapaAtual ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {etapa}
                </span>
                {index < etapas.length - 1 && (
                  <div
                    className={cn(
                      'hidden h-0.5 w-16 sm:block',
                      index < etapaAtual ? 'bg-success' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {etapaAtual === 0 && (
                  <EtapaEndereco onNext={() => setEtapaAtual(1)} />
                )}
                {etapaAtual === 1 && (
                  <EtapaPagamento
                    onNext={() => setEtapaAtual(2)}
                    onBack={() => setEtapaAtual(0)}
                  />
                )}
                {etapaAtual === 2 && <EtapaConfirmacao />}
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          {etapaAtual < 2 && (
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-serif">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {carrinhoMock.map((item) => (
                    <div key={item.produtoId} className="flex gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.produto.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qtd: {item.quantidade}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {(item.produto.precoVenda * item.quantidade).toLocaleString(
                          'pt-BR',
                          { style: 'currency', currency: 'BRL' }
                        )}
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        {subtotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>
                        {frete.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-xl text-primary">
                        {total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
