'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { materiais, configuracaoPrecificacao } from '@/lib/mock-data'

// Dados do montador
const etapasMontador = [
  {
    id: 'tipo-conta',
    nome: 'Tipo de Conta',
    descricao: 'Escolha o material das contas do seu terço',
  },
  {
    id: 'tamanho',
    nome: 'Tamanho',
    descricao: 'Escolha o tamanho das contas',
  },
  {
    id: 'entremeio',
    nome: 'Entremeio',
    descricao: 'Escolha a medalha central do terço',
  },
  {
    id: 'crucifixo',
    nome: 'Crucifixo',
    descricao: 'Escolha o crucifixo que finalizará o terço',
  },
  {
    id: 'montagem',
    nome: 'Montagem',
    descricao: 'Escolha o tipo de fio ou corrente',
  },
]

// Opções por etapa
const opcoesPorEtapa: Record<string, Array<{
  id: string
  nome: string
  descricao: string
  preco: number
  materialId: string
  disponivel: boolean
  quantidadeDisponivel: number
}>> = {
  'tipo-conta': [
    { id: 'cristal', nome: 'Cristal', descricao: 'Brilho e elegância', preco: 25, materialId: 'mat-001', disponivel: true, quantidadeDisponivel: 450 },
    { id: 'perola', nome: 'Pérola', descricao: 'Delicadeza e sofisticação', preco: 15, materialId: 'mat-003', disponivel: true, quantidadeDisponivel: 320 },
    { id: 'cristal-azul', nome: 'Cristal Azul', descricao: 'Cor vibrante e marcante', preco: 30, materialId: 'mat-002', disponivel: true, quantidadeDisponivel: 180 },
  ],
  'tamanho': [
    { id: '6mm', nome: '6mm', descricao: 'Tamanho clássico, delicado', preco: 0, materialId: '', disponivel: true, quantidadeDisponivel: 999 },
    { id: '8mm', nome: '8mm', descricao: 'Tamanho maior, mais presença', preco: 5, materialId: '', disponivel: true, quantidadeDisponivel: 999 },
  ],
  'entremeio': [
    { id: 'ns-ouro-velho', nome: 'Nossa Senhora', descricao: 'Acabamento ouro velho', preco: 3.5, materialId: 'mat-006', disponivel: true, quantidadeDisponivel: 52 },
    { id: 'divino-prata', nome: 'Divino Espírito Santo', descricao: 'Acabamento prata', preco: 3.8, materialId: 'mat-007', disponivel: false, quantidadeDisponivel: 18 },
  ],
  'crucifixo': [
    { id: 'ouro-velho-medio', nome: 'Ouro Velho Médio', descricao: 'Crucifixo clássico', preco: 4.5, materialId: 'mat-004', disponivel: true, quantidadeDisponivel: 45 },
    { id: 'prata-grande', nome: 'Prata Grande', descricao: 'Crucifixo imponente', preco: 6, materialId: 'mat-005', disponivel: true, quantidadeDisponivel: 28 },
  ],
  'montagem': [
    { id: 'fio-encerado-preto', nome: 'Fio Encerado Preto', descricao: 'Tradicional e resistente', preco: 0.15, materialId: 'mat-008', disponivel: true, quantidadeDisponivel: 85 },
    { id: 'fio-nylon', nome: 'Fio de Nylon', descricao: 'Discreto e durável', preco: 0.16, materialId: 'mat-009', disponivel: true, quantidadeDisponivel: 120 },
  ],
}

type Selecoes = Record<string, string>

