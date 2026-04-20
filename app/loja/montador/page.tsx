'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface CustomBead {
  id: string
  color: string
  size: 'pequena' | 'media' | 'grande'
  material: 'madeira' | 'cristal' | 'metal' | 'vidro'
}

interface CustomRosary {
  name: string
  beads: CustomBead[]
  centerPiece: string
  totalCost: number
  totalPrice: number
}

const BEAD_OPTIONS = {
  colors: ['Preto', 'Marrom', 'Bege', 'Dourado', 'Prata', 'Vermelho', 'Azul', 'Verde'],
  sizes: [
    { id: 'pequena', label: 'Pequena (4mm)', price: 2 },
    { id: 'media', label: 'Média (6mm)', price: 3 },
    { id: 'grande', label: 'Grande (8mm)', price: 4 }
  ],
  materials: [
    { id: 'madeira', label: 'Madeira Natural', price: 5 },
    { id: 'cristal', label: 'Cristal', price: 15 },
    { id: 'metal', label: 'Metal Premium', price: 8 },
    { id: 'vidro', label: 'Vidro Artesanal', price: 6 }
  ],
  centerPieces: [
    { id: 'cruz-simples', label: 'Cruz Simples', price: 10 },
    { id: 'cruz-ornada', label: 'Cruz Ornada', price: 25 },
    { id: 'medalha', label: 'Medalha Nossa Senhora', price: 30 },
    { id: 'medalha-santo', label: 'Medalha Santo Especial', price: 35 }
  ]
}

