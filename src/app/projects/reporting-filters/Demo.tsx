'use client'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DownloadIcon from '@mui/icons-material/Download'
import FilterListIcon from '@mui/icons-material/FilterList'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { keepPreviousData, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { memo, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  categories,
  emptyReport,
  fields,
  generateEquipment,
  makeBounds,
  makeFilter,
  selectEquipment,
  summarize,
  type Equipment,
  type Field,
  type Filter,
  type ReportState
} from './model'
import { updateReport, useReportUrl, writeReport } from './url-state'
import { planResponse, type ResponseMode } from './responses'
import { InlineFilters } from './InlineFilters'

function QueryBoundary({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 60000, refetchOnWindowFocus: false } }
      })
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

let equipment: Equipment[] | undefined
function records() {
  equipment ??= generateEquipment()
  return equipment
}

function simulateReport(
  state: ReportState,
  signal: AbortSignal,
  delay: number,
  fail: boolean
): Promise<Equipment[]> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Cancelled', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      if (fail) reject(new Error('Simulated report failure'))
      else resolve(selectEquipment(records(), state))
    }, delay)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
}

function DemoFrame({ children, label, id }: { children: ReactNode; label: string; id?: string }) {
  return (
    <Box
      id={id}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        scrollMarginTop: 24
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover'
        }}
      >
        <Typography variant="overline">{label}</Typography>
      </Box>
      {children}
    </Box>
  )
}

const columns: (Field | 'contact')[] = [
  'name',
  'contact',
  'category',
  'location',
  'dailyRate',
  'units',
  'acquiredOn'
]
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

function CopyValue({
  text,
  kind,
  variant = 'body2'
}: {
  text: string
  kind?: 'phone' | 'email'
  variant?: 'body2' | 'caption'
}) {
  const [copied, setCopied] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const value = useRef<HTMLElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    const element = value.current
    if (!element) return
    const measure = () => setOverflowing(element.scrollWidth > element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [text])
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        width: 'fit-content',
        maxWidth: '100%',
        '& .value-action': { opacity: 0 },
        '&:hover .value-action, &:focus-within .value-action': { opacity: 1 },
        '@media (hover: none)': { '& .value-action': { opacity: 1 } }
      }}
    >
      <Tooltip title={overflowing ? text : ''} enterDelay={500} enterNextDelay={500}>
        <Typography ref={value} noWrap variant={variant} sx={{ maxWidth: 210 }}>
          {text}
        </Typography>
      </Tooltip>
      {kind ? (
        <Tooltip title={kind === 'phone' ? 'Call' : 'Email'} enterDelay={700} enterNextDelay={700}>
          <IconButton
            className="value-action"
            component="a"
            href={kind === 'phone' ? `tel:${text.replace(/[^+\d]/g, '')}` : `mailto:${text}`}
            size="small"
            aria-label={`${kind === 'phone' ? 'Call' : 'Email'} ${text}`}
            sx={{ p: 0.25, width: 24, height: 24 }}
          >
            {kind === 'phone' ? (
              <CallOutlinedIcon fontSize="inherit" />
            ) : (
              <EmailOutlinedIcon fontSize="inherit" />
            )}
          </IconButton>
        </Tooltip>
      ) : null}
      <Tooltip title={copied ? 'Copied' : 'Copy'} enterDelay={700} enterNextDelay={700}>
        <IconButton
          className="value-action"
          size="small"
          aria-label={`${copied ? 'Copied' : 'Copy'} ${text}`}
          sx={{ p: 0.25, width: 24, height: 24 }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setCopied(true)
              clearTimeout(timer.current)
              timer.current = setTimeout(() => setCopied(false), 1500)
            } catch {
              setCopied(false)
            }
          }}
        >
          {copied ? <CheckIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const EquipmentRow = memo(function EquipmentRow({ record }: { record: Equipment }) {
  return (
    <TableRow hover>
      <TableCell>
        <Stack spacing={0.25}>
          <Typography noWrap variant="body2">
            {record.name}
          </Typography>
          <CopyValue text={record.assetId} variant="caption" />
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.25}>
          <Typography color="text.secondary" variant="caption">
            {record.custodian}
          </Typography>
          <CopyValue text={record.custodianEmail} kind="email" variant="caption" />
          <CopyValue text={record.custodianPhone} kind="phone" variant="caption" />
        </Stack>
      </TableCell>
      <TableCell>
        <Chip size="small" variant="outlined" label={record.category} />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{record.location}</Typography>
      </TableCell>
      <TableCell>{currency.format(record.dailyRate)}</TableCell>
      <TableCell>{record.units}</TableCell>
      <TableCell>{record.acquiredOn}</TableCell>
    </TableRow>
  )
})

