import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  emptyReport,
  generateEquipment,
  isFilter,
  makeBounds,
  makeFilter,
  matches,
  parseReport,
  selectEquipment,
  serializeReport
} from './model.ts'

test('fixture generation is deterministic and varied', () => {
  const data = generateEquipment()
  assert.equal(data.length, 120)
  assert.deepEqual(data, generateEquipment())
  assert.equal(new Set(data.map((record) => record.id)).size, 120)
  assert.equal(new Set(data.map((record) => record.category)).size, 4)
  assert.equal(new Set(data.map((record) => record.assetId)).size, data.length)
  assert.ok(
    data.every(
      (record) =>
        record.assetId.split('-').length === 5 &&
        record.custodianEmail.endsWith('@example.com') &&
        /^\+1 \(202\) 555-010[1-5]$/.test(record.custodianPhone)
    )
  )
})

test('the boundary rejects invalid field, operator and value combinations', () => {
  for (const filter of [
    { type: 'text', field: 'name', operator: 'greaterThan', value: 'recorder' },
    { type: 'text', field: 'dailyRate', operator: 'is', value: '100' },
    { type: 'number', field: 'units', operator: 'includes', value: 5 },
    { type: 'number', field: 'units', operator: 'is', value: '5' },
    { type: 'number', field: 'units', operator: 'is', value: Infinity },
    { type: 'number', field: 'units', operator: 'is', value: -1 },
    { type: 'date', field: 'acquiredOn', operator: 'lessThan', value: '2026-02-30' },
    { type: 'category', field: 'category', operator: 'includes', value: 'Audio' },
    { type: 'category', field: 'category', operator: 'is', value: 'Unknown' },
    null
  ])
    assert.equal(isFilter(filter), false, JSON.stringify(filter))
  assert.ok(makeFilter('units', 'is', '0'))
  assert.equal(makeFilter('dailyRate', 'is', ''), null)
  assert.ok(makeFilter('acquiredOn', 'is', '2024-02-29'))
})

test('text matching is case insensitive and exact matching stays distinct', () => {
  const record = generateEquipment()[0]
  assert.ok(
    matches(record, { type: 'text', field: 'name', operator: 'includes', value: 'RECORDER' })
  )
  assert.ok(!matches(record, { type: 'text', field: 'name', operator: 'is', value: 'RECORDER' }))
})

test('range bounds are exclusive, support zero, and work independently', () => {
  const record = { ...generateEquipment()[0], dailyRate: 50, units: 0 }
  assert.ok(makeBounds('units', '0', '').length === 1)
  assert.equal(makeBounds('units', '', '').length, 0)
  assert.ok(makeBounds('dailyRate', '40', '60').every((filter) => matches(record, filter)))
  assert.ok(!makeBounds('dailyRate', '50', '60').every((filter) => matches(record, filter)))
  assert.ok(
    makeBounds('acquiredOn', '2020-01-01', '2026-01-01').every((filter) => matches(record, filter))
  )
})

test('reports round trip through the versioned URL representation', () => {
  const state = {
    filters: [{ type: 'number', field: 'dailyRate', operator: 'lessThan', value: 150 }],
    sort: 'dailyRate',
    direction: 'desc'
  }
  assert.deepEqual(parseReport(serializeReport(state)), { state, invalid: false })
  assert.deepEqual(parseReport(''), { state: emptyReport, invalid: false })
  for (const raw of [
    'null',
    'not JSON',
    '{}',
    '{"version":2}',
    serializeReport({
      ...state,
      filters: [{ type: 'text', field: 'units', operator: 'is', value: '3' }]
    })
  ]) {
    assert.deepEqual(parseReport(raw), { state: emptyReport, invalid: true })
  }
})

test('all conditions apply before numeric sorting, without mutating fixtures', () => {
  const data = generateEquipment()
  const initialIds = data.map((record) => record.id)
  const filtered = selectEquipment(data, {
    filters: [
      { type: 'category', field: 'category', operator: 'is', value: 'Audio' },
      ...makeBounds('dailyRate', '20', '150')
    ],
    sort: 'dailyRate',
    direction: 'desc'
  })
  assert.ok(filtered.length > 0)
  assert.ok(
    filtered.every(
      (record) => record.category === 'Audio' && record.dailyRate > 20 && record.dailyRate < 150
    )
  )
  assert.ok(
    filtered.every(
      (record, index) => index === 0 || filtered[index - 1].dailyRate >= record.dailyRate
    )
  )
  assert.deepEqual(
    data.map((record) => record.id),
    initialIds
  )
})
