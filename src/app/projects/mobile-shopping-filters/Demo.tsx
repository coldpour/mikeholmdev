'use client'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import NativeSelect from '@mui/material/NativeSelect'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createContext, memo, useCallback, useContext, useDeferredValue, useEffect, useId, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { BootArt } from './BootArt'
import { ProductDetails, ProductGrid } from './Products'
import {
  boots, extraSortOptions, facets, initialFilters, optionCount, orderedFilterFields, recordFilterUse, selectBoots,
  sortOptions, stockFor, toggleFilter, type Boot, type BootVariant, type BagItem, type Field, type Filters, type Sort
} from './catalog'

type Stage = 'start' | 'reachable' | 'focused' | 'final'
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const stageContent: Record<Stage, { label: string; title: string; intro: string; notes: string[] }> = {
  start: {
    label: '00 / The starting point', title: 'A lot of site. Not much shopping.',
    intro: 'An animated offer and a tall campaign hero come before the boots. Scroll to shop, open the filters, then try clearing them.',
    notes: ['Promotions and a tall hero push products below the fold.', 'Filters and the bag scroll away with the header.', 'Dismissed promotions return when filters open.', 'Technical details compete with basic fit.', 'The footer offers no useful next step.']
  },
  reachable: {
    label: '01 / Keep the task within reach', title: 'Change your mind without losing your place.',
    intro: 'Scroll down, then open Filters. The controls stay put. Close the panel and you are still where you left off.',
    notes: ['A sticky toolbar follows the results.', 'Selected filters can be removed individually.', 'Promotions leave the browsing experience.', 'Clear and Show results stay visible in the panel.']
  },
  focused: {
    label: '02 / Make the choices useful', title: 'Start with what rules a boot out.',
    intro: 'Try Wide, Cold weather, or Camo. Fit comes first. Specialist details wait until you need them.',
    notes: ['Size, width and height lead the panel.', 'Weather comes before lining specifications.', 'One color and pattern section contains the camo details.', 'Five useful sort choices replace nine competing options.']
  },
  final: {
    label: '03 / The finished experience', title: 'Browse. Rule things out. Keep going.',
    intro: 'Start with 147 styles. Find ankle boots in size 10, choose lace-up or slip-on, then narrow down the fit and weather.',
    notes: ['Filters stay available while you browse.', 'One card per boot, with its colors together.', 'The last result leads to a clear endpoint.', 'The welcome offer waits in the bag.']
  }
}

const welcomeOffers = ['Welcome! Take 10% off your first order.', 'Free shipping on orders $99+.', 'Just in: boots for the long weekend.']