function OpcaoCard({
  opcao,
  selecionada,
  onSelect,
}: {
  opcao: typeof opcoesPorEtapa['tipo-conta'][0]
  selecionada: boolean
  onSelect: () => void
}) {
  const indisponivel = !opcao.disponivel

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all',
        selecionada && 'ring-2 ring-primary border-primary',
        indisponivel && 'opacity-50 cursor-not-allowed',
        !indisponivel && !selecionada && 'hover:border-primary/50 hover:shadow-md'
      )}
      onClick={() => !indisponivel && onSelect()}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{opcao.nome}</h4>
              {indisponivel && (
                <Badge variant="destructive" className="text-xs">
                  Sem estoque
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{opcao.descricao}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {selecionada && (
              <div className="flex size-6 items-center justify-center rounded-full bg-primary">
                <Check className="size-4 text-primary-foreground" />
              </div>
            )}
            <span className="text-sm font-medium text-primary">
              +{opcao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewTerco({ selecoes }: { selecoes: Selecoes }) {
  const tipoConta = opcoesPorEtapa['tipo-conta'].find(o => o.id === selecoes['tipo-conta'])
  const tamanho = opcoesPorEtapa['tamanho'].find(o => o.id === selecoes['tamanho'])
  const entremeio = opcoesPorEtapa['entremeio'].find(o => o.id === selecoes['entremeio'])
  const crucifixo = opcoesPorEtapa['crucifixo'].find(o => o.id === selecoes['crucifixo'])
  const montagem = opcoesPorEtapa['montagem'].find(o => o.id === selecoes['montagem'])

  const cores: Record<string, string> = {
    'cristal': 'bg-gradient-to-br from-slate-100 to-slate-200',
    'perola': 'bg-gradient-to-br from-amber-50 to-amber-100',
    'cristal-azul': 'bg-gradient-to-br from-blue-300 to-blue-400',
  }

  const corConta = cores[selecoes['tipo-conta']] || 'bg-muted'
  const tamanhoConta = selecoes['tamanho'] === '8mm' ? 'size-4' : 'size-3'

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-muted/50 p-8">
      <div className="relative flex flex-col items-center">
        {/* Representação visual simplificada do terço */}
        <div className="flex flex-col items-center gap-1">
          {/* Crucifixo */}
          {crucifixo && (
            <div className="mb-2 flex size-8 items-center justify-center rounded bg-gradient-to-b from-amber-600 to-amber-800 text-amber-100 shadow-md">
              <span className="text-xs font-bold">+</span>
            </div>
          )}
          
          {/* Fio inicial */}
          <div className="h-4 w-0.5 bg-foreground/20" />
          
          {/* Contas representativas */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={cn('rounded-full shadow-sm', corConta, tamanhoConta)} />
            ))}
          </div>
          
          <div className="h-2 w-0.5 bg-foreground/20" />
          
          {/* Entremeio */}
          {entremeio && (
            <div className="my-1 flex size-6 items-center justify-center rounded-full bg-gradient-to-b from-amber-500 to-amber-700 shadow-md">
              <span className="text-[8px] text-amber-100">M</span>
            </div>
          )}
          
          <div className="h-2 w-0.5 bg-foreground/20" />
          
          {/* Mais contas */}
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-32">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={cn('rounded-full shadow-sm', corConta, tamanhoConta)} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Resumo das seleções */}
      <div className="mt-4 space-y-1 text-center text-sm">
        {tipoConta && <p><span className="text-muted-foreground">Contas:</span> {tipoConta.nome}</p>}
        {tamanho && <p><span className="text-muted-foreground">Tamanho:</span> {tamanho.nome}</p>}
        {entremeio && <p><span className="text-muted-foreground">Entremeio:</span> {entremeio.nome}</p>}
        {crucifixo && <p><span className="text-muted-foreground">Crucifixo:</span> {crucifixo.nome}</p>}
        {montagem && <p><span className="text-muted-foreground">Fio:</span> {montagem.nome}</p>}
      </div>
    </div>
  )
}

