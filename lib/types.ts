// ===========================================
// TIPOS DO SISTEMA ATELIÊ SAGRADO
// ===========================================

// --- MATERIAIS E ESTOQUE ---

export type UnidadeCompra = 'gramas' | 'pacote' | 'unidade' | 'metros'
export type UnidadeUso = 'unidade'

export interface Material {
  id: string
  nome: string
  descricao?: string
  categoria: CategoriaMaterial
  unidadeCompra: UnidadeCompra
  unidadeUso: UnidadeUso
  // Conversão
  pesoCompra?: number // peso em gramas do pacote comprado
  quantidadeEstimada?: number // quantidade estimada de unidades no pacote
  relacaoConversao?: number // unidades por grama (calculado automaticamente)
  margemErro?: number // percentual de erro na conversão
  // Estoque
  quantidadeDisponivel: number // em unidades de uso
  estoqueMinimo: number
  // Custos
  precoCompra: number // preço do pacote/unidade de compra
  custoUnitario: number // custo por unidade de uso (calculado)
  // Metadados
  fornecedor?: string
  imagemUrl?: string
  criadoEm: Date
  atualizadoEm: Date
}

export type CategoriaMaterial = 
  | 'contas'
  | 'crucifixos'
  | 'entremeios'
  | 'fios'
  | 'acabamentos'
  | 'embalagens'
  | 'outros'

export interface MovimentacaoEstoque {
  id: string
  materialId: string
  tipo: 'entrada' | 'saida' | 'ajuste'
  quantidade: number
  motivoSaida?: 'producao' | 'perda' | 'ajuste'
  pedidoId?: string
  observacao?: string
  data: Date
}

// --- PRODUTOS ---

export interface ComponenteProduto {
  materialId: string
  material?: Material
  quantidade: number
  obrigatorio: boolean
  opcoes?: string[] // IDs de materiais alternativos
}

export interface Produto {
  id: string
  nome: string
  descricao?: string
  categoria: CategoriaProduto
  componentes: ComponenteProduto[]
  // Custos calculados
  custoMateriais: number
  custoMaoDeObra: number
  custosIndiretos: number
  custoTotal: number
  // Precificação
  margemLucro: number
  precoSugerido: number
  precoVenda: number
  precoOverride?: boolean
  // Produção
  tempoProducaoMinutos: number
  // Metadados
  ativo: boolean
  imagemUrl?: string
  criadoEm: Date
  atualizadoEm: Date
}

export type CategoriaProduto = 
  | 'terco'
  | 'rosario'
  | 'pulseira'
  | 'dezena'
  | 'outros'

// --- PRECIFICAÇÃO ---

export interface ConfiguracaoPrecificacao {
  valorHoraTrabalho: number
  margemMinima: number
  margemIdeal: number
  percentualPerda: number
  // Custos indiretos
  custoEmbalagem: number
  custoEnergia: number
  custoFerramentas: number
  custoOperacional: number
  // Taxas
  taxaPix: number
  taxaCartao: number
  taxaMarketplace: number
}

// --- ORÇAMENTOS ---

export type StatusOrcamento = 'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'expirado'

export interface ItemOrcamento {
  produtoId?: string
  produto?: Produto
  descricao: string
  quantidade: number
  precoUnitario: number
  precoTotal: number
  personalizacao?: Record<string, string>
}

export interface Orcamento {
  id: string
  clienteId: string
  cliente?: Cliente
  itens: ItemOrcamento[]
  // Valores (congelados no momento da criação)
  subtotal: number
  desconto: number
  taxaEntrega: number
  total: number
  // Status
  status: StatusOrcamento
  validadeAte: Date
  // Metadados
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
}

// --- PEDIDOS ---

export type StatusPedido = 
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_producao'
  | 'pronto'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export interface ItemPedido {
  produtoId?: string
  produto?: Produto
  descricao: string
  quantidade: number
  precoUnitario: number
  precoTotal: number
  personalizacao?: Record<string, string>
  // Produção
  produzido: number
}

export interface Pedido {
  id: string
  numero: string
  orcamentoId?: string
  clienteId: string
  cliente?: Cliente
  itens: ItemPedido[]
  // Valores
  subtotal: number
  desconto: number
  taxaEntrega: number
  total: number
  // Status
  status: StatusPedido
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  prazoEntrega?: Date
  // Pagamento
  formaPagamento?: 'pix' | 'cartao' | 'boleto' | 'dinheiro'
  pago: boolean
  dataPagamento?: Date
  // Envio
  enderecoEntrega?: Endereco
  codigoRastreio?: string
  dataEnvio?: Date
  dataEntrega?: Date
  // Metadados
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
}

// --- PRODUÇÃO ---

export interface ItemProducao {
  pedidoId: string
  pedido?: Pedido
  itemIndex: number
  quantidadeTotal: number
  quantidadeProduzida: number
  status: 'pendente' | 'em_andamento' | 'bloqueado' | 'concluido'
  motivoBloqueio?: string
  prioridade: number
  prazo?: Date
}

// --- CLIENTES ---

export interface Endereco {
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone?: string
  cpfCnpj?: string
  endereco?: Endereco
  // Estatísticas
  totalPedidos: number
  totalGasto: number
  ultimoPedido?: Date
  // Metadados
  observacoes?: string
  criadoEm: Date
  atualizadoEm: Date
}

// --- FINANCEIRO ---

export type TipoTransacao = 'receita' | 'despesa'
export type CategoriaTransacao = 
  | 'venda'
  | 'compra_material'
  | 'custo_operacional'
  | 'taxa'
  | 'outros'

export interface Transacao {
  id: string
  tipo: TipoTransacao
  categoria: CategoriaTransacao
  descricao: string
  valor: number
  pedidoId?: string
  data: Date
  criadoEm: Date
}

// --- DASHBOARD / INSIGHTS ---

export interface AlertaSistema {
  id: string
  tipo: 'estoque_baixo' | 'pedido_atrasado' | 'margem_baixa' | 'producao_bloqueada'
  severidade: 'info' | 'warning' | 'error'
  titulo: string
  mensagem: string
  materialId?: string
  pedidoId?: string
  produtoId?: string
  lido: boolean
  criadoEm: Date
}

export interface KPIDashboard {
  pedidosAtivos: number
  itensEstoqueBaixo: number
  receitaMensal: number
  margemLucroMedia: number
  variacaoReceita: number
  variacaoMargem: number
}

// --- MONTADOR DE TERÇOS (CLIENTE) ---

export interface OpcaoMontador {
  id: string
  materialId: string
  material: Material
  disponivel: boolean
  quantidadeDisponivel: number
}

export interface EtapaMontador {
  id: string
  nome: string
  descricao: string
  tipo: 'conta' | 'tamanho' | 'entremeio' | 'crucifixo' | 'montagem'
  opcoes: OpcaoMontador[]
}

export interface ConfiguracaoTerco {
  tipoConta?: string
  tamanho?: '6mm' | '8mm'
  entremeio?: string
  crucifixo?: string
  tipoMontagem?: 'fio' | 'corrente'
  corFio?: string
}