function WelcomeCarousel() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  useEffect(() => {
    if (paused || reducedMotion) return
    const timer = window.setInterval(() => setSlide(current => (current + 1) % welcomeOffers.length), 3500)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])
  return <Stack role="region" aria-label="Store offers" aria-roledescription="carousel" direction="row"
    sx={{ alignItems: 'center', minHeight: 64, px: 0.5, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
    <IconButton aria-label="Previous offer" onClick={() => setSlide(current => (current + welcomeOffers.length - 1) % welcomeOffers.length)} sx={{ color: 'inherit', minWidth: 44, minHeight: 44 }}><ArrowBackIcon fontSize="small" /></IconButton>
    <Typography variant="caption" sx={{ flex: 1, textAlign: 'center', fontWeight: 'fontWeightBold', animation: paused || reducedMotion ? 'none' : 'offer-pulse 1.8s ease-in-out infinite', '@keyframes offer-pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.55 } } }}>{welcomeOffers[slide]}</Typography>
    <IconButton aria-label="Next offer" onClick={() => setSlide(current => (current + 1) % welcomeOffers.length)} sx={{ color: 'inherit', minWidth: 44, minHeight: 44 }}><ArrowForwardIcon fontSize="small" /></IconButton>
    {!reducedMotion ? <IconButton aria-label={paused ? 'Play offers' : 'Pause offers'} onClick={() => setPaused(current => !current)} sx={{ color: 'inherit', minWidth: 44, minHeight: 44 }}>{paused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}</IconButton> : null}
  </Stack>
}

function CampaignHero() {
  return <Box aria-label="Everyday outside collection" sx={{ position: 'relative', minHeight: 420, overflow: 'hidden', bgcolor: 'primary.subtle', display: 'flex', alignItems: 'flex-end', p: 3 }}>
    <Box sx={{ position: 'absolute', inset: 0, bottom: 'auto', height: 260, overflow: 'hidden' }}>
      <Box sx={{ width: '100%', transform: 'rotate(-12deg)', mt: -3 }}><BootArt boot={boots.find(boot => boot.height === 'Tall')!} color="Green" /></Box>
    </Box>
    <Stack spacing={1} sx={{ position: 'relative', maxWidth: '80%' }}>
      <Typography variant="overline">The everyday outside</Typography>
      <Typography variant="h2" component="h4">Go all in.<br />Stay dry.</Typography>
      <Typography variant="body2">Good boots for whatever’s out there.</Typography>
    </Stack>
  </Box>
}


function SortSelect({ value, onChange, crowded = false }: { value: Sort; onChange: (sort: Sort) => void; crowded?: boolean }) {
  return (
    <NativeSelect
      variant="outlined"
      input={<OutlinedInput notched={false} />}
      value={value}
      onChange={event => onChange(event.target.value as Sort)}
      inputProps={{ 'aria-label': 'Sort boots' }}
      sx={{ typography: 'caption', minWidth: 0, maxWidth: '100%', '& select': { minHeight: 44, boxSizing: 'border-box', py: 1, pl: 1 } }}
    >
      {[...sortOptions, ...(crowded ? extraSortOptions : [])].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </NativeSelect>
  )
}

const FilterChoice = memo(function FilterChoice({ field, value, selected, disabled, count, onToggle }: {
  field: Field; value: string; selected: boolean; disabled: boolean; count?: number
  onToggle: (field: Field, value: string) => void
}) {
  return <FormControlLabel sx={{ m: 0, minHeight: 44, minWidth: 0 }}
    control={<Checkbox size="small" checked={selected} disabled={disabled} sx={field === 'size' ? { p: 0.5 } : undefined} onChange={() => onToggle(field, value)} />}
    label={<Typography variant="body2">{value}{count !== undefined ? <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'inline-block', width: '5ch', textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}> ({count})</Typography> : null}</Typography>}
  />
})

function FilterChoices({ field, selectedValues, onToggle, counted }: { field: Field; selectedValues?: string[]; onToggle: (field: Field, value: string) => void; counted: boolean }) {
  const { filters, pending } = useContext(CountsContext)
  const counts = useMemo(() => counted
    ? Object.fromEntries(facets[field].options.map(value => [value, optionCount(filters, field, value)]))
    : {}, [counted, field, filters])
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: field === 'size' ? 'repeat(auto-fit, minmax(96px, 1fr))' : '1fr' }}>
      {facets[field].options.map(value => {
        const selected = selectedValues?.includes(value) ?? false
        const count = counted ? counts[value] : undefined
        return (
          <FilterChoice key={value} field={field} value={value} selected={selected}
            disabled={!pending && count === 0 && !selected} count={count} onToggle={onToggle} />
        )
      })}
    </Box>
  )
}

const Facet = memo(function Facet({ field, selected, camoBrand, camoPattern, onToggle, curated }: { field: Field; selected?: string[]; camoBrand?: string[]; camoPattern?: string[]; onToggle: (field: Field, value: string) => void; curated: boolean }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Accordion disableGutters elevation={0} slotProps={{ transition: { timeout: 0, unmountOnExit: true } }} expanded={expanded} onChange={(_, open) => setExpanded(open)} sx={{ bgcolor: 'transparent', borderBottom: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, height: 44, minHeight: 44, '&.Mui-expanded': { minHeight: 44 }, '& .MuiAccordionSummary-content': { my: 1, minWidth: 0 } }}>
        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, flex: 1, alignItems: 'baseline' }}>
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold', flexShrink: 0 }}>{facets[field].label}</Typography>
          {!expanded ? <Typography variant="caption" color="primary.main" noWrap sx={{ minWidth: 0 }}>{facets[field].options.filter(value => selected?.includes(value)).join(', ')}</Typography> : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0 }}>
        <FilterChoices field={field} selectedValues={selected} onToggle={onToggle} counted={curated} />
        {field === 'color' && curated ? (
          <Box component="details" sx={{ mt: 2, pl: 2, borderLeft: 2, borderColor: 'divider' }}>
            <Typography component="summary" variant="caption" sx={{ minHeight: 44, cursor: 'pointer' }}>Camouflage details (optional)</Typography>
            {(['camoBrand', 'camoPattern'] as const).map(detail => <Box key={detail}>
              <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>{facets[detail].label}</Typography>
              <FilterChoices field={detail} selectedValues={detail === 'camoBrand' ? camoBrand : camoPattern} onToggle={onToggle} counted />
            </Box>)}
          </Box>
        ) : null}
      </AccordionDetails>
    </Accordion>
  )
})

