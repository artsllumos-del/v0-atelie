'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import {
  Settings,
  Store,
  Bell,
  Database,
  Save,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { CurrencyInput } from '@/components/ui/currency-input'
import { toast } from 'sonner'
import { getAllSettings, saveSetting } from '@/lib/supabase/settings'
import { unmaskCurrency } from '@/lib/currency'

type LojaConfig = {
  nome: string
  descricao: string
  email: string
  telefone: string
  endereco: string
  cnpj: string
  instagram: string
  whatsapp: string
}

type SistemaConfig = {
  alertas_estoque: boolean
  bloquear_sem_estoque: boolean
  margem_minima: number
  pro_labore: number
  despesas_fixas: number
}

type PrecificacaoConfig = {
  margem_lucro: number
  custo_hora_trabalho: number
  tempo_medio_producao: number
  frete_percentual: number
}

type NotificacoesConfig = {
  novos_pedidos: boolean
  estoque_critico: boolean
  prazos: boolean
  margem_baixa: boolean
  email: boolean
  sistema: boolean
}

const defaultLoja: LojaConfig = {
  nome: 'Ateliê Sagrado',
  descricao: 'Terços artesanais feitos com amor, fé e dedicação.',
  email: 'contato@ateliesagrado.com.br',
  telefone: '(11) 99999-9999',
  endereco: 'São Paulo, SP',
  cnpj: '',
  instagram: '',
  whatsapp: '',
}

const defaultSistema: SistemaConfig = {
  alertas_estoque: true,
  bloquear_sem_estoque: true,
  margem_minima: 30,
  pro_labore: 2000,
  despesas_fixas: 500,
}

const defaultPrecificacao: PrecificacaoConfig = {
  margem_lucro: 40,
  custo_hora_trabalho: 25,
  tempo_medio_producao: 2,
  frete_percentual: 10,
}

const defaultNotificacoes: NotificacoesConfig = {
  novos_pedidos: true,
  estoque_critico: true,
  prazos: true,
  margem_baixa: true,
  email: true,
  sistema: true,
}

