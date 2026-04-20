'use client'

import { useState } from 'react'
import {
  Calculator,
  DollarSign,
  Clock,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Package,
  Settings,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { produtos, configuracaoPrecificacao } from '@/lib/mock-data'
import type { Produto } from '@/lib/types'

function CustoBreakdown({ produto }: { produto: Produto }) {
  const custoMaoDeObra = (produto.tempoProducaoMinutos / 60) * configuracaoPrecificacao.valorHoraTrabalho
  const custosIndiretos =
    configuracaoPrecificacao.custoEmbalagem +
    configuracaoPrecificacao.custoEnergia +
    configuracaoPrecificacao.custoFerramentas +
    configuracaoPrecificacao.custoOperacional

  const custoComPerda = produto.custoMateriais * (1 + configuracaoPrecificacao.percentualPerda / 100)
  const custoTotal = custoComPerda + custoMaoDeObra + custosIndiretos

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Custo de Materiais</span>
          <span>{produto.custoMateriais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">+ Perda ({configuracaoPrecificacao.percentualPerda}%)</span>
          <span>
            {(produto.custoMateriais * (configuracaoPrecificacao.percentualPerda / 100)).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Mão de Obra ({produto.tempoProducaoMinutos}min x R${configuracaoPrecificacao.valorHoraTrabalho}/h)
          </span>
          <span>{custoMaoDeObra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Embalagem</span>
          <span>
            {configuracaoPrecificacao.custoEmbalagem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Energia</span>
          <span>
            {configuracaoPrecificacao.custoEnergia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Ferramentas</span>
          <span>
            {configuracaoPrecificacao.custoFerramentas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Operacional</span>
          <span>
            {configuracaoPrecificacao.custoOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between font-medium">
          <span>Custo Total Real</span>
          <span className="text-primary">
            {custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>
    </div>
  )
}

function PrecificacaoCalculator({ produto }: { produto: Produto }) {
  const [margem, setMargem] = useState(produto.margemLucro)
  const [precoManual, setPrecoManual] = useState<number | null>(null)

  const custoMaoDeObra = (produto.tempoProducaoMinutos / 60) * configuracaoPrecificacao.valorHoraTrabalho
  const custosIndiretos =
    configuracaoPrecificacao.custoEmbalagem +
    configuracaoPrecificacao.custoEnergia +
    configuracaoPrecificacao.custoFerramentas +
    configuracaoPrecificacao.custoOperacional

  const custoComPerda = produto.custoMateriais * (1 + configuracaoPrecificacao.percentualPerda / 100)
  const custoTotal = custoComPerda + custoMaoDeObra + custosIndiretos

  const precoCalculado = custoTotal * (1 + margem / 100)
  const precoFinal = precoManual || precoCalculado
  const margemReal = ((precoFinal - custoTotal) / precoFinal) * 100
  const lucroLiquido = precoFinal - custoTotal

  const statusMargem =
    margemReal < configuracaoPrecificacao.margemMinima
      ? 'baixa'
      : margemReal >= configuracaoPrecificacao.margemIdeal
        ? 'saudavel'
        : 'moderada'

  return (
    <div className="space-y-6">
      {/* Slider de Margem */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Margem de Lucro Desejada</Label>
          <span className="text-2xl font-bold text-primary">{margem}%</span>
        </div>
        <Slider
          value={[margem]}
          onValueChange={(value) => {
            setMargem(value[0])
            setPrecoManual(null)
          }}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className="text-destructive">Mínimo: {configuracaoPrecificacao.margemMinima}%</span>
          <span className="text-success">Ideal: {configuracaoPrecificacao.margemIdeal}%</span>
          <span>100%</span>
        </div>
      </div>

      <Separator />

      {/* Preço Sugerido */}
      <div className="rounded-xl bg-muted/50 p-4">
        <div className="mb-3 text-sm text-muted-foreground">Preço Sugerido</div>
        <div className="text-3xl font-bold text-primary">
          {precoCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>

      {/* Preço Manual */}
      <div className="space-y-2">
        <Label>Preço Manual (Override)</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <Input
              type="number"
              step="0.01"
              className="pl-10"
              placeholder={precoCalculado.toFixed(2)}
              value={precoManual || ''}
              onChange={(e) => setPrecoManual(e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
          {precoManual && (
            <Button variant="outline" onClick={() => setPrecoManual(null)}>
              Limpar
            </Button>
          )}
        </div>
        {precoManual && precoManual < custoTotal && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="size-4" />
            Atenção: O preço está abaixo do custo!
          </div>
        )}
      </div>

      <Separator />

      {/* Resultado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Preço Final</span>
          <span className="text-2xl font-bold">
            {precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="mb-1 text-sm text-muted-foreground">Margem Real</div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xl font-bold',
                  statusMargem === 'saudavel' && 'text-success',
                  statusMargem === 'baixa' && 'text-destructive',
                  statusMargem === 'moderada' && 'text-warning'
                )}
              >
                {margemReal.toFixed(1)}%
              </span>
              {statusMargem === 'saudavel' && <CheckCircle2 className="size-5 text-success" />}
              {statusMargem === 'baixa' && <AlertTriangle className="size-5 text-destructive" />}
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-1 text-sm text-muted-foreground">Lucro Líquido</div>
            <span
              className={cn('text-xl font-bold', lucroLiquido >= 0 ? 'text-success' : 'text-destructive')}
            >
              {lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Alertas */}
        {statusMargem === 'baixa' && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
            <AlertTriangle className="mt-0.5 size-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Margem Baixa</p>
              <p className="text-sm text-muted-foreground">
                A margem está abaixo do mínimo recomendado de {configuracaoPrecificacao.margemMinima}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botão Salvar */}
      <Button className="w-full">
        <Save className="mr-2 size-4" />
        Salvar Precificação
      </Button>
    </div>
  )
}

function ConfiguracaoTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Clock className="size-5" />
            Mão de Obra
          </CardTitle>
          <CardDescription>Configurações de valor hora e tempo de produção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Valor da Hora de Trabalho (R$)</Label>
            <Input type="number" step="0.01" defaultValue={configuracaoPrecificacao.valorHoraTrabalho} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <DollarSign className="size-5" />
            Custos Indiretos
          </CardTitle>
          <CardDescription>Custos fixos aplicados por produto</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Embalagem (R$)</Label>
            <Input type="number" step="0.01" defaultValue={configuracaoPrecificacao.custoEmbalagem} />
          </div>
          <div className="grid gap-2">
            <Label>Energia (R$)</Label>
            <Input type="number" step="0.01" defaultValue={configuracaoPrecificacao.custoEnergia} />
          </div>
          <div className="grid gap-2">
            <Label>Ferramentas (R$)</Label>
            <Input type="number" step="0.01" defaultValue={configuracaoPrecificacao.custoFerramentas} />
          </div>
          <div className="grid gap-2">
            <Label>Operacional (R$)</Label>
            <Input type="number" step="0.01" defaultValue={configuracaoPrecificacao.custoOperacional} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Percent className="size-5" />
            Margens e Taxas
          </CardTitle>
          <CardDescription>Configurações de margem e perdas</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Margem Mínima (%)</Label>
            <Input type="number" defaultValue={configuracaoPrecificacao.margemMinima} />
          </div>
          <div className="grid gap-2">
            <Label>Margem Ideal (%)</Label>
            <Input type="number" defaultValue={configuracaoPrecificacao.margemIdeal} />
          </div>
          <div className="grid gap-2">
            <Label>Percentual de Perda (%)</Label>
            <Input type="number" step="0.1" defaultValue={configuracaoPrecificacao.percentualPerda} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Calculator className="size-5" />
            Taxas de Venda
          </CardTitle>
          <CardDescription>Taxas aplicadas por método de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Taxa Pix (%)</Label>
            <Input type="number" step="0.1" defaultValue={configuracaoPrecificacao.taxaPix} />
          </div>
          <div className="grid gap-2">
            <Label>Taxa Cartão (%)</Label>
            <Input type="number" step="0.1" defaultValue={configuracaoPrecificacao.taxaCartao} />
          </div>
          <div className="grid gap-2">
            <Label>Taxa Marketplace (%)</Label>
            <Input type="number" step="0.1" defaultValue={configuracaoPrecificacao.taxaMarketplace} />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full">
        <Save className="mr-2 size-4" />
        Salvar Configurações
      </Button>
    </div>
  )
}

export default function PrecificacaoPage() {
  const [selectedProduto, setSelectedProduto] = useState<Produto>(produtos[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Precificação</h1>
        <p className="text-muted-foreground">Calcule preços e gerencie margens de lucro</p>
      </div>

      <Tabs defaultValue="calcular" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calcular">Calcular Preço</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="calcular" className="space-y-6">
          {/* Seleção de Produto */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Selecionar Produto</CardTitle>
              <CardDescription>Escolha um produto para calcular a precificação</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedProduto.id}
                onValueChange={(value) => setSelectedProduto(produtos.find((p) => p.id === value) || produtos[0])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      <div className="flex items-center gap-2">
                        <Package className="size-4" />
                        <span>{produto.nome}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {produto.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Calculadora */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Breakdown de Custos */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Composição de Custos</CardTitle>
                <CardDescription>Detalhamento do custo do produto</CardDescription>
              </CardHeader>
              <CardContent>
                <CustoBreakdown produto={selectedProduto} />
              </CardContent>
            </Card>

            {/* Calculadora de Preço */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Calculadora de Preço</CardTitle>
                <CardDescription>Defina a margem e calcule o preço de venda</CardDescription>
              </CardHeader>
              <CardContent>
                <PrecificacaoCalculator produto={selectedProduto} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracoes">
          <ConfiguracaoTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