function PhoneModal({ open, title, onClose, children, footer, scrolledHeading, containerRef, keepMounted = false, scrollable = true, drawer = false }: { drawer?: boolean; keepMounted?: boolean; scrollable?: boolean; open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; scrolledHeading?: ReactNode; containerRef: RefObject<HTMLDivElement | null> }) {
  const titleId = useId()
  return (
    <Modal open={open} keepMounted={keepMounted} onClose={onClose} disablePortal disableScrollLock container={() => containerRef.current!}
      aria-labelledby={titleId}
      sx={{ position: 'absolute' }} slotProps={{ backdrop: { transitionDuration: 0, sx: { position: 'absolute' } } }}>
      <Box role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} data-drawer={drawer || undefined}
        sx={{ position: 'absolute', inset: 0, top: drawer ? '12%' : 0, borderTopLeftRadius: drawer ? 2 : 0, borderTopRightRadius: drawer ? 2 : 0, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', outline: 0,
          '&:has([data-product-scrolled="true"]) > [data-modal-heading]': { borderColor: 'divider' },
          ...(scrolledHeading ? {
            '&:has([data-product-scrolled="true"]) [data-product-title]': { display: 'none' },
            '&:has([data-product-scrolled="true"]) [data-scrolled-heading]': { display: 'flex' }
          } : {}) }}>
        <Stack data-modal-heading direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: 1, borderColor: scrollable ? 'divider' : 'transparent' }}>
          <Typography data-product-title id={titleId} variant="h3" component="h4">{title}</Typography>
          {scrolledHeading ? <Box data-scrolled-heading sx={{ display: 'none', flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'space-between' }}>{scrolledHeading}</Box> : null}
          <IconButton onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} sx={{ minWidth: 44, minHeight: 44 }}><CloseIcon /></IconButton>
        </Stack>
        <Box sx={{ overflowY: scrollable ? 'auto' : 'hidden', overflowAnchor: 'none', overscrollBehavior: 'contain', flex: 1, minHeight: 0, p: scrollable ? 2 : 0 }}>{children}</Box>
        {footer ? <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', pb: theme => `max(${theme.spacing(2)}, env(safe-area-inset-bottom))` }}>{footer}</Box> : null}
      </Box>
    </Modal>
  )
}

const CountsContext = createContext<{ filters: Filters; pending: boolean }>({ filters: initialFilters, pending: false })