function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <Button onClick={onClick} disabled={loading} size="sm">
        {loading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Save className="mr-2 size-4" />
        )}
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const { data: allSettings, mutate } = useSWR('settings-all', getAllSettings, {
    revalidateOnFocus: false,
  })

  const [loja, setLoja] = useState<LojaConfig>(defaultLoja)
  const [sistema, setSistema] = useState<SistemaConfig>(defaultSistema)
  const [precificacao, setPrecificacao] = useState<PrecificacaoConfig>(defaultPrecificacao)
  const [notificacoes, setNotificacoes] = useState<NotificacoesConfig>(defaultNotificacoes)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (!allSettings) return
    if (allSettings.loja) setLoja({ ...defaultLoja, ...(allSettings.loja as Partial<LojaConfig>) })
    if (allSettings.sistema) setSistema({ ...defaultSistema, ...(allSettings.sistema as Partial<SistemaConfig>) })
    if (allSettings.precificacao) setPrecificacao({ ...defaultPrecificacao, ...(allSettings.precificacao as Partial<PrecificacaoConfig>) })
    if (allSettings.notificacoes) setNotificacoes({ ...defaultNotificacoes, ...(allSettings.notificacoes as Partial<NotificacoesConfig>) })
  }, [allSettings])

  async function handleSave(key: 'loja' | 'sistema' | 'precificacao' | 'notificacoes', data: unknown) {
    setSaving(key)
    try {
      await saveSetting(key, data as Record<string, unknown>)
      await mutate()
      toast.success('Configurações salvas com sucesso!')
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Personalize e configure o sistema do ateliê</p>
      </div>

      <Tabs defaultValue="loja" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="loja" className="flex items-center gap-2">
            <Store className="size-4" />
            <span className="hidden sm:inline">Loja</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Database className="size-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="precificacao" className="flex items-center gap-2">
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">Preços</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="size-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
        </TabsList>

        {/* === LOJA === */}
        <TabsContent value="loja" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Store className="size-5" />
                Informações da Loja
              </CardTitle>
              <CardDescription>Dados básicos do seu ateliê exibidos para os clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Nome da Loja</Label>
                <Input
                  value={loja.nome}
                  onChange={(e) => setLoja({ ...loja, nome: e.target.value })}
                  placeholder="Ateliê Sagrado"
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea
                  value={loja.descricao}
                  onChange={(e) => setLoja({ ...loja, descricao: e.target.value })}
                  rows={3}
                  placeholder="Describe seu ateliê..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={loja.email}
                    onChange={(e) => setLoja({ ...loja, email: e.target.value })}
                    placeholder="contato@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={loja.telefone}
                    onChange={(e) => setLoja({ ...loja, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={loja.whatsapp}
                    onChange={(e) => setLoja({ ...loja, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Instagram</Label>
                  <Input
                    value={loja.instagram}
                    onChange={(e) => setLoja({ ...loja, instagram: e.target.value })}
                    placeholder="@ateliesagrado"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Endereço</Label>
                  <Input
                    value={loja.endereco}
                    onChange={(e) => setLoja({ ...loja, endereco: e.target.value })}
                    placeholder="São Paulo, SP"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>CNPJ</Label>
                  <Input
                    value={loja.cnpj}
                    onChange={(e) => setLoja({ ...loja, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <SaveButton
                onClick={() => handleSave('loja', loja)}
                loading={saving === 'loja'}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SISTEMA === */}
        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Database className="size-5" />
                Configurações de Estoque
              </CardTitle>
              <CardDescription>Defina alertas e comportamentos do controle de estoque</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas de Estoque Baixo</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando o estoque estiver baixo
                  </p>
                </div>
                <Switch
                  checked={sistema.alertas_estoque}
                  onCheckedChange={(v) => setSistema({ ...sistema, alertas_estoque: v })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Bloquear Produção Sem Estoque</Label>
                  <p className="text-sm text-muted-foreground">
                    Impede criar ordens de produção se não houver materiais suficientes
                  </p>
                </div>
                <Switch
                  checked={sistema.bloquear_sem_estoque}
                  onCheckedChange={(v) => setSistema({ ...sistema, bloquear_sem_estoque: v })}
                />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Margem Mínima Aceitável (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={sistema.margem_minima}
                  onChange={(e) => setSistema({ ...sistema, margem_minima: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Produtos abaixo desta margem receberão alertas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Pró-labore Mensal (R$)</Label>
                  <CurrencyInput
                    value={sistema.pro_labore}
                    onValueChange={(num) => setSistema({ ...sistema, pro_labore: num })}
                    placeholder="0,00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Despesas Fixas Mensais (R$)</Label>
                  <CurrencyInput
                    value={sistema.despesas_fixas}
                    onValueChange={(num) => setSistema({ ...sistema, despesas_fixas: num })}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <SaveButton
                onClick={() => handleSave('sistema', sistema)}
                loading={saving === 'sistema'}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* === PRECIFICAÇÃO === */}
        <TabsContent value="precificacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <TrendingUp className="size-5" />
                Regras de Precificação
              </CardTitle>
              <CardDescription>Parâmetros usados na calculadora de preço de venda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Margem de Lucro Padrão (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={500}
                    step={0.5}
                    value={precificacao.margem_lucro}
                    onChange={(e) =>
                      setPrecificacao({ ...precificacao, margem_lucro: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Custo/Hora de Trabalho (R$)</Label>
                  <CurrencyInput
                    value={precificacao.custo_hora_trabalho}
                    onValueChange={(num) =>
                      setPrecificacao({ ...precificacao, custo_hora_trabalho: num })
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tempo Médio de Produção (horas)</Label>
                  <Input
                    type="number"
                    min={0.1}
                    step={0.25}
                    value={precificacao.tempo_medio_producao}
                    onChange={(e) =>
                      setPrecificacao({ ...precificacao, tempo_medio_producao: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Percentual de Frete (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={precificacao.frete_percentual}
                    onChange={(e) =>
                      setPrecificacao({ ...precificacao, frete_percentual: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              {/* Preview do cálculo */}
              {(() => {
                const custoMateriais = 10 // exemplo
                const maoDeObra = precificacao.custo_hora_trabalho * precificacao.tempo_medio_producao
                const total = custoMateriais + maoDeObra
                const precoVenda = total * (1 + precificacao.margem_lucro / 100)
                return (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Simulação (com R$ 10,00 em materiais)
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Mão de Obra</p>
                        <p className="font-medium">
                          R$ {maoDeObra.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Custo Total</p>
                        <p className="font-medium">R$ {total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Preço Sugerido</p>
                        <p className="font-bold text-primary text-base">
                          R$ {precoVenda.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <SaveButton
                onClick={() => handleSave('precificacao', precificacao)}
                loading={saving === 'precificacao'}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* === NOTIFICAÇÕES === */}
        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Bell className="size-5" />
                Alertas e Notificações
              </CardTitle>
              <CardDescription>Escolha quando e como receber alertas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'novos_pedidos' as const,
                  label: 'Novos Pedidos',
                  desc: 'Alerta ao receber um novo pedido',
                },
                {
                  key: 'estoque_critico' as const,
                  label: 'Estoque Crítico',
                  desc: 'Alerta quando um material zerar o estoque',
                },
                {
                  key: 'prazos' as const,
                  label: 'Prazos se Aproximando',
                  desc: 'Lembrete de pedidos com prazo próximo',
                },
                {
                  key: 'margem_baixa' as const,
                  label: 'Margem Abaixo do Mínimo',
                  desc: 'Alerta quando a margem cair abaixo do configurado',
                },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={notificacoes[key]}
                    onCheckedChange={(v) => setNotificacoes({ ...notificacoes, [key]: v })}
                  />
                </div>
              ))}

              <Separator />
              <p className="text-sm font-medium">Canais de Notificação</p>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">E-mail</Label>
                  <p className="text-sm text-muted-foreground">Receber alertas por e-mail</p>
                </div>
                <Switch
                  checked={notificacoes.email}
                  onCheckedChange={(v) => setNotificacoes({ ...notificacoes, email: v })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificação no Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar alertas dentro do painel de administração
                  </p>
                </div>
                <Switch
                  checked={notificacoes.sistema}
                  onCheckedChange={(v) => setNotificacoes({ ...notificacoes, sistema: v })}
                />
              </div>

              <SaveButton
                onClick={() => handleSave('notificacoes', notificacoes)}
                loading={saving === 'notificacoes'}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
