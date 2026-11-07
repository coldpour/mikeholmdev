import assert from 'node:assert/strict'
import { test } from 'node:test'
import { boots, catalog, facets, initialFilters, matchesBoot, optionCount, orderedFilterFields, productSelection, recordFilterUse, restockEstimate, selectedVariant, selectBoots, shoppingFields, stockFor, toggleFilter } from './catalog.ts'

const shoppingFilters = { size: ['10'], height: ['Ankle'], toe: ['Soft toe'] }

test('returning stock has estimates while discontinued styles and variants stay hidden', () => {
  assert.equal(catalog.length, 150)
  assert.equal(boots.length, 147)
  assert.ok(boots.every(boot => boot.variants.every(variant => stockFor(boot, variant).status !== 'discontinued')))
  assert.ok(!boots.some(boot => ['148', '149', '150'].includes(boot.id)))
  const frost = boots.find(boot => boot.name === 'First Frost')
  assert.equal(restockEstimate(frost), '2026-11-27')
  assert.ok(frost.variants.every(variant => stockFor(frost, variant).status === 'restocking'))
  const weekender = boots[0]
  assert.equal(restockEstimate(weekender), undefined)
  assert.equal(stockFor(weekender, selectedVariant(weekender, { color: 'Black', size: '10', width: 'Regular' })).status, 'in-stock')
  assert.deepEqual(stockFor(weekender, selectedVariant(weekender, { color: 'Black', size: '12', width: 'Wide' })), { status: 'restocking', expected: '2026-12-04' })
  assert.equal(selectedVariant(weekender, { color: 'Black', size: '14', width: 'Wide' }), undefined)
})

test('filter categories keep their selection order as values are edited', () => {
  let filters = {}
  let usage = []
  for (const [field, value] of [['height', 'Ankle'], ['width', 'Wide'], ['climate', 'All season'], ['height', 'Tall']]) {
    const next = toggleFilter(filters, field, value)
    usage = recordFilterUse(usage, filters, next, field)
    filters = next
  }
  assert.deepEqual(orderedFilterFields({}, []), shoppingFields)
  assert.deepEqual(usage, ['height', 'width', 'climate'])
  assert.deepEqual(orderedFilterFields(filters, usage).slice(0, 3), usage)
  const partialClear = toggleFilter(filters, 'height', 'Ankle')
  assert.deepEqual(orderedFilterFields(partialClear, usage).slice(0, 3), usage)
})

test('cleared categories follow active categories but precede never-used categories', () => {
  const usage = ['height', 'width', 'climate']
  const filters = { width: ['Wide'], climate: ['All season'] }
  assert.deepEqual(orderedFilterFields(filters, usage).slice(0, 4), ['width', 'climate', 'height', 'size'])
  assert.deepEqual(orderedFilterFields({}, usage).slice(0, 4), ['height', 'width', 'climate', 'size'])
  const reselected = { ...filters, height: ['Ankle'] }
  const nextUsage = recordFilterUse(usage, filters, reselected, 'height')
  assert.deepEqual(orderedFilterFields(reselected, nextUsage).slice(0, 3), ['width', 'climate', 'height'])
  assert.deepEqual(usage, ['height', 'width', 'climate'])
})

test('camouflage details record use of their parent color category', () => {
  const filters = toggleFilter({}, 'camoBrand', 'Timberline')
  const usage = recordFilterUse([], {}, filters, 'camoBrand')
  assert.deepEqual(usage, ['color'])
  assert.equal(orderedFilterFields(filters, usage)[0], 'color')
  assert.equal(new Set(orderedFilterFields(filters, usage)).size, shoppingFields.length)
})

test('product details require a size and preserve valid fit preferences', () => {
  const boot = boots[0]
  assert.deepEqual(productSelection(boot, { color: 'Black' }), { color: 'Black', width: 'Regular', size: '' })
  assert.equal(selectedVariant(boot, productSelection(boot, { color: 'Black' })), undefined)
  const selection = productSelection(boot, { color: 'Black', size: '10', width: 'Wide' })
  assert.ok(boot.variants.includes(selectedVariant(boot, selection)))
  assert.deepEqual(selection, { color: 'Black', size: '10', width: 'Wide' })
})

test('color and width changes cannot leave an unavailable purchasable selection', () => {
  const boot = boots.find(boot => boot.name === 'Ridgeline Chelsea')
  const wide = productSelection(boot, { color: 'Brown', size: '10', width: 'Wide' })
  assert.equal(selectedVariant(boot, wide).width, 'Wide')
  const black = productSelection(boot, { ...wide, color: 'Black' })
  assert.deepEqual(black, { color: 'Black', width: 'Regular', size: '10' })
  assert.ok(selectedVariant(boot, black))
  assert.equal(selectedVariant(boot, { ...black, width: 'Wide' }), undefined)
  const differentSizes = { ...boot, variants: [
    { color: 'Brown', size: '10', width: 'Wide' },
    { color: 'Black', size: '12', width: 'Regular' }
  ] }
  const reset = productSelection(differentSizes, { ...wide, color: 'Black' })
  assert.deepEqual(reset, { color: 'Black', width: 'Regular', size: '' })
  assert.equal(selectedVariant(differentSizes, reset), undefined)
})