function FilterPanel({ open, containerRef, filters, usage, sort, curated, onClose, onApply }: {
  open: boolean
  containerRef: RefObject<HTMLDivElement | null>
  filters: Filters
  usage: Field[]
  sort: Sort
  curated: boolean
  onClose: () => void
  onApply: (filters: Filters, sort: Sort, usage: Field[]) => void
}) {
  // Selection stays urgent and local. Browsing results do not render while editing.
  const [draftState, setDraftState] = useState({ filters, usage })
  const draft = draftState.filters
  const fields = useMemo(() => orderedFilterFields(filters, usage), [filters, usage])
  const [draftSort, setDraftSort] = useState(sort)
  const [session, setSession] = useState(0)
  const close = () => {
    onClose()
    setDraftState({ filters, usage })
    setDraftSort(sort)
    setSession(value => value + 1)
  }
  const deferred = useDeferredValue(draft)
  const pending = deferred !== draft
  const toggle = useCallback((field: Field, value: string) => {
    setDraftState(current => {
      const next = toggleFilter(current.filters, field, value)
      return { filters: next, usage: recordFilterUse(current.usage, current.filters, next, field) }
    })
  }, [])
  const draftCount = useMemo(() => selectBoots(deferred, 'recommended').length, [deferred])
  const countState = useMemo(() => ({ filters: deferred, pending }), [deferred, pending])
  return <CountsContext.Provider value={countState}>
      <PhoneModal containerRef={containerRef} open={open} keepMounted title={curated ? 'Find your boots' : 'Sort & filter'} onClose={close}
        footer={<Stack direction="row" spacing={1}>
          <Button sx={{ minHeight: 44 }} onClick={() => setDraftState(current => ({ ...current, filters: {} }))}>Clear filters</Button>
          <Button sx={{ flex: 1, minHeight: 44 }} variant="contained" onClick={() => { onApply(draft, draftSort, draftState.usage); setSession(value => value + 1) }} aria-busy={pending}>{pending ? 'Show results' : `Show ${draftCount} ${draftCount === 1 ? 'boot' : 'boots'}`}</Button>
        </Stack>}>
        {!curated ? <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Choose from all available product attributes.</Typography> : null}
        {!curated ? <Box sx={{ mb: 2 }}><Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>Sort by</Typography><SortSelect value={draftSort} onChange={setDraftSort} crowded /></Box> : null}
        {(curated
          ? fields
          : ['price', 'size', 'width', 'height', 'color', 'toe', 'lining', 'camoBrand', 'camoPattern', 'climate', 'collection', 'closure', 'activity'] as Field[]
        ).map(field => <Facet key={`${session}-${field}`} field={field} selected={draft[field]} camoBrand={field === 'color' ? draft.camoBrand : undefined} camoPattern={field === 'color' ? draft.camoPattern : undefined} onToggle={toggle} curated={curated} />)}
      </PhoneModal>
  </CountsContext.Provider>
}

function Promotions({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  if (!visible) return null
  return <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: theme => theme.zIndex.modal + 1 }}>
    {visible ? <Stack direction="row" sx={{ position: 'absolute', bottom: 20, left: 8, alignItems: 'center', bgcolor: 'warning.main', color: 'warning.contrastText', pointerEvents: 'auto', boxShadow: 3 }}>
      <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold', pl: 2 }}>GET 10% OFF</Typography>
      <IconButton aria-label="Dismiss welcome offer" onClick={onDismiss} sx={{ color: 'inherit', minHeight: 44, minWidth: 44 }}><CloseIcon /></IconButton>
    </Stack> : null}
    <Button onClick={onDismiss} sx={{ position: 'absolute', right: 8, bottom: 96, bgcolor: 'warning.main', color: 'warning.contrastText', pointerEvents: 'auto' }}>Offers +</Button>
    <IconButton aria-label="Dismiss chat bubble" onClick={onDismiss} sx={{ position: 'absolute', right: 8, bottom: 16, width: 64, height: 64, bgcolor: 'primary.main', color: 'primary.contrastText', pointerEvents: 'auto', boxShadow: 3 }}>•••</IconButton>
  </Box>
}


