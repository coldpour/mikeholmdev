export type BootVariant = { size: string; width: string; color: string }
export type BagItem = { boot: Boot; variant: BootVariant }
export type Stock = { status: 'in-stock' } | { status: 'restocking'; expected: string } | { status: 'discontinued' }

const styleStock: Record<string, Stock> = {
  '6': { status: 'restocking', expected: '2026-11-27' },
  '30': { status: 'restocking', expected: '2026-12-11' },
  '148': { status: 'discontinued' },
  '149': { status: 'discontinued' },
  '150': { status: 'discontinued' }
}
const variantStock: Record<string, Stock> = {
  '1/Brown/8/Regular': { status: 'restocking', expected: '2026-11-20' },
  '1/Black/12/Wide': { status: 'restocking', expected: '2026-12-04' },
  '1/Black/14/Wide': { status: 'discontinued' },
  '2/Green/10/Regular': { status: 'restocking', expected: '2026-11-18' }
}
const inStock: Stock = { status: 'in-stock' }

export function stockFor(boot: Boot, variant: BootVariant): Stock {
  return variantStock[`${boot.id}/${variant.color}/${variant.size}/${variant.width}`] ?? styleStock[boot.id] ?? inStock
}

export function restockEstimate(boot: Boot, color?: string): string | undefined {
  const stock = boot.variants.filter(variant => !color || variant.color === color).map(variant => stockFor(boot, variant))
  if (stock.some(item => item.status === 'in-stock')) return undefined
  return stock.flatMap(item => item.status === 'restocking' ? [item.expected] : []).sort()[0]
}

export function formatRestockDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

export type Boot = {
  id: string
  name: string
  use: string
  price: number
  height: string
  closure: 'Slip-on' | 'Lace-up' | 'Zip-up'
  activity: 'Everyday' | 'Work' | 'Hiking' | 'Hunting' | 'Fishing'
  toe: string
  climate: string
  lining: string
  collection: string
  camoBrand: string
  camoPattern: string
  popularity: number
  variants: BootVariant[]
}

export function productSelection(boot: Boot, preferred: Partial<BootVariant>): BootVariant {
  const color = boot.variants.some(variant => variant.color === preferred.color)
    ? preferred.color! : boot.variants[0].color
  const colors = boot.variants.filter(variant => variant.color === color)
  const width = colors.some(variant => variant.width === preferred.width)
    ? preferred.width! : colors.find(variant => variant.width === 'Regular')?.width ?? colors[0].width
  const size = colors.some(variant => variant.width === width && variant.size === preferred.size)
    ? preferred.size! : ''
  return { color, width, size }
}

export function selectedVariant(boot: Boot, selection: BootVariant): BootVariant | undefined {
  return boot.variants.find(variant => variant.color === selection.color && variant.size === selection.size && variant.width === selection.width)
}

function boot(
  id: string, name: string, use: string, price: number, height: string,
  toe: string, climate: string, colors: string[], sizes: string[], widths: string[],
  camoBrand = '', camoPattern = '',
  details: Partial<Pick<Boot, 'closure' | 'activity' | 'collection'>> = {}
): Boot {
  return {
    id, name, use, price, height, toe, climate, camoBrand, camoPattern,
    closure: details.closure ?? 'Slip-on',
    activity: details.activity ?? (toe !== 'Soft toe' ? 'Work' : height === 'Ankle' ? 'Everyday' : 'Hiking'),
    lining: climate === 'Cold weather' ? 'Fleece' : climate === 'Warm weather' ? 'Unlined' : 'Breathable mesh',
    collection: details.collection ?? (height === 'Ankle' ? 'Everyday' : 'Fieldwork'),
    popularity: (Number(id) * 37) % 149,
    variants: sizes.flatMap(size => widths.flatMap(width => colors.map(color => ({ size, width, color }))))
  }
}

