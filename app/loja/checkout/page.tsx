'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipcode: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      toast.success('Pedido realizado com sucesso!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/loja/carrinho" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Carrinho
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Passo 1: Endereço */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Passo 1: Endereço de Entrega</CardTitle>
                <CardDescription>Onde deseja receber seu pedido?</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input
                      name="name"
                      placeholder="Seu Nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      name="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Endereço</label>
                      <Input
                        name="address"
                        placeholder="Rua / Avenida"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Número</label>
                      <Input
                        name="number"
                        placeholder="123"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Complemento (Opcional)</label>
                    <Input
                      name="complement"
                      placeholder="Apto 456"
                      value={formData.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Cidade</label>
                      <Input
                        name="city"
                        placeholder="São Paulo"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estado</label>
                      <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="SP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">CEP</label>
                    <Input
                      name="zipcode"
                      placeholder="00000-000"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Próximo Passo
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Passo 2: Pagamento */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Passo 2: Pagamento</CardTitle>
                <CardDescription>Escolha a forma de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" defaultChecked className="mr-3" />
                      <span className="text-sm">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" className="mr-3" />
                      <span className="text-sm">Boleto Bancário</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" className="mr-3" />
                      <span className="text-sm">PIX</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Confirmar Pedido
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo do Pedido */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Nenhum item no carrinho
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete:</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>R$ 0,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
