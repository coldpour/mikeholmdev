'use client'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DownloadIcon from '@mui/icons-material/Download'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import RemoveIcon from '@mui/icons-material/Remove'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Skeleton from '@mui/material/Skeleton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha, createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { useMemo, useState } from 'react'

type PreviewState = 'ready' | 'loading' | 'partial' | 'error'
type Partner = 'harbor' | 'summit'

const partnerThemes = {
  harbor: {
    name: 'Harbor Home Finance',
    primary: '#315b75',
    accent: '#cf6f4f',
    surface: '#f5f8fa'
  },
  summit: {
    name: 'Summit Lending Co.',
    primary: '#51417d',
    accent: '#2f7a68',
    surface: '#f7f5fb'
  }
} as const

function DemoFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1.25 }}>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}

function ValueTrendChart() {
  return (
    <Box
      aria-label="Home value trend from 2022 to 2026"
      component="svg"
      role="img"
      sx={{ display: 'block', width: '100%', height: { xs: 110, sm: 132 }, color: 'primary.main' }}
      viewBox="0 0 420 140"
    >
      {[24, 60, 96, 132].map(y => (
        <line
          key={y}
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="1"
          x1="16"
          x2="404"
          y1={y}
          y2={y}
        />
      ))}
      <path
        d="M16 116 C58 112 86 102 124 94 C164 86 188 91 224 78 C264 64 288 66 324 48 C356 33 378 39 404 27 L404 132 L16 132 Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M16 116 C58 112 86 102 124 94 C164 86 188 91 224 78 C264 64 288 66 324 48 C356 33 378 39 404 27"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      {[
        [16, 116],
        [124, 94],
        [224, 78],
        [324, 48],
        [404, 27]
      ].map(([x, y]) => (
        <circle
          cx={x}
          cy={y}
          fill="var(--mui-palette-background-paper)"
          key={`${x}-${y}`}
          r="5"
          stroke="currentColor"
          strokeWidth="3"
        />
      ))}
    </Box>
  )
}

function LoadingDigestCards() {
  return (
    <>
      <Card aria-busy="true">
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Skeleton width="52%" />
              <Skeleton height={58} width="44%" />
              <Skeleton width="34%" />
            </Stack>
            <Skeleton height={132} variant="rounded" width="100%" />
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2.5 }}>
              <Skeleton width="28%" />
              <Skeleton height={48} width="42%" />
              <Skeleton width="32%" />
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Card aria-busy="true">
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Skeleton height={38} width="58%" />
          <Skeleton width="76%" />
          <Skeleton height={28} sx={{ mt: 3 }} variant="rounded" width="100%" />
        </CardContent>
      </Card>
    </>
  )
}

const systemNotes = [
  'One shared EquitySummary component',
  'Theme variables supply spacing, typography and color',
  'Responsive and state behavior changes once',
  'Every consuming page receives the same fix'
]

const pageNotes = [
  'The pattern is repeated in page stylesheets',
  'Values and responsive rules live with each page',
  'A state fix must be applied to every copy',
  'Visual review happens page by page'
]

function ComparisonColumn({ systemized }: { systemized: boolean }) {
  const title = systemized ? 'Shared system' : 'Page CSS'
  const notes = systemized ? systemNotes : pageNotes

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Typography component="h3" variant="h3">
        {title}
      </Typography>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          backgroundColor: 'background.default'
        }}
      >
        <Typography component="h4" variant="h3">
          Your estimated equity
        </Typography>
        <Typography sx={{ color: 'primary.main', my: 2 }} variant="h2">
          $318,400
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Home value minus the outstanding loan balance.
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined">
          View calculation
        </Button>
      </Box>
      <Box component="ul" sx={{ display: 'grid', gap: 1, m: 0, pl: 2.5 }}>
        {notes.map(item => (
          <Typography component="li" key={item} variant="body2">
            {item}
          </Typography>
        ))}
      </Box>
    </Stack>
  )
}

export function BeforeAfterDemo() {
  return (
    <DemoFrame label="The interface stayed familiar while its implementation became reusable.">
      <Grid container spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ComparisonColumn systemized={false} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ComparisonColumn systemized />
        </Grid>
      </Grid>
    </DemoFrame>
  )
}