export default function RosaryMakerPage() {
  const [rosaryName, setRosaryName] = useState('Meu Terço Personalizado')
  const [selectedColor, setSelectedColor] = useState('Preto')
  const [selectedSize, setSelectedSize] = useState('media')
  const [selectedMaterial, setSelectedMaterial] = useState('madeira')
  const [selectedCenterPiece, setSelectedCenterPiece] = useState('cruz-simples')
  const [beadCount, setBeadCount] = useState(60)
  const [preview, setPreview] = useState<CustomBead[]>([])

  // Calcular custos
  const costBreakdown = useMemo(() => {
    const sizePrice = BEAD_OPTIONS.sizes.find(s => s.id === selectedSize)?.price || 3
    const materialPrice = BEAD_OPTIONS.materials.find(m => m.id === selectedMaterial)?.price || 5
    const beadCost = (sizePrice + materialPrice) * beadCount
    const centerPiece = BEAD_OPTIONS.centerPieces.find(c => c.id === selectedCenterPiece)
    const centerCost = centerPiece?.price || 10
    const totalCost = beadCost + centerCost + 15 // 15 fio + montagem
    const totalPrice = totalCost * 2.5 // markup de 150%

    return {
      beadCost,
      centerCost,
      laborCost: 15,
      totalCost,
      totalPrice
    }
  }, [selectedSize, selectedMaterial, beadCount, selectedCenterPiece])

  const handleAddToPreview = () => {
    setPreview([
      ...preview,
      {
        id: Math.random().toString(),
        color: selectedColor,
        size: selectedSize as 'pequena' | 'media' | 'grande',
        material: selectedMaterial as 'madeira' | 'cristal' | 'metal' | 'vidro'
      }
    ])
  }

  const getBeadEmoji = (material: string) => {
    const emojis: Record<string, string> = {
      madeira: '🟫',
      cristal: '💎',
      metal: '⭐',
      vidro: '🔮'
    }
    return emojis[material] || '●'
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">✨ Montador de Terços</h1>
          <p className="text-muted-foreground">Crie seu terço único e personalizado. Escolha cada detalhe!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Painel de Configuração */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nome do Terço */}
            <Card>
              <CardHeader>
                <CardTitle>Nome do Seu Terço</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={rosaryName}
                  onChange={(e) => setRosaryName(e.target.value)}
                  placeholder="Ex: Terço da Nossa Senhora"
                  className="bg-input text-foreground"
                />
              </CardContent>
            </Card>

            {/* Seleção de Contas */}
            <Card>
              <CardHeader>
                <CardTitle>Contas</CardTitle>
                <CardDescription>Personalize o tamanho, material e cor das contas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cor */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Cor</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {BEAD_OPTIONS.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{
                          backgroundColor: color.toLowerCase() === 'preto' ? '#000' :
                                          color.toLowerCase() === 'marrom' ? '#8B4513' :
                                          color.toLowerCase() === 'bege' ? '#F5DEB3' :
                                          color.toLowerCase() === 'dourado' ? '#FFD700' :
                                          color.toLowerCase() === 'prata' ? '#C0C0C0' :
                                          color.toLowerCase() === 'vermelho' ? '#DC143C' :
                                          color.toLowerCase() === 'azul' ? '#1E90FF' :
                                          color.toLowerCase() === 'verde' ? '#228B22' : '#888'
                        }}></div>
                        <span className="text-xs text-center block">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tamanho */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Tamanho das Contas</Label>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                    <div className="space-y-2">
                      {BEAD_OPTIONS.sizes.map(size => (
                        <div key={size.id} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer">
                          <RadioGroupItem value={size.id} id={size.id} />
                          <Label htmlFor={size.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{size.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">+ R$ {size.price.toFixed(2)}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Material */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Material</Label>
                  <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <div className="space-y-2">
                      {BEAD_OPTIONS.materials.map(material => (
                        <div key={material.id} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer">
                          <RadioGroupItem value={material.id} id={material.id} />
                          <Label htmlFor={material.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{material.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">+ R$ {material.price.toFixed(2)}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Quantidade */}
                <div>
                  <Label htmlFor="bead-count" className="text-base font-semibold mb-3 block">
                    Quantidade de Contas: <span className="text-primary">{beadCount}</span>
                  </Label>
                  <input
                    id="bead-count"
                    type="range"
                    min="30"
                    max="150"
                    step="10"
                    value={beadCount}
                    onChange={(e) => setBeadCount(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>30 (Curto)</span>
                    <span>150 (Longo)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peça Central */}
            <Card>
              <CardHeader>
                <CardTitle>Peça Central</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCenterPiece} onValueChange={setSelectedCenterPiece}>
                  <SelectTrigger className="bg-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BEAD_OPTIONS.centerPieces.map(piece => (
                      <SelectItem key={piece.id} value={piece.id}>
                        {piece.label} - R$ {piece.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Previsualização */}
          <div className="space-y-6">
            {/* Previsualização */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Previsualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary rounded-lg p-6 min-h-48 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4">✨</div>
                  <p className="font-serif font-bold text-foreground mb-4">{rosaryName}</p>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {Array(8).fill(0).map((_, i) => (
                      <span key={i} className="text-2xl">
                        {getBeadEmoji(selectedMaterial)}
                      </span>
                    ))}
                  </div>
                  <div className="text-3xl">✝️</div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo de Custo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Contas ({beadCount}x)</span>
                  <span className="font-medium">R$ {costBreakdown.beadCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Peça Central</span>
                  <span className="font-medium">R$ {costBreakdown.centerCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-muted-foreground">Fio + Montagem</span>
                  <span className="font-medium">R$ {costBreakdown.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2">
                  <span>Custo Total</span>
                  <span className="text-primary">R$ {costBreakdown.totalCost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Preço Final */}
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Preço Final</p>
                  <p className="text-4xl font-bold text-primary">R$ {costBreakdown.totalPrice.toFixed(2)}</p>
                  <Badge className="mt-3 bg-success text-success-foreground">
                    Economia: {(costBreakdown.totalPrice * 0.15).toFixed(0)}% vs pronto
                  </Badge>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base">
                  ✨ Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="border-accent bg-accent/20">
              <CardHeader>
                <CardTitle className="text-base">💡 Dica</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Combinações populares: Madeira + Dourado, Cristal + Prata, Vidro + Azul.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
