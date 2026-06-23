'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { maskCurrencyInput, unmaskCurrency } from '@/lib/currency'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | string
  onValueChange?: (numericValue: number, maskedValue: string) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPrefix?: boolean
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onValueChange, onChange, showPrefix = true, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      const num = typeof value === 'number' ? value : parseFloat(String(value || '0'))
      if (!num || isNaN(num)) return ''
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })

    // Sync external value changes
    React.useEffect(() => {
      if (value !== undefined) {
        const num = typeof value === 'number' ? value : unmaskCurrency(String(value))
        if (!isNaN(num) && num !== unmaskCurrency(displayValue)) {
          setDisplayValue(
            num === 0 ? '' : num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          )
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const masked = maskCurrencyInput(raw)
      setDisplayValue(masked)

      const numeric = unmaskCurrency(masked)
      onValueChange?.(numeric, masked)

      // Compatibilidade com react-hook-form field.onChange
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: String(numeric) },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    return (
      <div className={cn('relative', className)}>
        {showPrefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
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
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm',
            showPrefix && 'pl-9',
            props.disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
