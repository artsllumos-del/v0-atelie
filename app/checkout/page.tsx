'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = 278.40
  const discount = 27.84
  const shipping = 0
  const total = subtotal - discount + shipping

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCurrentStep('confirmation')
    setIsProcessing(false)
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center border-success bg-success/5">
            <CardContent className="pt-12 pb-8">
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Pedido Confirmado!</h1>
              <p className="text-muted-foreground mb-6">
                Obrigado por sua compra. Enviamos um email com os detalhes da sua encomenda.
              </p>
              
              <div className="bg-secondary rounded-lg p-6 mb-8 text-left">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Número do Pedido</p>
                    <p className="text-lg font-bold text-foreground">PED-2024-00541</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pago</p>
                    <p className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                    <p className="text-lg font-medium text-foreground">Cartão de Crédito</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entrega Estimada</p>
                    <p className="text-lg font-medium text-foreground">10-12 dias úteis</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Você receberá atualizações do seu pedido por email. 
                  Acompanhe em <strong>Minha Conta</strong> a qualquer momento.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-8">
                <Button 
                  onClick={() => router.push('/minha-conta')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                >
                  Ver Meus Pedidos
                </Button>
                <Button 
                  onClick={() => router.push('/loja')}
                  variant="outline"
                >
                  Continuar Comprando
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex gap-4 mb-8">
          {['shipping', 'payment'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep === step ? 'bg-primary text-primary-foreground' :
                (step === 'shipping' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground')
              }`}>
                {step === 'shipping' ? 1 : 2}
              </div>
              <span className="text-sm font-medium text-foreground capitalize">{step === 'shipping' ? 'Endereço' : 'Pagamento'}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'shipping' && (
              <>
                {/* Endereço de Entrega */}
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" defaultValue="Maria Silva Santos" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="maria@example.com" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" defaultValue="(11) 98765-4321" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" placeholder="01310-100" className="bg-input text-foreground mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" defaultValue="Rua das Flores, 123" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" defaultValue="123" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" defaultValue="Apto 456" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" defaultValue="Centro" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" defaultValue="São Paulo" className="bg-input text-foreground mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Select defaultValue="sp">
                          <SelectTrigger id="state" className="bg-input text-foreground mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sp">São Paulo</SelectItem>
                            <SelectItem value="rj">Rio de Janeiro</SelectItem>
                            <SelectItem value="mg">Minas Gerais</SelectItem>
                            <SelectItem value="ba">Bahia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tipo de Frete */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tipo de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup defaultValue="standard">
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg mb-3 cursor-pointer hover:border-primary/50">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <span className="font-medium">Entrega Padrão</span>
                          <span className="text-sm text-muted-foreground block">10-12 dias úteis • Grátis</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <span className="font-medium">Entrega Express</span>
                          <span className="text-sm text-muted-foreground block">3-5 dias úteis • R$ 25,00</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button 
                  onClick={() => setCurrentStep('payment')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                >
                  Próximo: Pagamento
                </Button>
              </>
            )}

            {currentStep === 'payment' && (
              <>
                {/* Método de Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle>Método de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                      <input type="radio" name="payment" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-primary" />
                      <span className="font-medium text-foreground flex-1">Cartão de Crédito</span>
                      <span className="text-lg">💳</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                      <input type="radio" name="payment" value="debit-card" checked={paymentMethod === 'debit-card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-primary" />
                      <span className="font-medium text-foreground flex-1">Cartão de Débito</span>
                      <span className="text-lg">💳</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                      <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-primary" />
                      <span className="font-medium text-foreground flex-1">PIX</span>
                      <span className="text-lg">📱</span>
                    </label>
                  </CardContent>
                </Card>

                {/* Dados do Cartão */}
                {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados do Cartão</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input id="card-number" placeholder="0000 0000 0000 0000" className="bg-input text-foreground mt-1 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-expiry">Vencimento</Label>
                          <Input id="card-expiry" placeholder="MM/AA" className="bg-input text-foreground mt-1 font-mono" />
                        </div>
                        <div>
                          <Label htmlFor="card-cvc">CVC</Label>
                          <Input id="card-cvc" placeholder="000" className="bg-input text-foreground mt-1 font-mono" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="card-name">Nome no Cartão</Label>
                        <Input id="card-name" placeholder="MARIA SILVA" className="bg-input text-foreground mt-1 uppercase" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setCurrentStep('shipping')}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                  >
                    {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Seu Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Items */}
                <div className="space-y-2 pb-3 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terço de Cristal</span>
                    <span className="font-medium">R$ 185,90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terço Madeira (x2)</span>
                    <span className="font-medium">R$ 92,50</span>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Desconto (10%)</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <Badge className="bg-success text-success-foreground">Grátis</Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>

                {/* Segurança */}
                <div className="bg-secondary p-3 rounded-lg text-xs text-muted-foreground">
                  <p className="mb-1">🔒 Pagamento 100% Seguro</p>
                  <p>Seus dados estão protegidos com encriptação SSL.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
