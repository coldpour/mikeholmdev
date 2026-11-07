import assert from 'node:assert/strict'
import { test } from 'node:test'
import { alertStorageKey, normalizeContact, readRestockAlerts, saveRestockAlert } from './alerts.ts'
import { boots } from './catalog.ts'

function storage() {
  const entries = new Map()
  return { getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) }
}

test('email and SMS recipients are validated and phone formatting is normalized', () => {
  assert.equal(normalizeContact('email', ' shopper@example.com '), 'shopper@example.com')
  assert.equal(normalizeContact('email', 'not-an-email'), undefined)
  assert.equal(normalizeContact('sms', '+1 (202) 555-0123'), '+12025550123')
  assert.equal(normalizeContact('sms', '555-0123'), undefined)
})

test('alerts retain the exact returning variant, persist both channels, and avoid duplicates', () => {
  const store = storage()
  const boot = boots.find(boot => boot.name === 'First Frost')
  const variant = boot.variants[0]
  saveRestockAlert(store, boot, variant, 'email', 'shopper@example.com')
  saveRestockAlert(store, boot, variant, 'email', 'shopper@example.com')
  saveRestockAlert(store, boot, variant, 'sms', '+1 (202) 555-0123')
  const saved = readRestockAlerts(store)
  assert.equal(saved.length, 2)
  assert.deepEqual(saved[0], { bootId: boot.id, ...variant, channel: 'email', contact: 'shopper@example.com' })
  assert.equal(saved[1].contact, '+12025550123')
  assert.throws(() => saveRestockAlert(store, boots[0], boots[0].variants.find(variant => variant.size === '10'), 'email', 'shopper@example.com'))
  assert.throws(() => saveRestockAlert(store, boot, variant, 'email', 'bad-address'))
})

test('invalid saved content is ignored rather than crashing the alert form', () => {
  const store = storage()
  store.setItem(alertStorageKey, '{broken')
  assert.deepEqual(readRestockAlerts(store), [])
  store.setItem(alertStorageKey, '[null,{"channel":"email"}]')
  assert.deepEqual(readRestockAlerts(store), [])
})