const Results = memo(function Results({
  data,
  state,
  onSort,
  updating = false,
  label = 'Equipment results'
}: {
  data: Equipment[]
  state: ReportState
  onSort?: (field: Field) => void
  updating?: boolean
  label?: string
}) {
  return (
    <TableContainer
      tabIndex={0}
      aria-label={`${label}, scroll for more records`}
      sx={{
        maxHeight: 360,
        '& th': { bgcolor: 'background.paper', whiteSpace: 'nowrap' },
        '& td': { whiteSpace: 'nowrap' },
        '& th, & td': { px: 2, py: 1 },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 }
      }}
    >
      <Table stickyHeader size="small" aria-label={label} aria-busy={updating}>
        <TableHead>
          <TableRow>
            {columns.map((field) => (
              <TableCell key={field} sortDirection={state.sort === field ? state.direction : false}>
                {onSort && field !== 'contact' ? (
                  <TableSortLabel
                    active={state.sort === field}
                    direction={state.sort === field ? state.direction : 'asc'}
                    onClick={() => onSort(field)}
                  >
                    {fields.find((f) => f.field === field)!.label}
                  </TableSortLabel>
                ) : field === 'contact' ? (
                  'Custodian'
                ) : (
                  fields.find((f) => f.field === field)!.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record) => (
            <EquipmentRow key={record.id} record={record} />
          ))}
        </TableBody>
      </Table>
      {!data.length ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3">No equipment matches</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Try widening a range or clearing a condition.
          </Typography>
        </Box>
      ) : null}
    </TableContainer>
  )
})