function Shop({ stage }: { stage: Stage }) {
  const broken = stage === 'start'
  const storeName = broken ? 'SAD BOOT STORE' : 'MIKE’S BOOT CO.'
  const curated = stage === 'focused' || stage === 'final'
  const finished = stage === 'final'
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [usage, setUsage] = useState<Field[]>([])
  const [sort, setSort] = useState<Sort>('recommended')
  const [panel, setPanel] = useState(false)
  const [offer, setOffer] = useState(true)
  const [product, setProduct] = useState<{ boot: Boot; color: string; quick?: boolean } | null>(null)
  const [bag, setBag] = useState<BagItem[]>([])
  const [bagOpen, setBagOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const brandHeader = useRef<HTMLDivElement>(null)
  const results = useMemo(() => selectBoots(filters, sort), [filters, sort])
  const active = Object.entries(filters).flatMap(([field, values]) => values!.map(value => ({ field: field as Field, value })))
  const subtotal = bag.reduce((sum, item) => sum + Math.round(item.boot.price * 100), 0)
  const discount = broken ? 0 : Math.round(subtotal * 0.1)
  const total = subtotal - discount
  const viewProduct = useCallback((boot: Boot, color: string) => {
    setProduct({ boot, color })
    if (broken) setOffer(true)
  }, [broken])
  const quickViewProduct = useCallback((boot: Boot, color: string) => setProduct({ boot, color, quick: true }), [])
  const addToBag = (boot: Boot, variant: BootVariant) => {
    if (!boot.variants.includes(variant) || stockFor(boot, variant).status !== 'in-stock') return
    setBag(current => [...current, { boot, variant }])
    setProduct(null)
    setCheckout(false)
    setBagOpen(true)
  }
  const openFilters = () => {
    setPanel(true)
    if (broken) setOffer(true)
  }
  const apply = (draft: Filters, draftSort: Sort, draftUsage: Field[]) => {
    const changed = JSON.stringify(filters) !== JSON.stringify(draft) || sort !== draftSort
    setFilters(draft)
    setUsage(draftUsage)
    setSort(draftSort)
    setPanel(false)
    if (changed) scroll.current?.scrollTo({ top: 0, behavior: 'instant' })
  }
  const reset = () => {
    setFilters(initialFilters); setUsage([]); setSort('recommended')
    setPanel(false); setProduct(null); setBagOpen(false); setBag([]); setOffer(true); setCheckout(false)
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' })
  }
  const bagButton = (inToolbar = false) => <IconButton data-toolbar-bag={inToolbar || undefined} color={inToolbar ? 'primary' : 'inherit'} aria-label={`Open bag, ${bag.length} items`} onClick={() => { setCheckout(false); setBagOpen(true) }} sx={{ minWidth: 44, minHeight: 44, flexShrink: 0, visibility: inToolbar ? 'hidden' : 'visible' }}><ShoppingBagOutlinedIcon /><Typography variant="caption">{bag.length || ''}</Typography></IconButton>
  const toolbar = <Box data-shop-toolbar sx={{ position: broken ? 'static' : 'sticky', top: 0, zIndex: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Button size="small" variant="outlined" startIcon={<FilterListIcon />} onClick={openFilters} sx={{ minHeight: 44, minWidth: 0, px: 1, flexShrink: 0 }}>Filters{active.length ? ` (${active.length})` : ''}</Button>
      <Box sx={{ flex: 1, minWidth: 0, '& .MuiInputBase-root': { width: '100%' } }}>
        <SortSelect value={sort} onChange={setSort} crowded={!curated} />
      </Box>
      {!broken ? bagButton(true) : null}
    </Stack>
    {!broken && active.length ? <Stack direction="row" spacing={0.75} sx={{ overflowX: 'auto', pt: 1, pb: 0.5 }} aria-label="Applied filters">
      {active.map(({ field, value }) => <Chip key={`${field}-${value}`} size="small" label={field === 'size' ? `Size ${value}` : value}
        aria-label={`Remove ${field === 'size' ? 'size ' : ''}${value} filter`}
        onClick={() => setFilters(toggleFilter(filters, field, value))}
        onDelete={() => setFilters(toggleFilter(filters, field, value))}
        sx={{ flexShrink: 0, height: 44, '& .MuiChip-deleteIcon': { minWidth: 24, minHeight: 24 } }} />)}
    </Stack> : null}
  </Box>

  return <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 390, mx: 'auto' }}>
    <Box ref={frame} sx={{ position: 'relative', isolation: 'isolate', height: 640, maxHeight: '80svh', minHeight: 420, border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: 4, transform: 'translateZ(0)' }}>
      <Box ref={scroll} role="region" aria-label={`${stageContent[stage].label} mobile shop`} tabIndex={0}
        onScroll={event => {
          if (broken) return
          const viewport = event.currentTarget
          const scrolled = String(viewport.scrollTop >= (brandHeader.current?.offsetHeight ?? 0))
          if (viewport.dataset.brandScrolled !== scrolled) viewport.dataset.brandScrolled = scrolled
        }}
        sx={{ height: '100%', overflowY: 'auto', overscrollBehavior: 'contain', scrollbarWidth: 'thin', '&[data-brand-scrolled="true"] [data-toolbar-bag]': { visibility: 'visible' } }}>
        {broken ? <WelcomeCarousel /> : null}
        <Stack ref={brandHeader} data-brand-header direction="row" sx={{ px: 2, py: 1.5, alignItems: 'center', justifyContent: 'space-between', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Box><Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>{storeName}</Typography><Typography variant="caption">Good boots. Go outside.</Typography></Box>
          {bagButton()}
        </Stack>
        {broken ? <CampaignHero /> : null}
        <Box sx={{ px: 2, pt: 3, pb: 2 }}>
          <Typography variant="overline">Made for the everyday outside</Typography>
          <Typography variant="h2" component="h4" sx={{ mt: 1 }}>Find your next pair.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{broken ? 'From wet mornings to muddy trails, our boots are made for every way you get outside. Discover dependable comfort, hard-wearing soles and a fit that feels like yours. Your next adventure starts here.' : 'Wet mornings. Muddy paths. Your kind of day.'}</Typography>
        </Box>
        {toolbar}
        <Box sx={{ px: 2, py: 1.5 }}><Typography variant="caption" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'boot matches' : 'boots match'}{active.length ? ' your filters' : ''}</Typography></Box>
        {results.length ? <ProductGrid results={results} preferredColors={filters.color} onView={viewProduct} onQuickView={broken ? quickViewProduct : undefined} /> : <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h3">No boots match this combination.</Typography>
          <Typography variant="body2" color="text.secondary">Try removing a filter. We’ll keep the rest of your choices.</Typography>
          <Button variant="contained" onClick={openFilters}>Adjust filters</Button>
          <Button onClick={() => setFilters({})}>Clear all filters</Button>
        </Stack>}
        {finished ? <Stack spacing={1.5} sx={{ mx: 2, mt: 4, mb: 2, p: 2.5, bgcolor: 'primary.subtle', borderRadius: 2, alignItems: 'flex-start' }}>
          <Typography variant="overline">You’re all caught up</Typography>
          <Typography variant="body2">{results.length ? `You’ve seen all ${results.length} boots${active.length ? ' matching your filters' : ''}.` : 'That’s every match for these choices.'}</Typography>
          <Button variant="contained" onClick={openFilters}>Adjust filters</Button>
          {active.length ? <Button onClick={() => setFilters({})}>Browse all {boots.length} boots</Button> : null}
        </Stack> : null}
        <Box component="footer" sx={{ mt: 4, px: 2, py: finished ? 2 : 4, borderTop: 1, borderColor: 'divider' }}>
          {finished ? <>
            <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>MIKE’S BOOT CO.</Typography>
            <Box component="details" sx={{ mt: 2 }}><Typography component="summary" variant="caption" sx={{ cursor: 'pointer', minHeight: 44 }}>Help & company information</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2">Size & fit</Typography>
                <Typography variant="caption" color="text.secondary">Sizes are shown in US men’s sizing. Regular and wide fits are available on selected styles.</Typography>
                <Typography variant="body2">Boot care</Typography>
                <Typography variant="caption" color="text.secondary">Wipe away dirt with a damp cloth and let your boots air dry.</Typography>
                <Typography variant="caption" color="text.secondary">Mike’s Boot Company. Good boots for the everyday outside.</Typography>
              </Stack>
            </Box>
          </> : <Stack spacing={3}>
            <Typography variant="h3">Join the club.</Typography>
            <Typography variant="body2">Offers, updates and more reasons to get outside.</Typography>
            {['Customer care', 'Our story', 'Our ambassadors', 'Partnerships', 'Careers', 'Find a store', 'Follow us', 'Terms & conditions', 'Privacy policy'].map(text => <Typography key={text} variant="body2" color="text.secondary">{text}</Typography>)}
            <Typography variant="caption">© {broken ? 'Sad Boot Store' : 'Mike’s Boot Company'}</Typography>
          </Stack>}
        </Box>
      </Box>

      <FilterPanel key={JSON.stringify([filters, sort, usage])} open={panel} containerRef={frame} filters={filters} usage={usage} sort={sort} curated={curated}
        onClose={() => setPanel(false)} onApply={apply} />

      <PhoneModal containerRef={frame} scrollable={false} drawer={product?.quick} open={product !== null} title={product?.boot.name ?? 'Boot details'} onClose={() => setProduct(null)}
        scrolledHeading={broken && !product?.quick ? <><Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>{storeName}</Typography>{bagButton()}</> : undefined}>
        {product ? <ProductDetails key={`${product.boot.id}-${product.color}-${product.quick}`} boot={product.boot} initialColor={product.color} quickView={product.quick}
          startingPoint={broken} preferredSize={filters.size?.[0]} preferredWidth={filters.width?.[0]} onAdd={addToBag} /> : null}
      </PhoneModal>

      <PhoneModal containerRef={frame} open={bagOpen} title={checkout ? 'Checkout' : 'Your bag'} onClose={() => setBagOpen(false)}
        footer={<Stack spacing={2}>
          {bag.length ? <Stack component="dl" direction="row" sx={{ justifyContent: 'space-between', gap: 2, m: 0 }}>
            <Typography component="dt" variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>Total</Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: 'fontWeightBold' }}>{currency.format(total / 100)}</Typography>
          </Stack> : null}
          {checkout ? <Button fullWidth variant="outlined" sx={{ minHeight: 44 }} onClick={() => setCheckout(false)}>Back to bag</Button> : <Stack spacing={1}>
            <Button fullWidth variant="contained" endIcon={<ArrowForwardIcon />} disabled={!bag.length} sx={{ minHeight: 44 }} onClick={() => setCheckout(true)}>Checkout</Button>
            <Button fullWidth sx={{ minHeight: 44 }} onClick={() => setBagOpen(false)}>Keep browsing</Button>
          </Stack>}
        </Stack>}>
        <Stack spacing={2}>
          {checkout || !bag.length ? <Typography variant="body2">{checkout ? 'Order summary' : 'Your bag is empty. Find your next pair.'}</Typography> : null}
          {bag.map((item, index) => <Stack key={`${item.boot.id}-${index}`} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 80, flexShrink: 0, bgcolor: 'primary.subtle', borderRadius: 1 }}><BootArt boot={item.boot} color={item.variant.color} /></Box>
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>{item.boot.name}</Typography>
              <Typography variant="caption" color="text.secondary">{item.variant.color} · Size {item.variant.size} · {item.variant.width}</Typography>
              <Typography variant="body2">{currency.format(item.boot.price)}</Typography>
            </Stack>
          </Stack>)}
          {bag.length && !broken ? <Box sx={{ p: 2, bgcolor: 'primary.subtle', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>Welcome to your first pair.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Take 10% off your first order.</Typography>
          </Box> : null}
          {bag.length ? <Stack component="dl" spacing={1.5} sx={{ m: 0, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
              <Typography component="dt" variant="body2">Subtotal</Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0 }}>{currency.format(subtotal / 100)}</Typography>
            </Stack>
            {!broken ? <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2, color: 'primary.main' }}>
              <Typography component="dt" variant="body2">Welcome discount (10%)</Typography>
              <Typography component="dd" variant="body2" sx={{ m: 0 }}>−{currency.format(discount / 100)}</Typography>
            </Stack> : null}
          </Stack> : null}
          {bag.length ? <Typography variant="caption" color="text.secondary">Shipping and taxes calculated at checkout.</Typography> : null}
        </Stack>
      </PhoneModal>
      {broken ? <Promotions visible={offer} onDismiss={() => setOffer(false)} /> : null}
    </Box>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary">Scroll to browse</Typography>
      <Button size="small" onClick={reset}>Reset view</Button>
    </Stack>
  </Stack>
}

export function ShoppingDemo({ stage = 'final' }: { stage?: Stage }) {
  const content = stageContent[stage]
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', p: { xs: 2, md: 4 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 390px)' }, gap: { xs: 3, md: 5 }, alignItems: 'center' }}>
      <Stack spacing={3}>
        <Typography variant="overline">{content.label}</Typography>
        <Typography variant="h3">{content.title}</Typography>
        <Typography variant="body2" color="text.secondary">{content.intro}</Typography>
        <Stack spacing={2}>
          {content.notes.map((note, index) => <Stack key={note} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
            {stage === 'start' ? <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'fontWeightBold' }}>0{index + 1}</Typography> : <CheckIcon fontSize="small" color="primary" />}
            <Typography variant="body2">{note}</Typography>
          </Stack>)}
        </Stack>
      </Stack>
      <Shop stage={stage} />
    </Box>
  )
}
