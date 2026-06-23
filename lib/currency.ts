// Utilitários de formatação de moeda e máscara para o Ateliê Sagrado

/** Formata número para exibição BRL: 1234.56 => "1.234,56" */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Formata somente o número sem símbolo: 1234.56 => "1.234,56" */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '0,00'
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Converte string mascarada "1.234,56" ou "1234,56" para número 1234.56 */
export function parseCurrency(value: string): number {
  if (!value) return 0
  // Remove tudo exceto dígitos e vírgula
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Máscara em tempo real para campo de moeda.
 * Recebe o valor bruto digitado e retorna a string formatada.
 * Ex: "1" => "0,01", "100" => "1,00", "123456" => "1.234,56"
 */
export function maskCurrencyInput(rawValue: string): string {
  // Remove tudo que não é dígito
  const digits = rawValue.replace(/\D/g, '')
  if (!digits) return ''
  // Converte para centavos
  const cents = parseInt(digits, 10)
  const reais = cents / 100
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Extrai o valor numérico de uma string com máscara: "1.234,56" => 1234.56 */
export function unmaskCurrency(masked: string): number {
  if (!masked) return 0
  // Remove separador de milhar (ponto) e troca vírgula por ponto
  const cleaned = masked.replace(/\./g, '').replace(',', '.')
  const val = parseFloat(cleaned)
  return isNaN(val) ? 0 : val
}

/** Calcula custo unitário a partir dos dados do pacote */
export function calcUnitCostFromPackage(
  packageCost: number,
  freightCost: number,
  packageQuantity: number
): number {
  if (!packageQuantity || packageQuantity <= 0) return 0
  const total = (packageCost || 0) + (freightCost || 0)
  return total / packageQuantity
}
