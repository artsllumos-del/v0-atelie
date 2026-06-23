'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { maskCurrencyInput, unmaskCurrency } from '@/lib/currency'

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Valor numérico controlado (ex: 12.5) */
  value?: number
  /** Callback chamado com o valor numérico sempre que o usuário digita */
  onChange?: (numericValue: number) => void
  showPrefix?: boolean
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, showPrefix = true, ...props }, ref) => {
    // Inicializa display a partir do valor numérico
    const toDisplay = (num: number | undefined) => {
      if (!num || isNaN(num)) return ''
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const [displayValue, setDisplayValue] = React.useState<string>(() => toDisplay(value))

    // Sincroniza quando valor externo muda (ex: form.reset)
    React.useEffect(() => {
      const external = value ?? 0
      const internal = unmaskCurrency(displayValue)
      // Só atualiza se divergir para evitar loop
      if (Math.abs(external - internal) > 0.001) {
        setDisplayValue(toDisplay(external))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCurrencyInput(e.target.value)
      setDisplayValue(masked)
      const numeric = unmaskCurrency(masked)
      onChange?.(numeric)
    }

    return (
      <div className={cn('relative', className)}>
        {showPrefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground">
            R$
          </span>
        )}
        <input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm',
            showPrefix && 'pl-9'
          )}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
