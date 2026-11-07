'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { memo, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { BootArt } from './BootArt'
import { formatRestockDate, productSelection, restockEstimate, selectedVariant, stockFor, type Boot, type BootVariant } from './catalog'
import { RestockSignup } from './RestockSignup'

type ViewProduct = (boot: Boot, color: string) => void

function Colors({ boot, selected, onChange, compact = false }: {
  boot: Boot; selected: string; onChange: (color: string) => void; compact?: boolean
}) {
  return <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap' }} role="group" aria-label={`Colors for ${boot.name}`}>
    {[...new Set(boot.variants.map(variant => variant.color))].map(color => <Button
      key={color} size="small" variant="outlined" disableRipple aria-label={color} title={color}
      aria-pressed={selected === color} onClick={() => onChange(color)}
      sx={{ minWidth: compact ? 24 : 44, minHeight: compact ? 24 : 44, px: compact ? 0.25 : 1.5, py: compact ? 0.25 : undefined, gap: 1, border: 1,
        color: 'text.primary', borderColor: selected === color ? 'text.secondary' : 'divider',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'background.paper', borderColor: 'text.secondary' },
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'text.secondary', outlineOffset: 2 } }}
    >
      <Box component="span" sx={{ display: 'block', width: 16, height: 16, borderRadius: 0.5,
        bgcolor: color === 'Brown' ? 'boot.brown' : color === 'Black' ? 'boot.black' : 'boot.green',
        ...(color === 'Camo' ? { backgroundImage: 'repeating-linear-gradient(45deg, var(--mui-palette-boot-green) 0 4px, var(--mui-palette-boot-brown) 4px 8px)' } : {}) }} />
      {!compact ? color : null}
    </Button>)}
  </Stack>
}