const standardSizes = ['3', '4', '5', '6', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15', '16', '17']
const coreSizes = ['7', '8', '9', '10', '11', '12', '13', '14']
const featuredBoots: Boot[] = [
  boot('1', 'Weekender', 'Easy on. Out the door.', 95, 'Ankle', 'Soft toe', 'All season', ['Brown', 'Black'], coreSizes, ['Regular', 'Wide']),
  boot('2', 'Raincheck', 'For the wet way home.', 85, 'Ankle', 'Soft toe', 'All season', ['Green', 'Black'], coreSizes, ['Regular']),
  boot('3', 'Yardhand', 'A little mud is the point.', 110, 'Ankle', 'Soft toe', 'All season', ['Brown', 'Green'], coreSizes, ['Regular', 'Wide']),
  boot('4', 'Daybreak', 'Light on your feet.', 120, 'Ankle', 'Soft toe', 'Warm weather', ['Brown', 'Black'], ['8', '9', '10', '11', '12'], ['Regular']),
  boot('5', 'Workshop', 'Ready for a full shift.', 145, 'Ankle', 'Steel toe', 'All season', ['Black', 'Brown'], coreSizes, ['Regular', 'Wide']),
  boot('6', 'First Frost', 'Warm feet. Cold mornings.', 135, 'Ankle', 'Soft toe', 'Cold weather', ['Black', 'Green'], coreSizes, ['Regular', 'Wide']),
  boot('7', 'Trailhead', 'Take the longer route.', 125, 'Mid calf', 'Soft toe', 'All season', ['Brown', 'Green'], coreSizes, ['Regular', 'Wide'], '', '', { closure: 'Lace-up' }),
  boot('8', 'Field Day', 'Made for the muddy bit.', 140, 'Tall', 'Soft toe', 'All season', ['Green', 'Camo'], coreSizes, ['Regular'], 'Timberline', 'Woodland', { activity: 'Hunting' }),
  boot('9', 'Deep Winter', 'Stay out a little longer.', 175, 'Tall', 'Soft toe', 'Cold weather', ['Black', 'Camo'], ['9', '10', '11', '12', '13'], ['Regular', 'Wide'], 'Timberline', 'Winter brush'),
  boot('10', 'Foundry', 'Protection for the job.', 160, 'Mid calf', 'Composite toe', 'All season', ['Black', 'Brown'], coreSizes, ['Regular', 'Wide'], '', '', { closure: 'Lace-up' }),
  boot('11', 'Creekside', 'Follow the water.', 130, 'Mid calf', 'Soft toe', 'Warm weather', ['Green', 'Camo'], ['8', '9', '10', '11', '12'], ['Regular'], 'Marshland', 'Reeds', { activity: 'Fishing' }),
  boot('12', 'Back Forty', 'For the work outside.', 155, 'Tall', 'Steel toe', 'All season', ['Brown', 'Camo'], coreSizes, ['Regular', 'Wide'], 'Marshland', 'Tall grass')
]

const collections: { name: string; use: string; activity: Boot['activity']; price: number; colors: string[] }[] = [
  { name: 'Ridgeline', use: 'Sure footing beyond the trailhead.', activity: 'Hiking', price: 110, colors: ['Brown', 'Black'] },
  { name: 'North Fork', use: 'For early starts by the water.', activity: 'Fishing', price: 105, colors: ['Green', 'Brown'] },
  { name: 'Timber Yard', use: 'Built for the work outside.', activity: 'Work', price: 115, colors: ['Brown', 'Black'] },
  { name: 'Rainwell', use: 'A dry start to a wet day.', activity: 'Everyday', price: 85, colors: ['Black', 'Green'] },
  { name: 'Stonebridge', use: 'From the front step to the field.', activity: 'Everyday', price: 95, colors: ['Brown', 'Black'] },
  { name: 'Cedar Creek', use: 'Keep going when the path gets muddy.', activity: 'Hiking', price: 120, colors: ['Green', 'Brown'] },
  { name: 'Ironwood', use: 'Put in a full day.', activity: 'Work', price: 130, colors: ['Black', 'Brown'] },
  { name: 'Longleaf', use: 'At home in the woods.', activity: 'Hunting', price: 125, colors: ['Camo', 'Green'] },
  { name: 'Highbank', use: 'Made for the long way back.', activity: 'Hiking', price: 135, colors: ['Brown', 'Green'] },
  { name: 'Ridgewater', use: 'Follow the creek a little farther.', activity: 'Fishing', price: 115, colors: ['Green', 'Camo'] },
  { name: 'Greenfield', use: 'For chores that don’t wait for sunshine.', activity: 'Work', price: 100, colors: ['Brown', 'Green'] },
  { name: 'Canyon', use: 'Get a few more miles out of the day.', activity: 'Hiking', price: 140, colors: ['Brown', 'Black'] },
  { name: 'Shoreline', use: 'Ready for the dock before dawn.', activity: 'Fishing', price: 110, colors: ['Black', 'Green'] },
  { name: 'Summit', use: 'Cold starts. Good days outside.', activity: 'Hunting', price: 145, colors: ['Camo', 'Black'] },
  { name: 'Outrider', use: 'Good boots for whatever’s next.', activity: 'Everyday', price: 90, colors: ['Brown', 'Black'] }
]

const constructions: { name: string; height: string; closure: Boot['closure']; climate: string; premium: number; safety?: boolean }[] = [
  { name: 'Chelsea', height: 'Ankle', closure: 'Slip-on', climate: 'All season', premium: 0 },
  { name: 'Lace-up', height: 'Ankle', closure: 'Lace-up', climate: 'All season', premium: 15 },
  { name: 'Lace-up Mid', height: 'Mid calf', closure: 'Lace-up', climate: 'All season', premium: 25 },
  { name: 'Pull-on Tall', height: 'Tall', closure: 'Slip-on', climate: 'All season', premium: 30 },
  { name: 'Zip Mid', height: 'Mid calf', closure: 'Zip-up', climate: 'All season', premium: 35 },
  { name: 'Insulated Tall', height: 'Tall', closure: 'Slip-on', climate: 'Cold weather', premium: 55 },
  { name: 'Insulated Lace-up', height: 'Mid calf', closure: 'Lace-up', climate: 'Cold weather', premium: 60 },
  { name: 'Safety Mid', height: 'Mid calf', closure: 'Lace-up', climate: 'All season', premium: 50, safety: true },
  { name: 'Lightweight', height: 'Ankle', closure: 'Slip-on', climate: 'Warm weather', premium: -5 }
]

const collectionBoots = collections.flatMap((collection, collectionIndex) =>
  constructions.map((construction, constructionIndex) => {
    const id = featuredBoots.length + collectionIndex * constructions.length + constructionIndex + 1
    const sizes = standardSizes.filter(size => {
      const numeric = Number(size)
      if (!Number.isInteger(numeric)) return construction.closure === 'Lace-up' && collectionIndex % 3 !== 1
      if (numeric < 7) return collectionIndex % 4 === 0 && !construction.safety
      if (numeric > 15) return collectionIndex % 5 === 0 && construction.closure !== 'Zip-up'
      if (numeric > 12) return collectionIndex % 3 !== 1
      return true
    })
    const wide = (collectionIndex + constructionIndex) % 3 === 0
    const camo = collection.colors.includes('Camo')
    const toe = construction.safety ? (collectionIndex % 2 === 0 ? 'Steel toe' : 'Composite toe') : 'Soft toe'
    let camoBrand = ''
    let camoPattern = ''
    if (camo) {
      const timberline = collectionIndex % 2 === 0
      camoBrand = timberline ? 'Timberline' : 'Marshland'
      camoPattern = timberline
        ? construction.climate === 'Cold weather' ? 'Winter brush' : 'Woodland'
        : construction.height === 'Tall' ? 'Tall grass' : 'Reeds'
    }
    const result = boot(
      String(id), `${collection.name} ${construction.name}`, collection.use,
      collection.price + construction.premium, construction.height, toe,
      construction.climate, collection.colors, sizes, wide ? ['Regular', 'Wide'] : ['Regular'],
      camoBrand, camoPattern,
      { closure: construction.closure, activity: construction.safety ? 'Work' : collection.activity, collection: collection.name }
    )
    result.variants = result.variants.filter(variant =>
      (variant.width !== 'Wide' || variant.color === collection.colors[0]) &&
      (variant.size !== '10' || id % 7 !== 0)
    )
    return result
  })
)

export const catalog: Boot[] = [
  ...featuredBoots, ...collectionBoots,
  boot('148', 'Old Creek', 'For days down by the water.', 100, 'Tall', 'Soft toe', 'All season', ['Green'], coreSizes, ['Regular']),
  boot('149', 'Heritage Field', 'Built for the everyday outside.', 115, 'Mid calf', 'Soft toe', 'All season', ['Brown'], coreSizes, ['Regular']),
  boot('150', 'Winter Walk', 'For cold mornings outside.', 150, 'Tall', 'Soft toe', 'Cold weather', ['Black'], coreSizes, ['Regular'])
]
export const boots: Boot[] = catalog.map(boot => ({
  ...boot, variants: boot.variants.filter(variant => stockFor(boot, variant).status !== 'discontinued')
})).filter(boot => boot.variants.length > 0)

export const facets = {
  size: { label: 'Size', options: standardSizes },
  width: { label: 'Width', options: ['Regular', 'Wide'] },
  closure: { label: 'Boot style', options: ['Slip-on', 'Lace-up', 'Zip-up'] },
  height: { label: 'Height', options: ['Ankle', 'Mid calf', 'Tall'] },
  activity: { label: 'Use', options: ['Everyday', 'Work', 'Hiking', 'Hunting', 'Fishing'] },
  toe: { label: 'Toe protection', options: ['Soft toe', 'Steel toe', 'Composite toe'] },
  climate: { label: 'Weather', options: ['All season', 'Warm weather', 'Cold weather'] },
  price: { label: 'Price', options: ['Under $100', '$100–$149', '$150 and up'] },
  color: { label: 'Color & pattern', options: ['Brown', 'Black', 'Green', 'Camo'] },
  lining: { label: 'Lining', options: ['Breathable mesh', 'Fleece', 'Unlined'] },
  camoBrand: { label: 'Camouflage brand', options: ['Timberline', 'Marshland'] },
  camoPattern: { label: 'Camouflage pattern', options: ['Woodland', 'Winter brush', 'Reeds', 'Tall grass'] },
  collection: { label: 'Collection', options: ['Everyday', 'Fieldwork', ...collections.map(collection => collection.name)] }
} as const

export type Field = keyof typeof facets
export type Filters = Partial<Record<Field, string[]>>
export const shoppingFields: Field[] = ['size', 'width', 'closure', 'height', 'activity', 'toe', 'climate', 'price', 'color', 'lining', 'collection']

export function recordFilterUse(history: Field[], before: Filters, after: Filters, field: Field): Field[] {
  const category = field === 'camoBrand' || field === 'camoPattern' ? 'color' : field
  if (!after[category]?.length || before[category]?.length) return history
  // A new selection joins the end of the current usage order; editing it keeps its place.
  return [...history.filter(item => item !== category), category]
}

export function orderedFilterFields(filters: Filters, history: Field[]): Field[] {
  const used = [...new Set(history)].filter(field => shoppingFields.includes(field))
  const known = [...used, ...shoppingFields.filter(field => !used.includes(field))]
  return [
    ...known.filter(field => filters[field]?.length),
    ...used.filter(field => !filters[field]?.length),
    ...shoppingFields.filter(field => !filters[field]?.length && !used.includes(field))
  ]
}

export type Sort = 'recommended' | 'popular' | 'newest' | 'price-up' | 'price-down' | 'oldest' | 'az' | 'za' | 'featured'
export const sortOptions: { value: Sort; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'popular', label: 'Best selling' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-up', label: 'Price: low to high' },
  { value: 'price-down', label: 'Price: high to low' }
]
export const extraSortOptions: { value: Sort; label: string }[] = [
  { value: 'oldest', label: 'Oldest' }, { value: 'az', label: 'Alphabetically, A–Z' },
  { value: 'za', label: 'Alphabetically, Z–A' }, { value: 'featured', label: 'Featured' }
]
export const initialFilters: Filters = {}

export function toggleFilter(filters: Filters, field: Field, value: string): Filters {
  const values = filters[field] ?? []
  const next = values.includes(value) ? values.filter(item => item !== value) : [...values, value]
  const result = { ...filters, [field]: next }
  if ((field === 'camoBrand' || field === 'camoPattern') && next.length && !result.color?.includes('Camo')) {
    result.color = [...(result.color ?? []), 'Camo']
  }
  if (field === 'color' && !next.includes('Camo')) {
    delete result.camoBrand
    delete result.camoPattern
  }
  return result
}

export function matchesBoot(boot: Boot, filters: Filters): boolean {
  const includes = (field: Field, value: string) => !filters[field]?.length || filters[field]!.includes(value)
  // Fit and color must be available on the same purchasable variant.
  if (!boot.variants.some(variant => includes('size', variant.size) && includes('width', variant.width) && includes('color', variant.color))) return false
  return (['closure', 'height', 'activity', 'toe', 'climate', 'lining', 'collection', 'camoBrand', 'camoPattern'] as const)
    .every(field => includes(field, boot[field])) && includes('price', boot.price < 100 ? 'Under $100' : boot.price < 150 ? '$100–$149' : '$150 and up')
}

export function selectBoots(filters: Filters, sort: Sort): Boot[] {
  const result = boots.filter(boot => matchesBoot(boot, filters))
  return result.sort((a, b) => {
    if (sort === 'price-up') return a.price - b.price
    if (sort === 'price-down') return b.price - a.price
    if (sort === 'newest') return Number(b.id) - Number(a.id)
    if (sort === 'az') return a.name.localeCompare(b.name)
    if (sort === 'za') return b.name.localeCompare(a.name)
    if (sort === 'popular') return a.popularity - b.popularity
    return Number(a.id) - Number(b.id)
  })
}

export function optionCount(filters: Filters, field: Field, value: string): number {
  return boots.filter(boot => matchesBoot(boot, { ...filters, [field]: [value] })).length
}
