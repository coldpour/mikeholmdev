export type TextField = 'name' | 'location' | 'custodian'
export type NumberField = 'dailyRate' | 'units'
export type DateField = 'acquiredOn' | 'servicedOn'
export const categories = ['Audio', 'Camera', 'Lighting', 'Support'] as const
export type Category = (typeof categories)[number]

export type Filter =
  | { type: 'text'; field: TextField; operator: 'is' | 'includes'; value: string }
  | {
      type: 'number'
      field: NumberField
      operator: 'is' | 'lessThan' | 'greaterThan'
      value: number
    }
  | { type: 'date'; field: DateField; operator: 'is' | 'lessThan' | 'greaterThan'; value: string }
  | { type: 'category'; field: 'category'; operator: 'is'; value: Category }

export type Field = Filter['field']
export type Equipment = {
  id: string
  assetId: string
  name: string
  location: string
  custodian: string
  custodianPhone: string
  custodianEmail: string
  category: Category
  dailyRate: number
  units: number
  acquiredOn: string
  servicedOn: string
}

export const fields: ReadonlyArray<{
  field: Field
  label: string
  type: Filter['type']
  group: string
}> = [
  { field: 'name', label: 'Equipment', type: 'text', group: 'Find equipment' },
  { field: 'location', label: 'Location', type: 'text', group: 'Find equipment' },
  { field: 'custodian', label: 'Custodian', type: 'text', group: 'Find equipment' },
  { field: 'category', label: 'Category', type: 'category', group: 'Inventory profile' },
  { field: 'dailyRate', label: 'Daily rate', type: 'number', group: 'Inventory profile' },
  { field: 'units', label: 'Units', type: 'number', group: 'Inventory profile' },
  { field: 'acquiredOn', label: 'Acquired', type: 'date', group: 'Lifecycle' },
  { field: 'servicedOn', label: 'Last serviced', type: 'date', group: 'Lifecycle' }
]

export function generateEquipment(): Equipment[] {
  const names = [
    'Field recorder',
    'Shotgun microphone',
    'Cinema camera',
    'Prime lens',
    'LED panel',
    'Softbox kit',
    'Tripod',
    'Monitor stand'
  ]
  const places = ['North studio', 'South studio', 'Mobile kit']
  const people = ['Alex Chen', 'Jordan Ellis', 'Sam Rivera', 'Robin Park', 'Casey Morgan']
  return Array.from({ length: 120 }, (_, i) => ({
    id: `EQ-${String(i + 1).padStart(3, '0')}`,
    assetId: `STU-${['NTH', 'STH', 'MOB'][i % places.length]}-${categories[Math.floor((i % names.length) / 2)].slice(0, 3).toUpperCase()}-${2021 + (i % 5)}-${String(i + 1).padStart(5, '0')}`,
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    category: categories[Math.floor((i % names.length) / 2)],
    location: places[i % places.length],
    custodian: people[i % people.length],
    custodianPhone: `+1 (202) 555-010${1 + (i % people.length)}`,
    custodianEmail: `${people[i % people.length].toLowerCase().replace(' ', '.')}@example.com`,
    dailyRate: 15 + ((i * 37) % 285),
    units: (i * 7) % 13,
    acquiredOn: `${2021 + (i % 5)}-${String(1 + ((i * 7) % 12)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`,
    servicedOn: `2026-${String(1 + ((i * 5) % 10)).padStart(2, '0')}-${String(1 + ((i * 3) % 27)).padStart(2, '0')}`
  }))
}

export function matches(record: Equipment, filter: Filter): boolean {
  switch (filter.type) {
    case 'text': {
      const actual = record[filter.field].toLowerCase()
      const expected = filter.value.toLowerCase()
      return filter.operator === 'is' ? actual === expected : actual.includes(expected)
    }
    case 'category':
      return record.category === filter.value
    case 'number': {
      const actual = record[filter.field]
      return filter.operator === 'is'
        ? actual === filter.value
        : filter.operator === 'lessThan'
          ? actual < filter.value
          : actual > filter.value
    }
    case 'date': {
      const actual = record[filter.field]
      return filter.operator === 'is'
        ? actual === filter.value
        : filter.operator === 'lessThan'
          ? actual < filter.value
          : actual > filter.value
    }
  }
}