function downloadReport(data: Equipment[]) {
  const keys: (keyof Equipment)[] = [
    'id',
    'assetId',
    'name',
    'category',
    'location',
    'custodian',
    'custodianEmail',
    'custodianPhone',
    'dailyRate',
    'units',
    'acquiredOn',
    'servicedOn'
  ]
  const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const csv = [
    keys.join(','),
    ...data.map((record) => keys.map((key) => quote(record[key])).join(','))
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'equipment-report.csv'
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function FieldEditor({
  field,
  initial,
  onChange,
  onDraft
}: {
  field: Field
  initial: Filter[]
  onChange: (filters: Filter[]) => void
  onDraft: (filters: Filter[]) => void
}) {
  const meta = fields.find((f) => f.field === field)!
  const first = initial[0]
  const [value, setValue] = useState(
    first && (first.type === 'text' || first.type === 'category' || first.operator === 'is')
      ? String(first.value)
      : ''
  )
  const [exact, setExact] = useState(first?.operator === 'is')
  const [lower, setLower] = useState(
    String(initial.find((f) => f.operator === 'greaterThan')?.value ?? '')
  )
  const [upper, setUpper] = useState(
    String(initial.find((f) => f.operator === 'lessThan')?.value ?? '')
  )
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const update = useRef(onChange)
  update.current = onChange
  useEffect(() => () => clearTimeout(timer.current), [])

  function schedule(nextValue: string, nextExact: boolean, nextLower: string, nextUpper: string) {
    clearTimeout(timer.current)
    const filters =
      meta.type === 'text' || meta.type === 'category' || nextExact
        ? [
            makeFilter(field, meta.type === 'category' || nextExact ? 'is' : 'includes', nextValue)
          ].filter((f): f is Filter => f !== null)
        : makeBounds(
            field as 'dailyRate' | 'units' | 'acquiredOn' | 'servicedOn',
            nextLower,
            nextUpper
          )
    onDraft(filters)
    timer.current = setTimeout(() => update.current(filters), 300)
  }

  const range = meta.type === 'date' || meta.type === 'number'
  const invalidRange =
    range &&
    !exact &&
    lower !== '' &&
    upper !== '' &&
    (meta.type === 'number' ? Number(lower) >= Number(upper) : lower >= upper)
  return (
    <Stack spacing={2} sx={{ p: 2.5, width: { xs: 280, sm: 340 }, maxWidth: '100%' }}>
      <Typography variant="h3">{meta.label}</Typography>
      {meta.type === 'category' ? (
        <ToggleButtonGroup
          exclusive
          value={value}
          aria-label="Category options"
          onChange={(_, next: string | null) => {
            const newValue = next ?? ''
            setValue(newValue)
            schedule(newValue, true, lower, upper)
          }}
          size="small"
          sx={{ flexWrap: 'wrap' }}
        >
          {categories.map((category) => (
            <ToggleButton key={category} value={category}>
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : (
        <>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={!!exact}
                onChange={(_, checked) => {
                  setExact(checked)
                  schedule(value, checked, lower, upper)
                }}
              />
            }
            label={range ? 'Exact value' : 'Exact match'}
          />
          {range && !exact ? (
            <>
              <TextField
                autoFocus
                fullWidth
                size="small"
                label={meta.type === 'date' ? 'After date' : 'Above amount'}
                type={meta.type === 'date' ? 'date' : 'number'}
                value={lower}
                error={invalidRange}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: meta.type === 'number' ? 0 : undefined }
                }}
                onChange={(e) => {
                  setLower(e.target.value)
                  schedule(value, exact, e.target.value, upper)
                }}
              />
              <TextField
                fullWidth
                size="small"
                label={meta.type === 'date' ? 'Before date' : 'Below amount'}
                type={meta.type === 'date' ? 'date' : 'number'}
                value={upper}
                error={invalidRange}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: meta.type === 'number' ? 0 : undefined }
                }}
                onChange={(e) => {
                  setUpper(e.target.value)
                  schedule(value, exact, lower, e.target.value)
                }}
              />
              {invalidRange ? (
                <Typography variant="caption" color="error.main">
                  The lower bound must be smaller than the upper bound.
                </Typography>
              ) : null}
            </>
          ) : (
            <TextField
              autoFocus
              size="small"
              fullWidth
              label={`${meta.label} value`}
              type={meta.type === 'date' ? 'date' : meta.type === 'number' ? 'number' : 'text'}
              value={value}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { maxLength: 150, min: meta.type === 'number' ? 0 : undefined }
              }}
              onChange={(e) => {
                setValue(e.target.value)
                schedule(e.target.value, exact, lower, upper)
              }}
            />
          )}
        </>
      )}
    </Stack>
  )
}

