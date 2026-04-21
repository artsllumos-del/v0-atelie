'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function MontadorPage() {
  const [step, setStep] = useState(1)
  const [color, setColor] = useState('ouro')
  const [size, setSize] = useState('medio')
  const [material, setMaterial] = useState('cristal')
  const [quantity, setQuantity] = useState(1)
  const [customizacao, setCustomizacao] = useState('')

  const handleAddToCart = () => {
    toast.success('Terço adicionado ao carrinho!')
    setStep(1)
    setColor('ouro')
    setSize('medio')
    setMaterial('cristal')
    setQuantity(1)
    setCustomizacao('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Monte Seu Terço</h1>
        <p className="text-muted-foreground mt-2">Personalize cada detalhe do seu terço sagrado</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Passo {step}: Escolha as Características</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Cor Principal</label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ouro">Ouro</SelectItem>
                        <SelectItem value="prata">Prata</SelectItem>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="preto">Preto</SelectItem>
                        <SelectItem value="marrom">Marrom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tamanho das Contas</label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeno (6mm)</SelectItem>
                        <SelectItem value="medio">Médio (8mm)</SelectItem>
                        <SelectItem value="grande">Grande (10mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full gap-2">
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Material das Contas</label>
                    <Select value={material} onValueChange={setMaterial}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cristal">Cristal</SelectItem>
                        <SelectItem value="madeira">Madeira</SelectItem>
                        <SelectItem value="vidro">Vidro</SelectItem>
                        <SelectItem value="semiprecioso">Semiprecioso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1 gap-2">
                      Próximo <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Personalização (Opcional)</label>
                    <textarea 
                      placeholder="Ex: Iniciativas, datas especiais, etc."
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={4}
                      value={customizacao}
                      onChange={(e) => setCustomizacao(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={handleAddToCart} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="w-4 h-4" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cor:</span>
                  <span className="font-medium capitalize">{color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamanho:</span>
                  <span className="font-medium capitalize">{size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="font-medium capitalize">{material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantidade:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold text-lg">R$ 0,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