const ProductCard = memo(function ProductCard({ boot, initialColor, onView, onQuickView }: { boot: Boot; initialColor: string; onView: ViewProduct; onQuickView?: ViewProduct }) {
  const [color, setColor] = useState(initialColor)
  const expected = restockEstimate(boot, color)
  return <Box component="article" sx={{ minWidth: 0 }}>
    <ButtonBase onClick={() => onView(boot, color)} aria-label={`View ${boot.name}`}
      sx={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 1,
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
      <Box sx={{ bgcolor: 'primary.subtle', borderRadius: 1, py: 1 }}><BootArt boot={boot} color={color} /></Box>
      <Stack spacing={0.5} sx={{ mt: 1, pb: 1 }}>
        <Typography component="h4" variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>{boot.name}</Typography>
        <Typography variant="caption" color="text.secondary">{boot.height} · {boot.closure.toLowerCase()}</Typography>
        <Typography variant="caption" color="text.secondary">{boot.toe} · {boot.climate.toLowerCase()}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>${boot.price}</Typography>
        {expected ? <Typography variant="caption" color="warning.main">Expected back {formatRestockDate(expected)}</Typography> : null}
      </Stack>
    </ButtonBase>
    <Colors boot={boot} selected={color} onChange={setColor} compact />
    {onQuickView ? <Button fullWidth variant="outlined" onClick={() => onQuickView(boot, color)} sx={{ mt: 1, minHeight: 44 }}>Quick View</Button> : null}
  </Box>
})

export const ProductGrid = memo(function ProductGrid({ results, preferredColors, onView, onQuickView }: {
  results: Boot[]; preferredColors?: string[]; onView: ViewProduct; onQuickView?: ViewProduct
}) {
  return <Box sx={{ px: 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 1.5, rowGap: 3 }}>
    {results.map(boot => {
      const color = boot.variants.find(variant => preferredColors?.includes(variant.color))?.color ?? boot.variants[0].color
      return <ProductCard key={`${boot.id}-${color}`} boot={boot} initialColor={color} onView={onView} onQuickView={onQuickView} />
    })}
  </Box>
})

function Choices({ label, children }: { label: string; children: ReactNode }) {
  return <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
    <Typography component="legend" variant="body2" sx={{ fontWeight: 'fontWeightBold', mb: 1 }}>{label}</Typography>
    {children}
  </Box>
}

function Description({ boot }: { boot: Boot }) {
  const height = boot.height === 'Tall' ? 'a tall shaft' : boot.height === 'Mid calf' ? 'a mid-calf cut' : 'an ankle-height cut'
  const fastening = boot.closure === 'Lace-up'
    ? 'Adjust the laces for a close, secure fit before heading out.'
    : boot.closure === 'Zip-up' ? 'The side zip makes it easy to get ready and go.'
      : 'Pull them on at the door and get on with your day.'
  const lining = boot.lining === 'Fleece'
    ? 'Soft fleece lining adds warmth on cold mornings.'
    : boot.lining === 'Unlined' ? 'The unlined construction keeps things light for warmer days.'
      : 'Breathable mesh lining helps keep your feet comfortable through the day.'
  return <Typography variant="body2" color="text.secondary">
    Made for {boot.activity === 'Everyday' ? 'everyday wear' : boot.activity.toLowerCase()}, the {boot.name} pairs {height} with a {boot.toe.toLowerCase()}.
    {' '}{lining} {fastening}
  </Typography>
}

export function ProductDetails({ boot, initialColor, preferredSize, preferredWidth, onAdd, quickView = false, startingPoint = false }: {
  boot: Boot; initialColor: string; preferredSize?: string; preferredWidth?: string; quickView?: boolean; startingPoint?: boolean
  onAdd: (boot: Boot, variant: BootVariant) => void
}) {
  const [selection, setSelection] = useState(() => productSelection(boot, { color: initialColor, size: preferredSize, width: preferredWidth }))
  const variant = selectedVariant(boot, selection)
  const sizes = [...new Set(boot.variants.filter(variant => variant.color === selection.color && variant.width === selection.width).map(variant => variant.size))].sort((a, b) => Number(a) - Number(b))
  const widths = [...new Set(boot.variants.map(variant => variant.width))]
  const stock = variant ? stockFor(boot, variant) : undefined
  const actionRef = useRef<HTMLDivElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const update = (patch: Partial<BootVariant>) => setSelection(current => productSelection(boot, { ...current, ...patch }))
  const availabilityId = useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    let lastScrolled = false
    const updateHeader = () => {
      const next = scroll.scrollTop > 0
      if (next !== lastScrolled) {
        lastScrolled = next
        setScrolled(next)
      }
    }
    scroll.addEventListener('scroll', updateHeader, { passive: true })
    updateHeader()
    return () => {
      scroll.removeEventListener('scroll', updateHeader)
    }
  }, [])
  const purchase = () => {
    if (variant && stock?.status === 'in-stock') {
      onAdd(boot, variant)
      return
    }
    if (variant && stock?.status === 'restocking') {
      const scroll = scrollRef.current
      const alert = alertRef.current
      if (scroll && alert) {
        const top = scroll.scrollTop + alert.getBoundingClientRect().top - scroll.getBoundingClientRect().top - (startingPoint ? 0 : actionRef.current?.offsetHeight ?? 0)
        scroll.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        alert.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
      }
      return
    }
    const scroll = scrollRef.current
    const options = optionsRef.current
    if (!scroll || !options) return
    const top = scroll.scrollTop + options.getBoundingClientRect().top - scroll.getBoundingClientRect().top
    scroll.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    options.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true })
  }
  const specifications = [
    ['Style number', `MB-${boot.id.padStart(4, '0')}`],
    ['Height', boot.height], ['Boot style', boot.closure], ['Use', boot.activity],
    ['Toe protection', boot.toe], ['Weather', boot.climate], ['Lining', boot.lining],
    ['Widths', widths.join(', ')], ['Sizing', 'US men’s'], ['Collection', boot.collection]
  ]
  const action = <Stack ref={actionRef} spacing={1} data-purchase-action sx={{ position: startingPoint ? 'static' : 'sticky', top: 0, zIndex: 1, py: 2, px: startingPoint ? 2 : 0, borderTop: startingPoint ? 1 : 0, borderBottom: startingPoint ? 0 : 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
    <Button fullWidth variant="contained" aria-describedby={availabilityId}
      onClick={purchase} sx={{ minHeight: 44 }}>{variant ? stock?.status === 'restocking' ? 'Notify me' : 'Add to bag' : 'Select options'}</Button>
    <Box id={availabilityId} aria-live="polite" sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'baseline', gap: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ minHeight: '1.66em' }}>{variant ? `${selection.color} · Size ${selection.size} · ${selection.width} · ${stock?.status === 'restocking' ? 'Out of stock' : 'In stock'}` : '\u00a0'}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 'fontWeightBold' }}>${boot.price.toFixed(2)}</Typography>
    </Box>
    {stock?.status === 'restocking' ? <Typography variant="caption" color="text.secondary">Expected back {formatRestockDate(stock.expected)}</Typography> : null}
  </Stack>
  return <Stack data-product-scrolled={scrolled} sx={{ height: '100%', minHeight: 0 }}>
    <Stack ref={scrollRef} data-product-scroll spacing={3} sx={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto', overflowAnchor: 'none', overscrollBehavior: 'contain', px: 2, pb: 2 }}>
      <Box sx={{ mt: 2, width: quickView ? 96 : '100%', flexShrink: 0, bgcolor: 'primary.subtle', borderRadius: 2 }}><BootArt boot={boot} color={selection.color} /></Box>
      <Stack spacing={1}>
        <Typography variant="h3">{boot.use}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightBold' }}>${boot.price.toFixed(2)}</Typography>
      </Stack>
      <Choices label="Color"><Colors boot={boot} selected={selection.color} onChange={color => update({ color })} /></Choices>
      {widths.length > 1 ? <Choices label="Width">
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {widths.map(width => <Button key={width} variant={selection.width === width ? 'contained' : 'outlined'}
            aria-pressed={selection.width === width} disabled={!boot.variants.some(variant => variant.color === selection.color && variant.width === width)}
            onClick={() => update({ width })} sx={{ minHeight: 44 }}>{width}</Button>)}
        </Stack>
      </Choices> : null}
      <Box ref={optionsRef}>
        <Choices label="Size · US men’s">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))', gap: 1 }}>
            {sizes.map(size => <Button key={size} variant={selection.size === size ? 'contained' : 'outlined'}
              aria-label={`Size ${size}`} aria-pressed={selection.size === size}
              disabled={!boot.variants.some(variant => variant.color === selection.color && variant.width === selection.width && variant.size === size)}
              onClick={() => update({ size })} sx={{ minHeight: 44, minWidth: 44, px: 0.5 }}>{size}</Button>)}
          </Box>
        </Choices>
      </Box>
      {!startingPoint ? action : null}
      {variant && stock?.status === 'restocking' ? <Box ref={alertRef} component="section">
        <RestockSignup key={`${boot.id}-${variant.color}-${variant.size}-${variant.width}`} boot={boot} variant={variant} />
      </Box> : null}
      {!quickView ? <Box component="section">
        <Typography variant="h3" component="h4" sx={{ mb: 2 }}>Description</Typography>
        <Description boot={boot} />
      </Box> : null}
      {!quickView ? <Box component="section" sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h3" component="h4" sx={{ mb: 2 }}>Specifications</Typography>
        <Box component="dl" sx={{ m: 0 }}>
          {specifications.map(([label, value]) => <Box key={label} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)', alignItems: 'baseline', gap: 2, py: 0.75, borderBottom: 1, borderColor: 'divider' }}>
            <Typography component="dt" variant="caption" color="text.secondary">{label}</Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0 }}>{value}</Typography>
          </Box>)}
        </Box>
      </Box> : null}
    </Stack>
    {startingPoint ? action : null}
  </Stack>
}