test('147 distinct styles have useful differences and available variants', () => {
  assert.equal(boots.length, 147)
  assert.equal(new Set(boots.map(boot => boot.id)).size, 147)
  assert.equal(new Set(boots.map(boot => boot.name)).size, 147)
  assert.ok(boots.every(boot => boot.price > 0 && boot.variants.length > 0))
  for (const field of ['closure', 'activity', 'height', 'toe', 'climate']) {
    for (const value of facets[field].options) {
      const matches = selectBoots({ [field]: [value] }, 'recommended')
      assert.ok(matches.length > 0 && matches.length < boots.length, `${field}: ${value} narrows the catalog`)
    }
  }
})

test('sizes cover 3 through 17, with half sizes only between 7 and 12', () => {
  assert.deepEqual(facets.size.options, ['3', '4', '5', '6', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15', '16', '17'])
  const offered = new Set(boots.flatMap(boot => boot.variants.map(variant => variant.size)))
  assert.deepEqual([...offered].sort((a, b) => Number(a) - Number(b)), facets.size.options)
  for (const size of facets.size.options) {
    const matches = selectBoots({ size: [size] }, 'recommended')
    assert.ok(matches.length > 0, `Size ${size} is available`)
  }
  for (const size of ['3', '7.5', '10', '17']) {
    assert.ok(selectBoots({ size: [size] }, 'recommended').length < boots.length, `Size ${size} narrows the catalog`)
  }
})

test('fit and color must exist together on one variant', () => {
  const boot = { ...boots[0], variants: [
    { size: '10', width: 'Regular', color: 'Brown' },
    { size: '12', width: 'Wide', color: 'Black' }
  ] }
  assert.equal(matchesBoot(boot, { size: ['10'], width: ['Wide'] }), false)
  assert.equal(matchesBoot(boot, { size: ['10'], color: ['Black'] }), false)
  assert.equal(matchesBoot(boot, { size: ['12'], width: ['Wide'], color: ['Black'] }), true)
})

test('choices within a field are alternatives; different fields are requirements', () => {
  const ankle = selectBoots({ height: ['Ankle'] }, 'recommended')
  const tall = selectBoots({ height: ['Tall'] }, 'recommended')
  const either = selectBoots({ height: ['Ankle', 'Tall'], toe: ['Soft toe'] }, 'recommended')
  assert.deepEqual(either.map(boot => boot.id), [...ankle, ...tall].filter(boot => boot.toe === 'Soft toe').sort((a, b) => Number(a.id) - Number(b.id)).map(boot => boot.id))
})

test('option counts replace their own field and retain the other requirements', () => {
  assert.equal(optionCount(shoppingFilters, 'height', 'Tall'), 28)
  assert.equal(optionCount(shoppingFilters, 'width', 'Wide'), 16)
  assert.equal(optionCount({ ...shoppingFilters, width: ['Wide'] }, 'climate', 'Warm weather'), 4)
})

test('boot style and fit narrow 147 styles to a useful shortlist', () => {
  assert.equal(selectBoots(initialFilters, 'recommended').length, 147)
  assert.equal(selectBoots(shoppingFilters, 'recommended').length, 42)
  assert.equal(selectBoots({ ...shoppingFilters, closure: ['Lace-up'] }, 'recommended').length, 12)
  const shortlist = selectBoots({ ...shoppingFilters, closure: ['Lace-up'], width: ['Wide'] }, 'recommended')
  assert.equal(shortlist.length, 4)
  assert.ok(shortlist.every(boot => boot.closure === 'Lace-up' && boot.variants.some(variant => variant.size === '10' && variant.width === 'Wide')))
  const chelsea = boots.find(boot => boot.name === 'Ridgeline Chelsea')
  assert.equal(matchesBoot(chelsea, { size: ['10'], width: ['Wide'], color: ['Brown'] }), true)
  assert.equal(matchesBoot(chelsea, { size: ['10'], width: ['Wide'], color: ['Black'] }), false)
})

test('removing camouflage clears dependent brand and pattern restrictions', () => {
  const filters = { size: ['10'], color: ['Camo', 'Brown'], camoBrand: ['Timberline'], camoPattern: ['Woodland'] }
  assert.deepEqual(toggleFilter(filters, 'color', 'Camo'), { size: ['10'], color: ['Brown'] })
  assert.deepEqual(filters.camoBrand, ['Timberline'])
  assert.deepEqual(toggleFilter({ color: ['Brown'] }, 'camoBrand', 'Timberline'), {
    color: ['Brown', 'Camo'], camoBrand: ['Timberline']
  })
})

test('price boundaries, sorting and completion counts reflect the catalog', () => {
  assert.equal(selectBoots({}, 'recommended').length, 147)
  assert.ok(selectBoots({ price: ['Under $100'] }, 'recommended').every(boot => boot.price < 100))
  const prices = selectBoots({}, 'price-up').map(boot => boot.price)
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b))
  assert.deepEqual(selectBoots({}, 'price-down').map(boot => boot.price), [...prices].reverse())
  assert.equal(selectBoots({}, 'newest')[0].id, '147')
  assert.notDeepEqual(selectBoots({}, 'popular'), selectBoots({}, 'recommended'))
  assert.equal(selectBoots({ closure: ['Zip-up'], height: ['Ankle'] }, 'recommended').length, 0)
})