function FilterBar({
  filters,
  grouped,
  onChange
}: {
  filters: Filter[]
  grouped: boolean
  onChange: (field: Field, filters: Filter[], typing?: boolean) => void
}) {
  const [editor, setEditor] = useState<{ field: Field; anchor: HTMLElement } | null>(null)
  const pending = useRef<{ field: Field; filters: Filter[] } | null>(null)
  const editorPaper = useRef<HTMLDivElement | null>(null)
  const editorId = useId()
  // Browser navigation discards an unfinished draft instead of writing it over the restored URL.
  useEffect(() => {
    const close = () => {
      pending.current = null
      setEditor(null)
    }
    window.addEventListener('popstate', close)
    return () => window.removeEventListener('popstate', close)
  }, [])
  const groups = grouped ? ['Find equipment', 'Inventory profile', 'Lifecycle'] : ['All fields']
  function closeEditor() {
    if (pending.current) onChange(pending.current.field, pending.current.filters, true)
    pending.current = null
    setEditor(null)
  }
  return (
    <>
      <Stack spacing={2}>
        {groups.map((group) => (
          <Box
            key={group}
            sx={{
              display: 'grid',
              gridTemplateColumns: grouped ? { xs: '1fr', md: '150px 1fr' } : '1fr',
              alignItems: 'start',
              gap: 1
            }}
          >
            {grouped ? (
              <Typography
                color="text.secondary"
                variant="caption"
                sx={{ pt: { md: 1 }, fontWeight: 'fontWeightBold' }}
              >
                {group}
              </Typography>
            ) : null}
            <Box
              sx={{
                display: grouped ? 'grid' : 'flex',
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))'
                },
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              {fields
                .filter((meta) => !grouped || meta.group === group)
                .map((meta) => {
                  const active = filters.filter((f) => f.field === meta.field)
                  return (
                    <Box key={meta.field} sx={{ position: 'relative', minWidth: 0 }}>
                      <Button
                        fullWidth={grouped}
                        size="small"
                        variant="outlined"
                        color={active.length ? 'primary' : 'inherit'}
                        aria-label={`Edit ${meta.label} filter${active.length ? `: ${summarize(active)}` : ''}`}
                        aria-haspopup="dialog"
                        aria-expanded={editor?.field === meta.field}
                        aria-controls={editor?.field === meta.field ? editorId : undefined}
                        onClick={(e) => {
                          pending.current = null
                          setEditor({ field: meta.field, anchor: e.currentTarget })
                        }}
                        sx={{
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          px: 1.5,
                          pr: active.length ? 4 : 1.5,
                          minHeight: grouped ? 64 : undefined,
                          borderColor: active.length ? 'primary.main' : 'divider',
                          bgcolor: active.length ? 'action.selected' : undefined,
                          textTransform: 'none'
                        }}
                      >
                        <Stack sx={{ minWidth: 0 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ fontWeight: 'fontWeightBold' }}
                          >
                            {meta.label}
                          </Typography>
                          {grouped || active.length ? (
                            <Typography
                              component="span"
                              noWrap
                              variant="caption"
                              sx={{ maxWidth: '100%' }}
                            >
                              {summarize(active)}
                            </Typography>
                          ) : null}
                        </Stack>
                      </Button>
                      {active.length ? (
                        <Tooltip title={`Clear ${meta.label}`}>
                          <IconButton
                            aria-label={`Clear ${meta.label}`}
                            size="small"
                            onClick={() => {
                              setEditor(null)
                              onChange(meta.field, [])
                            }}
                            sx={{
                              position: 'absolute',
                              right: 2,
                              top: '50%',
                              transform: 'translateY(-50%)'
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </Box>
                  )
                })}
            </Box>
          </Box>
        ))}
      </Stack>
      <Popover
        id={editorId}
        open={!!editor}
        anchorEl={editor?.anchor}
        onClose={closeEditor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            ref: editorPaper,
            role: 'dialog',
            'aria-label': editor
              ? `${fields.find((f) => f.field === editor.field)!.label} filter editor`
              : undefined
          },
          transition: {
            onEntered: () =>
              editorPaper.current
                ?.querySelector<HTMLElement>('input:not([type="checkbox"]), button')
                ?.focus()
          }
        }}
      >
        {editor ? (
          <FieldEditor
            key={editor.field}
            field={editor.field}
            initial={filters.filter((f) => f.field === editor.field)}
            onDraft={(next) => {
              pending.current = { field: editor.field, filters: next }
            }}
            onChange={(next) => onChange(editor.field, next, true)}
          />
        ) : null}
      </Popover>
    </>
  )
}

function FinishedWorkspace() {
  const { state, invalid } = useReportUrl()
  const [condition, setCondition] = useState<ResponseMode>('realistic')
  const [slow, setSlow] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const [filterRevision, setFilterRevision] = useState(0)
  const query = useQuery({
    queryKey: ['equipment-report', state, condition],
    queryFn: ({ signal }) => {
      const response = planResponse(condition)
      return simulateReport(state, signal, response.delay, response.fail)
    },
    retry: condition === 'realistic' ? 2 : false,
    retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 1500),
    placeholderData: keepPreviousData
  })
  useEffect(() => {
    setSlow(false)
    if (!query.isFetching) return
    const timer = setTimeout(() => setSlow(true), 2000)
    return () => clearTimeout(timer)
  }, [query.isFetching, query.dataUpdatedAt, condition])
  function changeField(field: Field, next: Filter[], typing = false) {
    updateReport(
      (current) => ({
        ...current,
        filters: [...current.filters.filter((f) => f.field !== field), ...next]
      }),
      typing
    )
  }
  const current = !query.isFetching && !query.isError && !query.isPlaceholderData
  return (
    <DemoFrame id="finished-demo" label="The result · An equipment reporting workspace">
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h3">Equipment library</Typography>
              <Typography color="text.secondary" variant="body2">
                120 records
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', rowGap: 1, alignItems: 'center' }}
            >
              <TextField
                select
                size="small"
                label="Responses"
                value={condition}
                onChange={(e) => {
                  setSlow(false)
                  setCondition(e.target.value as ResponseMode)
                }}
                sx={{ minWidth: 190, '& .MuiSelect-select': { typography: 'caption' } }}
              >
                <MenuItem value="realistic">Realistic</MenuItem>
                <MenuItem value="fast">Successful and fast</MenuItem>
                <MenuItem value="slow">Successful and slow</MenuItem>
                <MenuItem value="failure">Persistent failure</MenuItem>
              </TextField>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                    setCopyStatus('Report link copied')
                  } catch {
                    setCopyStatus('Copy the address bar to share this report')
                  }
                }}
              >
                Share report
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                disabled={!current || !query.data?.length}
                onClick={() => downloadReport(query.data ?? [])}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterListIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>
              Filters
            </Typography>
            <Chip
              size="small"
              color={state.filters.length ? 'primary' : 'default'}
              label={`${new Set(state.filters.map((f) => f.field)).size} active`}
            />
            <Button
              size="small"
              onClick={() => {
                setFilterRevision((value) => value + 1)
                writeReport({ ...state, filters: [] })
              }}
            >
              Clear all
            </Button>
            <Button
              size="small"
              onClick={() => {
                setFilterRevision((value) => value + 1)
                writeReport({
                  filters: [
                    { type: 'category', field: 'category', operator: 'is', value: 'Audio' },
                    { type: 'number', field: 'dailyRate', operator: 'lessThan', value: 150 }
                  ],
                  sort: 'dailyRate',
                  direction: 'asc'
                })
              }}
            >
              Try an audio report
            </Button>
          </Stack>
          {invalid ? (
            <Alert
              severity="warning"
              action={
                <Button color="inherit" size="small" onClick={() => writeReport(emptyReport)}>
                  Reset URL
                </Button>
              }
            >
              This report link contains invalid filters. Showing the full library.
            </Alert>
          ) : null}
          <InlineFilters key={filterRevision} filters={state.filters} onChange={changeField} />
        </Stack>
      </Box>
      <Box
        sx={{ borderTop: 1, borderColor: 'divider', px: { xs: 2, md: 3 }, py: 1.5, minHeight: 48 }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2" color="text.secondary">
          {query.isError
            ? 'Report unavailable'
            : query.isFetching
              ? query.failureCount > 0
                ? `Retrying report · Attempt ${query.failureCount + 1} of 3${query.data ? ' · Previous results shown' : ''}`
                : query.data
                  ? 'Updating results · Previous results shown'
                  : 'Preparing equipment report…'
              : `${query.data?.length ?? 0} matching records · Results up to date`}
          {copyStatus ? ` · ${copyStatus}` : ''}
        </Typography>
      </Box>
      <Box sx={{ height: 2 }}>
        {query.isFetching ? <LinearProgress aria-label="Updating report" /> : null}
      </Box>
      <Box sx={{ position: 'relative', minHeight: 240 }}>
        {query.isError ? (
          <Stack spacing={2} sx={{ p: 4, alignItems: 'center' }}>
            <Alert severity="error">
              This report couldn’t be loaded. Your filters are still here. Please try again.
            </Alert>
            <Button variant="outlined" onClick={() => void query.refetch()}>
              Try again
            </Button>
          </Stack>
        ) : query.isPending ? (
          <Box sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Preparing equipment report…
            </Typography>
          </Box>
        ) : (
          <Results
            data={query.data ?? []}
            state={state}
            updating={query.isFetching}
            onSort={(field) =>
              writeReport({
                ...state,
                sort: field,
                direction: state.sort === field && state.direction === 'asc' ? 'desc' : 'asc'
              })
            }
          />
        )}
        {slow && query.isFetching ? (
          <Box
            role="status"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
              bgcolor: 'background.paper',
              opacity: 0.95,
              p: 3
            }}
          >
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Sorry, this is taking longer than expected.
            </Typography>
          </Box>
        ) : null}
      </Box>
    </DemoFrame>
  )
}

