'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, X, Filter } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface AdvancedFilter {
  id: string
  label: string
  type: 'select' | 'text' | 'date' | 'range'
  options?: FilterOption[]
  placeholder?: string
}

interface AdvancedFiltersProps {
  filters: AdvancedFilter[]
  activeFilters: Record<string, string | string[]>
  onFilterChange: (filterId: string, value: string | string[]) => void
  onReset?: () => void
}

export function AdvancedFilters({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
}: AdvancedFiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const activeCount = Object.values(activeFilters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-2"
        >
          <Filter className="size-4" />
          Filtros
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
          <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
        </Button>
        {activeCount > 0 && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Limpar tudo
          </Button>
        )}
      </div>

      {expanded && (
        <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-4">
          {filters.map(filter => {
            const value = activeFilters[filter.id]

            return (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>

                {filter.type === 'select' && (
                  <Select value={value as string} onValueChange={(val) => onFilterChange(filter.id, val)}>
                    <SelectTrigger>
                      <SelectValue placeholder={filter.placeholder || 'Selecione...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                          {opt.count !== undefined && ` (${opt.count})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === 'text' && (
                  <Input
                    placeholder={filter.placeholder}
                    value={value as string}
                    onChange={(e) => onFilterChange(filter.id, e.target.value)}
                    className="h-9"
                  />
                )}

                {filter.type === 'date' && (
                  <Input
                    type="date"
                    value={value as string}
                    onChange={(e) => onFilterChange(filter.id, e.target.value)}
                    className="h-9"
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, val]) => {
            if (!val || (Array.isArray(val) && val.length === 0)) return null

            const filter = filters.find(f => f.id === key)
            const displayLabel = filter?.type === 'select' && filter.options
              ? filter.options.find(o => o.value === val)?.label || val
              : val

            return (
              <Badge key={key} variant="secondary" className="gap-1 py-1 pl-2 pr-1">
                <span className="text-xs">{displayLabel}</span>
                <button
                  onClick={() => onFilterChange(key, '')}
                  className="ml-1 inline-flex items-center rounded-full hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