export default function MontadorPage() {
  const [etapaAtual, setEtapaAtual] = useState(0)
  const [selecoes, setSelecoes] = useState<Selecoes>({})
  
  const etapa = etapasMontador[etapaAtual]
  const opcoes = opcoesPorEtapa[etapa.id] || []
  const selecaoAtual = selecoes[etapa.id]
  
  const progresso = ((etapaAtual + 1) / etapasMontador.length) * 100
  const podeContinuar = !!selecaoAtual
  const ultimaEtapa = etapaAtual === etapasMontador.length - 1
  
  // Calcular preço total
  const precoTotal = useMemo(() => {
    let total = 0
    
    // Custo das contas (59 unidades)
    const tipoConta = opcoesPorEtapa['tipo-conta'].find(o => o.id === selecoes['tipo-conta'])
    if (tipoConta) total += tipoConta.preco
    
    // Adicional de tamanho
    const tamanho = opcoesPorEtapa['tamanho'].find(o => o.id === selecoes['tamanho'])
    if (tamanho) total += tamanho.preco
    
    // Entremeio
    const entremeio = opcoesPorEtapa['entremeio'].find(o => o.id === selecoes['entremeio'])
    if (entremeio) total += entremeio.preco
    
    // Crucifixo
    const crucifixo = opcoesPorEtapa['crucifixo'].find(o => o.id === selecoes['crucifixo'])
    if (crucifixo) total += crucifixo.preco
    
    // Montagem
    const montagem = opcoesPorEtapa['montagem'].find(o => o.id === selecoes['montagem'])
    if (montagem) total += montagem.preco
    
    // Adicionar mão de obra (20 min)
    const maoDeObra = (20 / 60) * configuracaoPrecificacao.valorHoraTrabalho
    total += maoDeObra
    
    // Custos indiretos
    const custosIndiretos = configuracaoPrecificacao.custoEmbalagem + 
                           configuracaoPrecificacao.custoEnergia + 
                           configuracaoPrecificacao.custoFerramentas + 
                           configuracaoPrecificacao.custoOperacional
    total += custosIndiretos
    
    // Margem de lucro
    total = total * (1 + configuracaoPrecificacao.margemIdeal / 100)
    
    return total
  }, [selecoes])
  
  const handleSelect = (opcaoId: string) => {
    setSelecoes(prev => ({ ...prev, [etapa.id]: opcaoId }))
  }
  
  const handleProximo = () => {
    if (etapaAtual < etapasMontador.length - 1) {
      setEtapaAtual(prev => prev + 1)
    }
  }
  
  const handleAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(prev => prev - 1)
    }
  }
  
  const todasSelecoesFeitas = etapasMontador.every(e => selecoes[e.id])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/loja">
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-serif text-2xl font-bold">Monte seu Terço</h1>
              <p className="text-sm text-muted-foreground">
                Personalize cada detalhe do seu terço
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Etapa {etapaAtual + 1} de {etapasMontador.length}
              </span>
              <span className="font-medium">{etapa.nome}</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>
          
          {/* Etapas */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {etapasMontador.map((e, index) => (
              <button
                key={e.id}
                onClick={() => index <= etapaAtual && setEtapaAtual(index)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                  index === etapaAtual && 'bg-primary text-primary-foreground',
                  index < etapaAtual && 'bg-success/10 text-success',
                  index > etapaAtual && 'bg-muted text-muted-foreground',
                  index <= etapaAtual && 'cursor-pointer',
                  index > etapaAtual && 'cursor-not-allowed'
                )}
              >
                {index < etapaAtual && selecoes[e.id] ? (
                  <Check className="size-4" />
                ) : (
                  <span className="flex size-5 items-center justify-center rounded-full bg-current/20 text-xs">
                    {index + 1}
                  </span>
                )}
                {e.nome}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Opções */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">{etapa.nome}</CardTitle>
                <CardDescription>{etapa.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {opcoes.map(opcao => (
                  <OpcaoCard
                    key={opcao.id}
                    opcao={opcao}
                    selecionada={selecaoAtual === opcao.id}
                    onSelect={() => handleSelect(opcao.id)}
                  />
                ))}
              </CardContent>
            </Card>
            
            {/* Navegação */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleAnterior}
                disabled={etapaAtual === 0}
              >
                <ChevronLeft className="mr-2 size-4" />
                Anterior
              </Button>
              
              {ultimaEtapa ? (
                <Button
                  disabled={!todasSelecoesFeitas}
                  size="lg"
                >
                  <ShoppingCart className="mr-2 size-4" />
                  Adicionar ao Carrinho
                </Button>
              ) : (
                <Button
                  onClick={handleProximo}
                  disabled={!podeContinuar}
                >
                  Próximo
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Preview e Preço */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Sparkles className="size-5 text-primary" />
                  Seu Terço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PreviewTerco selecoes={selecoes} />
              </CardContent>
            </Card>
            
            {/* Preço */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Preço estimado</p>
                  <p className="mt-1 font-serif text-4xl font-bold text-primary">
                    {precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Inclui materiais, mão de obra e embalagem
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Aviso de estoque */}
            {Object.values(selecoes).some(id => {
              for (const opts of Object.values(opcoesPorEtapa)) {
                const opt = opts.find(o => o.id === id)
                if (opt && !opt.disponivel) return true
              }
              return false
            }) && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex items-start gap-3 p-4">
                  <AlertCircle className="mt-0.5 size-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Atenção</p>
                    <p className="text-sm text-muted-foreground">
                      Alguns itens selecionados estão com estoque baixo ou indisponíveis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