export function FinalDemo() {
  return (
    <QueryBoundary>
      <FinishedWorkspace />
    </QueryBoundary>
  )
}

type DraftRow = { id: string; field: Field; operator: string; value: string }
const operatorLabels: Record<string, string> = {
  includes: 'contains',
  is: 'is',
  lessThan: 'below',
  greaterThan: 'above'
}
function operators(field: Field) {
  const type = fields.find((f) => f.field === field)!.type
  return type === 'text'
    ? ['includes', 'is']
    : type === 'category'
      ? ['is']
      : ['lessThan', 'is', 'greaterThan']
}
function rowFilters(rows: DraftRow[]) {
  return rows
    .map((row) => makeFilter(row.field, row.operator, row.value))
    .filter((f): f is Filter => f !== null)
}

function PlainStartingPoint() {
  const [rows, setRows] = useState<DraftRow[]>([
    { id: 'first', field: 'name', operator: 'includes', value: '' }
  ])
  const [applied, setApplied] = useState<Filter[]>([])
  const data = useMemo(
    () => selectEquipment(records(), { ...emptyReport, filters: applied }),
    [applied]
  )
  function update(id: string, patch: Partial<DraftRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }
  return (
    <>
      <h2>Equipment report</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setApplied(rowFilters(rows))
        }}
      >
        {rows.map((row, index) => (
          <fieldset key={row.id}>
            <legend>Filter {index + 1}</legend>
            <p>
              <label>
                Field{' '}
                <select
                  value={row.field}
                  onChange={(e) => {
                    const field = e.target.value as Field
                    update(row.id, { field, operator: operators(field)[0], value: '' })
                  }}
                >
                  {fields.map((f) => (
                    <option key={f.field} value={f.field}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
            </p>
            <p>
              <label>
                Condition{' '}
                <select
                  value={row.operator}
                  onChange={(e) => update(row.id, { operator: e.target.value })}
                >
                  {operators(row.field).map((op) => (
                    <option key={op} value={op}>
                      {operatorLabels[op]}
                    </option>
                  ))}
                </select>
              </label>
            </p>
            <p>
              <label>
                Value{' '}
                {row.field === 'category' ? (
                  <select
                    value={row.value}
                    onChange={(e) => update(row.id, { value: e.target.value })}
                  >
                    <option value="">Choose category</option>
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      fields.find((f) => f.field === row.field)!.type === 'date'
                        ? 'date'
                        : fields.find((f) => f.field === row.field)!.type === 'number'
                          ? 'number'
                          : 'text'
                    }
                    value={row.value}
                    onChange={(e) => update(row.id, { value: e.target.value })}
                  />
                )}
              </label>
            </p>
            <button
              type="button"
              onClick={() => setRows((current) => current.filter((r) => r.id !== row.id))}
            >
              Remove filter {index + 1}
            </button>
          </fieldset>
        ))}
        <p>
          <button
            type="button"
            onClick={() =>
              setRows((current) => [
                ...current,
                { id: crypto.randomUUID(), field: 'name', operator: 'includes', value: '' }
              ])
            }
          >
            Add filter
          </button>{' '}
          <button type="submit">Apply filters</button>{' '}
          <button
            type="button"
            onClick={() => {
              setRows([{ id: 'first', field: 'name', operator: 'includes', value: '' }])
              setApplied([])
            }}
          >
            Clear all
          </button>
        </p>
      </form>
      <p role="status">{data.length} matching records</p>
      <table>
        <caption>Equipment results</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Location</th>
            <th>Daily rate</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.category}</td>
              <td>{r.location}</td>
              <td>{r.dailyRate}</td>
              <td>{r.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export function StartDemo() {
  const [body, setBody] = useState<HTMLElement | null>(null)
  const frame = useRef<HTMLIFrameElement | null>(null)
  useEffect(() => {
    const document = frame.current?.contentDocument
    // A server-rendered srcdoc can finish loading before React attaches onLoad.
    if (document?.readyState === 'complete') setBody(document.body)
  }, [])
  return (
    <DemoFrame label="Starting point · Native HTML, no design-system styles">
      <Box
        ref={frame}
        component="iframe"
        title="Unstyled equipment filter starting point"
        srcDoc="<!doctype html><html lang='en'><head><meta charset='utf-8'><title>Unstyled equipment report</title></head><body></body></html>"
        onLoad={(e) => setBody(e.currentTarget.contentDocument?.body ?? null)}
        sx={{ display: 'block', width: '100%', height: 440, border: 0 }}
      />
      {body ? createPortal(<PlainStartingPoint />, body) : null}
    </DemoFrame>
  )
}

function DenseWorkspace() {
  const [rows, setRows] = useState<DraftRow[]>([
    { id: 'first', field: 'name', operator: 'includes', value: '' }
  ])
  const active = rowFilters(rows)
  const query = useQuery({
    queryKey: ['dense-report', active],
    queryFn: ({ signal }) =>
      simulateReport({ ...emptyReport, filters: active }, signal, 300, false),
    placeholderData: keepPreviousData
  })
  function update(id: string, patch: Partial<DraftRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }
  return (
    <DemoFrame label="Iteration 01 · Compact sentence rows">
      <Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="body2" color="text.secondary">
          All conditions match · Updates automatically
        </Typography>
        {rows.map((row, index) => {
          const meta = fields.find((f) => f.field === row.field)!
          const incomplete = !makeFilter(row.field, row.operator, row.value)
          const warning =
            row.value.trim() === ''
              ? 'Enter a value to activate this filter.'
              : 'Enter a valid value to activate this filter.'
          return (
            <Box
              key={row.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '48px minmax(0, 200px) max-content minmax(0, 280px) 36px'
                },
                justifyContent: 'start',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Typography variant="body2">{index ? 'and' : 'Where'}</Typography>
              <TextField
                select
                size="small"
                label={`Row ${index + 1} field`}
                value={row.field}
                onChange={(e) => {
                  const field = e.target.value as Field
                  update(row.id, { field, operator: operators(field)[0], value: '' })
                }}
              >
                {fields.map((f) => (
                  <MenuItem key={f.field} value={f.field}>
                    {f.label}
                  </MenuItem>
                ))}
              </TextField>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={row.operator}
                aria-label={`Row ${index + 1} condition`}
                onChange={(_, operator: string | null) => {
                  if (operator) update(row.id, { operator })
                }}
              >
                {operators(row.field).map((op) => (
                  <ToggleButton key={op} value={op}>
                    {meta.type === 'date' && op !== 'is'
                      ? op === 'lessThan'
                        ? 'before'
                        : 'after'
                      : operatorLabels[op]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <TextField
                size="small"
                select={meta.type === 'category'}
                type={meta.type === 'date' ? 'date' : meta.type === 'number' ? 'number' : 'text'}
                label={`Row ${index + 1} value`}
                value={row.value}
                color={incomplete ? 'warning' : 'primary'}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { 'aria-invalid': incomplete },
                  input: {
                    startAdornment: incomplete ? (
                      <InputAdornment position="start">
                        <Tooltip title={warning}>
                          <span
                            role="img"
                            aria-label={`Row ${index + 1} filter inactive: ${warning}`}
                          >
                            <WarningAmberIcon
                              color="warning"
                              fontSize="small"
                              sx={{ display: 'block' }}
                            />
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    ) : undefined
                  }
                }}
                sx={
                  incomplete
                    ? {
                        '& .MuiInputLabel-root': { color: 'warning.main' },
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'warning.subtle',
                          '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline':
                            { borderColor: 'warning.main' }
                        }
                      }
                    : undefined
                }
                onChange={(e) => update(row.id, { value: e.target.value })}
              >
                {meta.type === 'category'
                  ? [
                      <MenuItem key="empty" value="">
                        Choose category
                      </MenuItem>,
                      ...categories.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))
                    ]
                  : null}
              </TextField>
              <IconButton
                aria-label={`Remove row ${index + 1}`}
                onClick={() => setRows((current) => current.filter((r) => r.id !== row.id))}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          )
        })}
        <Button
          size="small"
          startIcon={<AddIcon />}
          sx={{ alignSelf: 'flex-start' }}
          onClick={() =>
            setRows((current) => [
              ...current,
              { id: crypto.randomUUID(), field: 'name', operator: 'includes', value: '' }
            ])
          }
        >
          Add filter
        </Button>
        <Typography role="status" variant="caption" color="text.secondary">
          {query.isFetching ? 'Updating…' : `${query.data?.length ?? 0} matches`}
        </Typography>
      </Stack>
      <Results
        data={query.data ?? []}
        state={emptyReport}
        updating={query.isFetching}
        label="Compact row results"
      />
    </DemoFrame>
  )
}

export function DenseDemo() {
  return (
    <QueryBoundary>
      <DenseWorkspace />
    </QueryBoundary>
  )
}

function ChipsWorkspace() {
  const [filters, setFilters] = useState<Filter[]>([])
  const [grouped, setGrouped] = useState(false)
  const query = useQuery({
    queryKey: ['chip-report', filters],
    queryFn: ({ signal }) => simulateReport({ ...emptyReport, filters }, signal, 350, false),
    placeholderData: keepPreviousData
  })
  return (
    <DemoFrame label="Iteration 02 · Reveal the fields, then stabilize the layout">
      <Stack spacing={2.5} sx={{ p: { xs: 2, md: 3 } }}>
        <FormControlLabel
          control={<Switch checked={grouped} onChange={(_, checked) => setGrouped(checked)} />}
          label="Group fields into stable task rows"
        />
        <FilterBar
          grouped={grouped}
          filters={filters}
          onChange={(field, next) =>
            setFilters((current) => [...current.filter((f) => f.field !== field), ...next])
          }
        />
        <Typography variant="caption" color="text.secondary" role="status">
          {query.isFetching ? 'Updating…' : `${query.data?.length ?? 0} matches`}
        </Typography>
      </Stack>
      <Results
        data={query.data ?? []}
        state={emptyReport}
        updating={query.isFetching}
        label="Field chip results"
      />
    </DemoFrame>
  )
}

export function ChipsDemo() {
  return (
    <QueryBoundary>
      <ChipsWorkspace />
    </QueryBoundary>
  )
}

export function TypeDemo() {
  const [kind, setKind] = useState<Field>('name')
  const [operator, setOperator] = useState('greaterThan')
  const [value, setValue] = useState('Field recorder')
  const filter = makeFilter(kind, operator, value)
  const meta = fields.find((f) => f.field === kind)!
  return (
    <DemoFrame label="Model enhancement · Make invalid combinations unrepresentable">
      <Stack spacing={2} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            select
            size="small"
            label="Type example field"
            value={kind}
            onChange={(e) => setKind(e.target.value as Field)}
            sx={{ flex: 1 }}
          >
            {fields.map((f) => (
              <MenuItem key={f.field} value={f.field}>
                {f.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Type example operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            sx={{ flex: 1 }}
          >
            {Object.entries(operatorLabels).map(([op, label]) => (
              <MenuItem key={op} value={op}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Type example value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Alert severity="info">
          Permissive interface: accepts any field with any listed operator and a string value.
        </Alert>
        <Alert severity={filter ? 'success' : 'error'}>
          {filter
            ? `Validated union: accepted as ${filter.type}. ${filter.type === 'number' ? 'The value is converted to a number.' : ''}`
            : `Validated union: rejected. ${meta.type === 'text' ? 'Text fields support only is or includes.' : meta.type === 'category' ? 'Category must be a known choice with the is operator.' : meta.type === 'date' ? 'Dates need an ordered operator and a valid ISO calendar date.' : 'Numbers need an ordered operator and a finite, nonnegative numeric value.'}`}
        </Alert>
        <Typography variant="caption" color="text.secondary">
          This interactive example runs the URL validator. The TypeScript union enforces the same
          field/operator/value relationships at compile time; it is not a compiler running in the
          browser.
        </Typography>
      </Stack>
    </DemoFrame>
  )
}
