'use client'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import NativeSelect from '@mui/material/NativeSelect'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useId, useRef, useState } from 'react'
import { categories, fields, makeBounds, makeFilter, type Field, type Filter } from './model'
import { DateInput } from './DateInput'

type Draft = { value: string; exact: boolean; lower: string; upper: string }
type ChangeField = (field: Field, filters: Filter[], typing?: boolean) => void

function readDraft(filters: Filter[]): Draft {
  const first = filters[0]
  return {
    value:
      first && (first.type === 'text' || first.type === 'category' || first.operator === 'is')
        ? String(first.value)
        : '',
    exact: first?.operator === 'is',
    lower: String(filters.find((f) => f.operator === 'greaterThan')?.value ?? ''),
    upper: String(filters.find((f) => f.operator === 'lessThan')?.value ?? '')
  }
}

function InlineFilter({
  field,
  filters,
  onChange
}: {
  field: Field
  filters: Filter[]
  onChange: ChangeField
}) {
  const meta = fields.find((f) => f.field === field)!
  const signature = JSON.stringify(filters)
  const [draft, setDraft] = useState(() => readDraft(filters))
  const committed = useRef(signature)
  const pending = useRef<Filter[] | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const change = useRef(onChange)
  change.current = onChange
  const labelId = useId()
  const range = meta.type === 'number' || meta.type === 'date'

  function conditions(next: Draft) {
    if (range && !next.exact)
      return makeBounds(
        field as 'dailyRate' | 'units' | 'acquiredOn' | 'servicedOn',
        next.lower,
        next.upper
      )
    const filter = makeFilter(
      field,
      meta.type === 'category' || next.exact ? 'is' : 'includes',
      next.value
    )
    return filter ? [filter] : []
  }

  function invalid(next: Draft) {
    if (range && !next.exact) {
      const invalidBound = (value: string, operator: string) =>
        value !== '' && !makeFilter(field, operator, value)
      return (
        invalidBound(next.lower, 'greaterThan') ||
        invalidBound(next.upper, 'lessThan') ||
        (next.lower !== '' &&
          next.upper !== '' &&
          (meta.type === 'number'
            ? Number(next.lower) >= Number(next.upper)
            : next.lower >= next.upper))
      )
    }
    return next.value !== '' && conditions(next).length === 0
  }

  function commit(typing = true) {
    clearTimeout(timer.current)
    if (pending.current === null) return
    const next = pending.current
    pending.current = null
    committed.current = JSON.stringify(next)
    change.current(field, next, typing)
  }

  function edit(patch: Partial<Draft>, immediate = false) {
    const next = { ...draft, ...patch }
    setDraft(next)
    clearTimeout(timer.current)
    pending.current = invalid(next) ? null : conditions(next)
    if (immediate) commit(false)
    else timer.current = setTimeout(() => commit(), 300)
  }

  // Applied conditions come from the URL; only unfinished input lives here.
  useEffect(() => {
    if (signature !== committed.current) {
      clearTimeout(timer.current)
      pending.current = null
      setDraft(readDraft(JSON.parse(signature)))
    }
    committed.current = signature
  }, [signature])
  useEffect(() => () => clearTimeout(timer.current), [])

  const error = invalid(draft)
  const hasValue = draft.value !== '' || draft.lower !== '' || draft.upper !== ''
  const active = filters.length > 0
  const inputType = meta.type === 'date' ? 'date' : meta.type === 'number' ? 'number' : 'text'
  const inputStyle = {
    flex: 1,
    minWidth: 0,
    typography: 'caption',
    '& input': { p: 0, minWidth: 0, width: '100%', appearance: 'textfield' },
    '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
      appearance: 'none',
      m: 0
    }
  }

  return (
    <Tooltip
      title={error ? 'Enter a valid value with the lower bound smaller than the upper bound.' : ''}
    >
      <Box
        role="group"
        aria-labelledby={labelId}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) commit()
        }}
        sx={{
          position: 'relative',
          minWidth: 0,
          height: 40,
          borderRadius: 1,
          bgcolor: active ? 'primary.subtle' : 'background.paper',
          '&:focus-within fieldset': { borderColor: error ? 'error.main' : 'primary.main' }
        }}
      >
        <Box
          component="fieldset"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '-0.5em',
            right: 0,
            bottom: 0,
            left: 0,
            m: 0,
            px: meta.type === 'date' ? 4.5 : 1,
            py: 0,
            minWidth: 0,
            pointerEvents: 'none',
            typography: 'caption',
            lineHeight: 1,
            border: 1,
            borderRadius: 1,
            borderColor: error ? 'error.main' : active ? 'primary.main' : 'divider'
          }}
        >
          <Typography
            component="legend"
            id={labelId}
            variant="caption"
            color={error ? 'error.main' : active ? 'primary.main' : 'text.secondary'}
            sx={{ px: 0.5, lineHeight: 1 }}
          >
            {meta.label}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minWidth: 0,
            height: '100%',
            pl: (theme) => `calc(${theme.spacing(1.5)} + 1px)`,
            pr: 1
          }}
        >
          {meta.type === 'category' ? (
            <NativeSelect
              input={<InputBase />}
              value={draft.value}
              onChange={(event) => edit({ value: event.target.value, exact: true }, true)}
              inputProps={{ 'aria-label': meta.label }}
              sx={{ ...inputStyle, '& select': { py: 0, pl: 0, typography: 'caption' } }}
            >
              <option value="">Any</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </NativeSelect>
          ) : range && !draft.exact ? (
            <>
              {meta.type === 'date' ? (
                <DateInput
                  label={`${meta.label} after`}
                  value={draft.lower}
                  onChange={(value) => edit({ lower: value })}
                  error={error}
                  sx={inputStyle}
                />
              ) : (
                <InputBase
                  type={inputType}
                  value={draft.lower}
                  placeholder="Above"
                  inputProps={{
                    'aria-label': `${meta.label} above`,
                    'aria-invalid': error,
                    min: meta.type === 'number' ? 0 : undefined,
                    step: field === 'units' ? 1 : 'any'
                  }}
                  onChange={(event) => edit({ lower: event.target.value })}
                  sx={inputStyle}
                />
              )}
              <Typography component="span" variant="caption" color="text.secondary" aria-hidden>
                –
              </Typography>
              {meta.type === 'date' ? (
                <DateInput
                  label={`${meta.label} before`}
                  value={draft.upper}
                  onChange={(value) => edit({ upper: value })}
                  error={error}
                  sx={inputStyle}
                />
              ) : (
                <InputBase
                  type={inputType}
                  value={draft.upper}
                  placeholder="Below"
                  inputProps={{
                    'aria-label': `${meta.label} below`,
                    'aria-invalid': error,
                    min: meta.type === 'number' ? 0 : undefined,
                    step: field === 'units' ? 1 : 'any'
                  }}
                  onChange={(event) => edit({ upper: event.target.value })}
                  sx={inputStyle}
                />
              )}
            </>
          ) : meta.type === 'date' ? (
            <DateInput
              label={meta.label}
              value={draft.value}
              onChange={(value) => edit({ value })}
              error={error}
              sx={inputStyle}
            />
          ) : (
            <InputBase
              type={inputType}
              value={draft.value}
              placeholder="Any"
              inputProps={{
                'aria-label': meta.label,
                'aria-invalid': error,
                maxLength: 150,
                min: meta.type === 'number' ? 0 : undefined
              }}
              onChange={(event) => edit({ value: event.target.value })}
              sx={inputStyle}
            />
          )}
          {meta.type !== 'category' ? (
            <Tooltip
              title={
                draft.exact ? (range ? 'Exact value' : 'Exact match') : range ? 'Range' : 'Contains'
              }
            >
              <IconButton
                size="small"
                aria-label={`${meta.label} exact ${range ? 'value' : 'match'}`}
                aria-pressed={!!draft.exact}
                onClick={() => edit({ exact: !draft.exact }, true)}
                sx={{
                  p: 0.5,
                  minWidth: 24,
                  height: 24,
                  bgcolor: draft.exact ? 'primary.subtle' : undefined,
                  color: draft.exact ? 'primary.main' : 'text.secondary'
                }}
              >
                {draft.exact ? (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ fontWeight: 'fontWeightBold' }}
                  >
                    =
                  </Typography>
                ) : range ? (
                  <SwapHorizIcon fontSize="inherit" />
                ) : (
                  <SearchIcon fontSize="inherit" />
                )}
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip title={`Clear ${meta.label}`}>
            <span>
              <IconButton
                size="small"
                aria-label={`Clear ${meta.label}`}
                disabled={!hasValue && !active}
                onClick={() => edit({ value: '', lower: '', upper: '' }, true)}
                sx={{ p: 0.25, minWidth: 24, height: 24 }}
              >
                <ClearIcon sx={{ fontSize: 'inherit' }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Tooltip>
  )
}

export function InlineFilters({ filters, onChange }: { filters: Filter[]; onChange: ChangeField }) {
  const [navigation, setNavigation] = useState(0)
  useEffect(() => {
    const reset = () => setNavigation((value) => value + 1)
    window.addEventListener('popstate', reset)
    return () => window.removeEventListener('popstate', reset)
  }, [])

  return (
    <Stack spacing={1} aria-label="Report filters">
      {['Find equipment', 'Inventory profile', 'Lifecycle'].map((group) => (
        <Box
          key={group}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '112px minmax(0, 1fr)' },
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 'fontWeightBold' }}
          >
            {group}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                group === 'Lifecycle'
                  ? { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }
                  : { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 1
            }}
          >
            {fields
              .filter((meta) => meta.group === group)
              .map((meta) => (
                <InlineFilter
                  key={`${meta.field}-${navigation}`}
                  field={meta.field}
                  filters={filters.filter((filter) => filter.field === meta.field)}
                  onChange={onChange}
                />
              ))}
          </Box>
        </Box>
      ))}
    </Stack>
  )
}