export type ReportState = { filters: Filter[]; sort: Field; direction: 'asc' | 'desc' }
export const emptyReport: ReportState = { filters: [], sort: 'name', direction: 'asc' }

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const time = Date.parse(value)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
}

// URLs are an untrusted boundary; TypeScript alone cannot validate JSON.
export function isFilter(value: unknown): value is Filter {
  if (!value || typeof value !== 'object') return false
  const f = value as Record<string, unknown>
  if (!fields.some((field) => field.field === f.field && field.type === f.type)) return false
  switch (f.type) {
    case 'text':
      return (
        (f.operator === 'is' || f.operator === 'includes') &&
        typeof f.value === 'string' &&
        f.value.trim().length > 0 &&
        f.value.length <= 150
      )
    case 'number':
      return (
        ['is', 'lessThan', 'greaterThan'].includes(String(f.operator)) &&
        typeof f.value === 'number' &&
        Number.isFinite(f.value) &&
        f.value >= 0
      )
    case 'date':
      return ['is', 'lessThan', 'greaterThan'].includes(String(f.operator)) && isDate(f.value)
    case 'category':
      return f.operator === 'is' && categories.includes(f.value as Category)
    default:
      return false
  }
}

export function parseReport(raw: string): { state: ReportState; invalid: boolean } {
  if (!raw) return { state: emptyReport, invalid: false }
  try {
    if (raw.length > 10000) throw new Error('Report too large')
    const value = JSON.parse(raw)
    if (
      value.version !== 1 ||
      !Array.isArray(value.filters) ||
      value.filters.length > 32 ||
      !value.filters.every(isFilter) ||
      !fields.some((f) => f.field === value.sort) ||
      !['asc', 'desc'].includes(value.direction)
    )
      throw new Error('Invalid report')
    return {
      state: { filters: value.filters, sort: value.sort, direction: value.direction },
      invalid: false
    }
  } catch {
    return { state: emptyReport, invalid: true }
  }
}

export function serializeReport(state: ReportState): string {
  return JSON.stringify({ version: 1, ...state })
}

export function selectEquipment(records: Equipment[], state: ReportState): Equipment[] {
  const direction = state.direction === 'asc' ? 1 : -1
  return records
    .filter((record) => state.filters.every((filter) => matches(record, filter)))
    .sort((a, b) => {
      const left = a[state.sort]
      const right = b[state.sort]
      return (
        direction *
        (typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), 'en', { numeric: true }))
      )
    })
}

export function summarize(filters: Filter[]): string {
  if (!filters.length) return 'Any value'
  const first = filters[0]
  if (first.type === 'text') return `${first.operator === 'is' ? '= ' : ''}${first.value}`
  if (first.type === 'category') return first.value
  const format = (f: Filter) =>
    f.field === 'dailyRate' ? `$${Number(f.value).toLocaleString('en-US')}` : String(f.value)
  if (first.operator === 'is') return `= ${format(first)}`
  const low = filters.find((f) => f.operator === 'greaterThan')
  const high = filters.find((f) => f.operator === 'lessThan')
  if (low && high) return `${format(low)} ${first.type === 'date' ? 'to' : '–'} ${format(high)}`
  return `${low ? 'After' : 'Before'} ${format(first)}`
    .replace('After', first.type === 'date' ? 'After' : 'Above')
    .replace('Before', first.type === 'date' ? 'Before' : 'Below')
}

export function makeFilter(field: Field, operator: string, value: string): Filter | null {
  const meta = fields.find((f) => f.field === field)!
  const candidate: unknown = {
    type: meta.type,
    field,
    operator,
    value: meta.type === 'number' ? (value.trim() ? Number(value) : NaN) : value.trim()
  }
  return isFilter(candidate) ? candidate : null
}

export function makeBounds(field: NumberField | DateField, lower: string, upper: string): Filter[] {
  return [makeFilter(field, 'greaterThan', lower), makeFilter(field, 'lessThan', upper)].filter(
    (f): f is Filter => f !== null
  )
}
