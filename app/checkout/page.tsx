'use client'

import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useState } from 'react'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const total = 231.80

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/carrinho"><ArrowLeft className="size-4" /></Link>
          </Button>
          <h1 className="font-serif text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex items-center gap-2 p-3 rounded-lg border-2 ${step >= s ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                  {step > s ? <Check className="size-4 text-success" /> : <span>{s}</span>}
                  <span className="hidden sm:inline text-sm">{['Endereço', 'Pagamento', 'Confirmação'][s-1]}</span>
                </div>
              ))}
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input placeholder="Seu nome" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input placeholder="00000-000" />
                    </div>
                    <div>
                      <Label>Rua</Label>
                      <Input placeholder="Rua exemplo" />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input placeholder="123" />
                    </div>
                    <div>
                      <Label>Complemento</Label>
                      <Input placeholder="Apto 456" />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input placeholder="São Paulo" />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input placeholder="SP" />
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setStep(2)}>Próximo</Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">Cartão</TabsTrigger>
                      <TabsTrigger value="pix">PIX</TabsTrigger>
                      <TabsTrigger value="transfer">Transferência</TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
                      <div>
                        <Label>Número do Cartão</Label>
                        <Input placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid gap-4 grid-cols-2">
                        <div>
                          <Label>Validade</Label>
                          <Input placeholder="MM/AA" />
                        </div>
                        <div>
                          <Label>CVV</Label>
                          <Input placeholder="000" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="pix" className="text-center py-8">
                      <p className="text-muted-foreground">Você receberá a chave PIX após confirmar o pedido</p>
                    </TabsContent>

                    <TabsContent value="transfer" className="text-center py-8">
                      <p className="text-muted-foreground">Dados bancários serão enviados por email</p>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Voltar</Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>Confirmar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-center">Pedido Confirmado!</CardTitle>
                  <CardDescription className="text-center">Seu pedido foi recebido com sucesso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                      <Check className="size-8 text-success" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Você receberá um email com detalhes do seu pedido</p>
                  <Button className="w-full" asChild>
                    <Link href="/loja">Voltar para Loja</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span>2 Terços</span>
                    <span>R$ 219.80</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>R$ 12.00</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