function EquityPreview({ partner, state }: { partner: Partner; state: PreviewState }) {
  const config = partnerThemes[partner]
  const [expanded, setExpanded] = useState(false)
  const [extraPayment, setExtraPayment] = useState(200)
  const homeValue = 640000
  const loanBalance = 321600
  const equity = homeValue - loanBalance
  const yearsSaved = Math.max(1, Math.round(extraPayment / 120))

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: config.primary },
          secondary: { main: config.accent },
          background: { default: config.surface, paper: '#ffffff' }
        },
        typography: { fontFamily: 'Arial, Helvetica, sans-serif' },
        shape: { borderRadius: 10 }
      }),
    [config]
  )

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>{config.name}</Typography>
            <Chip label="Sample digest" size="small" />
          </Stack>

          {state === 'loading' ? (
            <LoadingDigestCards />
          ) : state === 'error' ? (
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  <ErrorOutlineIcon color="error" />
                  <Box>
                    <Typography component="h4" variant="h3">
                      We couldn’t load this estimate
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                      Your other digest information is still available.
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="outlined">
                      Try again
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                <Stack spacing={2.5}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      The estimated value of your home is
                    </Typography>
                    <Typography
                      component="p"
                      sx={{ color: 'primary.main', fontSize: { xs: '2.4rem', sm: '3.4rem' }, lineHeight: 1.15 }}
                    >
                      ${homeValue.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Up 4.8% over the last year
                    </Typography>
                  </Box>

                  <ValueTrendChart />

                  <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2.5 }}>
                    <Typography color="text.secondary" variant="body2">
                      Estimated equity
                    </Typography>
                    <Typography component="p" variant="h2">
                      ${equity.toLocaleString()}
                    </Typography>
                    {state === 'partial' ? (
                      <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                        Add your current loan balance to improve this estimate.
                      </Typography>
                    ) : (
                      <Button
                        aria-expanded={expanded}
                        endIcon={
                          <ExpandMoreIcon
                            sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }}
                          />
                        }
                        onClick={() => setExpanded(value => !value)}
                        sx={{ mt: 1 }}
                      >
                        {expanded ? 'Hide calculation' : 'View calculation'}
                      </Button>
                    )}
                    <Collapse in={expanded && state !== 'partial'}>
                      <Grid container spacing={1.5} sx={{ mt: 1 }}>
                        {[
                          ['Home value', homeValue],
                          ['Loan balance', -loanBalance],
                          ['Estimated equity', equity]
                        ].map(([label, value]) => (
                          <Grid key={label} size={{ xs: 12, sm: 4 }}>
                            <Typography color="text.secondary" variant="body2">
                              {label}
                            </Typography>
                            <Typography sx={{ fontWeight: 700 }}>
                              {Number(value) < 0 ? '−' : ''}${Math.abs(Number(value)).toLocaleString()}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Collapse>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {state !== 'error' && state !== 'loading' ? (
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography component="h4" variant="h3">
                  Pay a little more, finish sooner
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                  See how an additional payment changes the payoff timeline.
                </Typography>
                <Box sx={{ px: 1, pt: 5, pb: 1 }}>
                  <Slider
                    aria-label="Additional monthly payment"
                    max={600}
                    min={0}
                    onChange={(_, value) => setExtraPayment(value as number)}
                    step={50}
                    value={extraPayment}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `$${value}`}
                  />
                </Box>
                <Typography variant="body2">
                  Add <strong>${extraPayment}</strong> each month and finish about{' '}
                  <strong>{yearsSaved} {yearsSaved === 1 ? 'year' : 'years'} earlier</strong>.
                </Typography>
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

export function FinancialCompositionDemo() {
  const scenarios: Array<{
    label: string
    partner: Partner
    state: PreviewState
  }> = [
    { label: 'Ready · Harbor theme', partner: 'harbor', state: 'ready' },
    { label: 'Loading · Harbor theme', partner: 'harbor', state: 'loading' },
    { label: 'Missing loan · Summit theme', partner: 'summit', state: 'partial' },
    { label: 'Error · Summit theme', partner: 'summit', state: 'error' }
  ]

  return (
    <DemoFrame label="States and themes at a glance">
      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Typography color="text.secondary" variant="body2">
          Each variation stays visible so differences in content, state and partner branding can be
          scanned without changing controls.
        </Typography>
        <Grid container spacing={2.5}>
          {scenarios.map(scenario => (
            <Grid key={scenario.label} size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1.25 }}>
                  <Typography sx={{ fontWeight: 700 }} variant="body2">
                    {scenario.label}
                  </Typography>
                </Box>
                <EquityPreview partner={scenario.partner} state={scenario.state} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </DemoFrame>
  )
}

type MarketListing = {
  baths: number
  beds: number
  id: string
  neighborhood: string
  position: { left: string; top: string }
  price: number
  shortPrice: string
  sqft: number
  type: 'condo' | 'house' | 'townhome'
}

const marketListings: MarketListing[] = [
  { id: 'sloan-1', price: 625000, shortPrice: '$625k', beds: 3, baths: 2, sqft: 1640, neighborhood: 'Sloan’s Lake', type: 'house', position: { left: '17%', top: '25%' } },
  { id: 'sloan-2', price: 548000, shortPrice: '$548k', beds: 2, baths: 2, sqft: 1210, neighborhood: 'Sloan’s Lake', type: 'townhome', position: { left: '29%', top: '39%' } },
  { id: 'berkeley-1', price: 735000, shortPrice: '$735k', beds: 4, baths: 3, sqft: 2080, neighborhood: 'Berkeley', type: 'house', position: { left: '48%', top: '18%' } },
  { id: 'berkeley-2', price: 515000, shortPrice: '$515k', beds: 2, baths: 1, sqft: 980, neighborhood: 'Berkeley', type: 'condo', position: { left: '64%', top: '31%' } },
  { id: 'highlands-1', price: 895000, shortPrice: '$895k', beds: 4, baths: 3, sqft: 2420, neighborhood: 'Highlands', type: 'house', position: { left: '37%', top: '58%' } },
  { id: 'highlands-2', price: 680000, shortPrice: '$680k', beds: 3, baths: 3, sqft: 1750, neighborhood: 'Highlands', type: 'townhome', position: { left: '56%', top: '68%' } },
  { id: 'sunnyside-1', price: 575000, shortPrice: '$575k', beds: 2, baths: 2, sqft: 1320, neighborhood: 'Sunnyside', type: 'condo', position: { left: '76%', top: '51%' } },
  { id: 'sunnyside-2', price: 810000, shortPrice: '$810k', beds: 4, baths: 2, sqft: 2190, neighborhood: 'Sunnyside', type: 'house', position: { left: '72%', top: '76%' } }
]

export function MarketExplorerDemo() {
  const [budget, setBudget] = useState('900000')
  const [homeType, setHomeType] = useState('all')
  const [selectedId, setSelectedId] = useState('sloan-1')
  const [zoom, setZoom] = useState(1)

  const visibleListings = marketListings.filter(listing => {
    const withinBudget = listing.price <= Number(budget)
    const matchesType = homeType === 'all' || listing.type === homeType
    return withinBudget && matchesType
  })
  const selectedListing =
    visibleListings.find(listing => listing.id === selectedId) ?? visibleListings[0] ?? marketListings[0]

  return (
    <DemoFrame label="Buyer market explorer: a new map centerpiece surrounded by familiar system components.">
      <Box sx={{ backgroundColor: 'background.default', p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography component="h3" variant="h3">
                Explore the Denver market
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Compare homes with neighborhood demand before changing the search area.
              </Typography>
            </Box>
            <Chip label={`${visibleListings.length} homes match`} color="primary" />
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Stack spacing={2.5} sx={{ height: '100%' }}>
                    <Typography component="h4" variant="h3">
                      Shape the search
                    </Typography>
                    <TextField fullWidth label="Search neighborhoods" placeholder="Try Berkeley" />
                    <TextField
                      fullWidth
                      label="Maximum price"
                      onChange={event => setBudget(event.target.value)}
                      select
                      value={budget}
                    >
                      <MenuItem value="600000">Up to $600,000</MenuItem>
                      <MenuItem value="750000">Up to $750,000</MenuItem>
                      <MenuItem value="900000">Up to $900,000</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Home type"
                      onChange={event => setHomeType(event.target.value)}
                      select
                      value={homeType}
                    >
                      <MenuItem value="all">All home types</MenuItem>
                      <MenuItem value="house">Single-family homes</MenuItem>
                      <MenuItem value="townhome">Townhomes</MenuItem>
                      <MenuItem value="condo">Condos</MenuItem>
                    </TextField>

                    <Box aria-live="polite" sx={{ mt: { md: 'auto' } }}>
                      <Typography color="text.secondary" variant="body2">
                        Selected home · {selectedListing.neighborhood}
                      </Typography>
                      <Typography component="p" sx={{ mt: 0.5 }} variant="h2">
                        ${selectedListing.price.toLocaleString()}
                      </Typography>
                      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, my: 1.5 }}>
                        <Chip label={`${selectedListing.beds} beds`} size="small" />
                        <Chip label={`${selectedListing.baths} baths`} size="small" />
                        <Chip label={`${selectedListing.sqft.toLocaleString()} sq ft`} size="small" />
                      </Stack>
                      <Button fullWidth startIcon={<HomeOutlinedIcon />} variant="contained">
                        Explore this home
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                aria-label="Map of Denver homes and neighborhood market temperature"
                role="region"
                sx={{
                  backgroundColor: 'action.hover',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                  minHeight: { xs: 480, md: 620 },
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    inset: 0,
                    position: 'absolute',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    transition: 'transform 180ms ease-out'
                  }}
                >
                  <Box
                    aria-hidden="true"
                    component="svg"
                    preserveAspectRatio="none"
                    sx={{ height: '100%', inset: 0, position: 'absolute', width: '100%' }}
                    viewBox="0 0 720 620"
                  >
                    <rect fill="var(--mui-palette-background-default)" height="620" width="720" />
                    <path d="M0 48 L286 0 L338 216 L42 270 Z" fill="var(--mui-palette-error-main)" opacity="0.08" />
                    <path d="M286 0 L720 0 L720 248 L338 216 Z" fill="var(--mui-palette-warning-main)" opacity="0.1" />
                    <path d="M42 270 L338 216 L486 620 L0 620 Z" fill="var(--mui-palette-primary-main)" opacity="0.08" />
                    <path d="M338 216 L720 248 L720 620 L486 620 Z" fill="var(--mui-palette-info-main)" opacity="0.1" />
                    {[
                      'M-20 120 C160 88 284 132 740 62',
                      'M-30 338 C174 280 356 330 744 282',
                      'M-20 528 C214 474 428 512 748 450',
                      'M112 -20 C94 182 152 378 92 650',
                      'M332 -20 C302 170 388 384 344 650',
                      'M580 -20 C516 190 622 398 552 650'
                    ].map(path => (
                      <path
                        d={path}
                        fill="none"
                        key={path}
                        stroke="var(--mui-palette-background-paper)"
                        strokeLinecap="round"
                        strokeWidth="24"
                      />
                    ))}
                    {[
                      'M-20 120 C160 88 284 132 740 62',
                      'M-30 338 C174 280 356 330 744 282',
                      'M-20 528 C214 474 428 512 748 450',
                      'M112 -20 C94 182 152 378 92 650',
                      'M332 -20 C302 170 388 384 344 650',
                      'M580 -20 C516 190 622 398 552 650'
                    ].map(path => (
                      <path
                        d={path}
                        fill="none"
                        key={`center-${path}`}
                        stroke="var(--mui-palette-divider)"
                        strokeDasharray="10 12"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    ))}
                    <path
                      d="M-20 420 C170 388 254 420 386 382 C520 342 590 364 750 320"
                      fill="none"
                      opacity="0.55"
                      stroke="var(--mui-palette-primary-main)"
                      strokeWidth="10"
                    />
                  </Box>

                  <Chip
                    color="error"
                    label="Sloan’s Lake · Hot"
                    size="small"
                    sx={{ left: '4%', position: 'absolute', top: '7%' }}
                  />
                  <Chip
                    color="warning"
                    label="Berkeley · Warm"
                    size="small"
                    sx={{ position: 'absolute', right: '5%', top: '8%' }}
                  />
                  <Chip
                    color="info"
                    label="Sunnyside · Balanced"
                    size="small"
                    sx={{ bottom: '8%', position: 'absolute', right: '18%' }}
                  />
                  <Chip
                    color="primary"
                    label="Highlands · Heating"
                    size="small"
                    sx={{ bottom: '8%', left: '4%', position: 'absolute' }}
                  />

                  {visibleListings.map(listing => (
                    <Button
                      aria-label={`${listing.shortPrice} home in ${listing.neighborhood}`}
                      aria-pressed={selectedListing.id === listing.id}
                      key={listing.id}
                      onClick={() => setSelectedId(listing.id)}
                      size="small"
                      startIcon={<HomeOutlinedIcon />}
                      sx={{
                        backgroundColor: 'background.paper',
                        borderWidth: selectedListing.id === listing.id ? 2 : 1,
                        boxShadow: 2,
                        left: listing.position.left,
                        position: 'absolute',
                        top: listing.position.top,
                        transform: 'translate(-50%, -50%)',
                        '&:hover': { backgroundColor: 'background.paper' }
                      }}
                      variant="outlined"
                    >
                      {listing.shortPrice}
                    </Button>
                  ))}
                </Box>

                <Stack
                  spacing={0.5}
                  sx={{ bottom: 2, position: 'absolute', right: 2 }}
                >
                  <Tooltip title="Zoom in">
                    <IconButton
                      aria-label="Zoom in"
                      disabled={zoom >= 1.2}
                      onClick={() => setZoom(value => Math.min(1.2, value + 0.1))}
                      sx={{ backgroundColor: 'background.paper', boxShadow: 1 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zoom out">
                    <IconButton
                      aria-label="Zoom out"
                      disabled={zoom <= 0.9}
                      onClick={() => setZoom(value => Math.max(0.9, value - 0.1))}
                      sx={{ backgroundColor: 'background.paper', boxShadow: 1 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Center on Denver">
                    <IconButton
                      aria-label="Center on Denver"
                      onClick={() => setZoom(1)}
                      sx={{ backgroundColor: 'background.paper', boxShadow: 1 }}
                    >
                      <MyLocationIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DemoFrame>
  )
}

type WorkbenchComponent = 'button' | 'text-input' | 'number-input' | 'select' | 'slider' | 'card'

export function WorkbenchDemo() {
  const [component, setComponent] = useState<WorkbenchComponent>('slider')
  const [sliderValue, setSliderValue] = useState(10)
  const theme = useTheme()

  return (
    <DemoFrame label="Reconstructed production-context component workbench">
      <Grid container>
        <Grid
          size={{ xs: 4, md: 3 }}
          sx={{ borderRight: 1, borderColor: 'divider', p: { xs: 1, sm: 2 } }}
        >
          <Stack spacing={1}>
            {(
              [
                ['button', 'Button'],
                ['text-input', 'Text input'],
                ['number-input', 'Number input'],
                ['select', 'Select'],
                ['slider', 'Slider'],
                ['card', 'Card']
              ] as Array<[WorkbenchComponent, string]>
            ).map(([value, label]) => (
              <Button
                key={value}
                onClick={() => setComponent(value)}
                sx={{ justifyContent: 'flex-start', minWidth: 0, px: { xs: 1, sm: 2 }, textAlign: 'left' }}
                variant={component === value ? 'contained' : 'text'}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 8, md: 9 }} sx={{ minWidth: 0, p: { xs: 2, md: 4 } }}>
          <Stack spacing={4}>
            <Box>
              <Typography component="h3" variant="h3">
                {component.replace('-', ' ')}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                Props, states and product contexts rendered with the application’s real providers and styles.
              </Typography>
            </Box>

            {component === 'button' ? (
              <Stack spacing={3}>
                <Box>
                  <Typography color="text.secondary" sx={{ mb: 1 }} variant="body2">
                    Variants and states
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
                    <Button variant="contained">Primary</Button>
                    <Button variant="outlined">Secondary</Button>
                    <Button disabled>Disabled</Button>
                    <Box
                      sx={{
                        backgroundColor: 'divider',
                        borderRadius: 1,
                        display: 'inline-flex',
                        overflow: 'hidden',
                        p: 0.375,
                        position: 'relative',
                        '&::before': {
                          animation: 'loading-border 900ms linear infinite',
                          aspectRatio: '1',
                          background: currentTheme =>
                            `conic-gradient(transparent 0deg 250deg, ${currentTheme.palette.primary.main} 250deg 360deg)`,
                          content: '""',
                          left: '-35%',
                          position: 'absolute',
                          top: '50%',
                          width: '170%'
                        },
                        '@keyframes loading-border': {
                          from: { transform: 'translateY(-50%) rotate(0deg)' },
                          to: { transform: 'translateY(-50%) rotate(360deg)' }
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                          '&::before': { animation: 'none', transform: 'translateY(-50%) rotate(45deg)' }
                        }
                      }}
                    >
                      <Button
                        aria-busy="true"
                        disabled
                        sx={{
                          backgroundColor: 'background.paper',
                          borderColor: 'transparent',
                          position: 'relative',
                          '&.Mui-disabled': {
                            backgroundColor: 'background.paper',
                            color: 'text.secondary'
                          }
                        }}
                        variant="outlined"
                      >
                        Saving
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Typography color="text.secondary" sx={{ mb: 1 }} variant="body2">
                      Icon buttons
                    </Typography>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Add goal">
                        <IconButton aria-label="Add goal" color="primary">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save as favorite">
                        <IconButton aria-label="Save as favorite">
                          <FavoriteBorderIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Settings">
                        <IconButton aria-label="Settings" disabled>
                          <SettingsIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Typography color="text.secondary" sx={{ mb: 1 }} variant="body2">
                      Buttons with icons and text
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
                      <Button startIcon={<DownloadIcon />} variant="contained">
                        Download report
                      </Button>
                      <Button endIcon={<ArrowForwardIcon />} variant="outlined">
                        Continue
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            ) : null}
            {component === 'text-input' ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Default" /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField error fullWidth helperText="Enter a valid value" label="Error" /></Grid>
              </Grid>
            ) : null}
            {component === 'number-input' ? (
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  label="Additional monthly payment"
                  slotProps={{
                    htmlInput: {
                      'aria-describedby': 'number-input-caption',
                      inputMode: 'decimal',
                      max: 5000,
                      min: 0,
                      step: 50
                    }
                  }}
                  type="number"
                />
                <Typography color="text.secondary" id="number-input-caption" variant="body2">
                  The native spinbutton exposes its label, current value, minimum, maximum and $50
                  step to assistive technology. Type a value; use Arrow Up or Arrow Down, click the
                  stepper buttons, or—where the browser supports it—scroll the mouse wheel while the
                  field is focused. Mobile browsers can present a numeric keyboard.
                </Typography>
              </Stack>
            ) : null}
            {component === 'select' ? (
              <Stack spacing={1.5}>
                <TextField
                  defaultValue="purchase"
                  fullWidth
                  label="Goal"
                  select
                  slotProps={{ select: { inputProps: { 'aria-describedby': 'select-caption' } } }}
                >
                  <MenuItem value="purchase">Purchase a new home</MenuItem>
                  <MenuItem value="invest">Buy an investment property</MenuItem>
                  <MenuItem value="rent">Rent this home and buy another</MenuItem>
                </TextField>
                <Typography color="text.secondary" id="select-caption" variant="body2">
                  The labeled control exposes combobox and listbox semantics to assistive technology.
                  Enter, Space, Arrow Up or Arrow Down opens the menu; Arrow keys move through options;
                  Home and End jump to either edge. Typing focuses a matching option, and repeating the
                  same letter cycles through matches. Enter selects, Escape closes, and focus returns
                  to the control.
                </Typography>
              </Stack>
            ) : null}
            {component === 'slider' ? (
              <Stack spacing={2}>
                <Typography id="years-slider-label">How many more years will you keep this home?</Typography>
                <Box sx={{ px: 1, pt: 4, pb: 1 }}>
                  <Slider
                    aria-labelledby="years-slider-label"
                    marks={[{ value: 1, label: '1 year' }, { value: 30, label: '30 years' }]}
                    max={30}
                    min={1}
                    onChange={(_, value) => setSliderValue(value as number)}
                    sx={{
                      '& .MuiSlider-thumb': {
                        boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.12)}`
                      }
                    }}
                    value={sliderValue}
                    valueLabelDisplay="on"
                  />
                </Box>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  Native range semantics, a themed track and thumb, keyboard controls, touch input and a value label all need to agree.
                </Typography>
              </Stack>
            ) : null}
            {component === 'card' ? (
              <Grid container spacing={2}>
                {['Purchase a new home', 'Buy an investment property', 'Rent and buy another'].map(label => (
                  <Grid key={label} size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent
                        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                      >
                        <Typography component="h4" variant="h3">{label}</Typography>
                        <Button sx={{ alignSelf: 'flex-start', mt: 'auto' }}>Explore</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </DemoFrame>
  )
}
