import { stockFor, type Boot, type BootVariant } from './catalog'

export type AlertChannel = 'email' | 'sms'
export type RestockAlert = BootVariant & { bootId: string; channel: AlertChannel; contact: string }
export const alertStorageKey = 'mikes-boots:restock-alerts:v1'
type AlertStorage = Pick<Storage, 'getItem' | 'setItem'>

export function normalizeContact(channel: AlertChannel, contact: string): string | undefined {
  const value = channel === 'sms' ? contact.replace(/[\s().-]/g, '') : contact.trim()
  return (channel === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : /^\+[1-9]\d{7,14}$/.test(value)) ? value : undefined
}

export function readRestockAlerts(storage: AlertStorage): RestockAlert[] {
  try {
    const data: unknown = JSON.parse(storage.getItem(alertStorageKey) ?? '[]')
    return Array.isArray(data) ? data.filter((entry): entry is RestockAlert =>
      entry && typeof entry === 'object' && ['bootId', 'color', 'size', 'width', 'contact'].every(key => typeof entry[key] === 'string') &&
      (entry.channel === 'email' || entry.channel === 'sms') && Boolean(normalizeContact(entry.channel, entry.contact))
    ) : []
  } catch { return [] }
}

export function saveRestockAlert(storage: AlertStorage, boot: Boot, variant: BootVariant, channel: AlertChannel, contact: string): RestockAlert {
  const normalized = normalizeContact(channel, contact)
  if (!normalized) throw new Error(channel === 'sms' ? 'Enter a mobile number with its country code.' : 'Enter a valid email address.')
  if (stockFor(boot, variant).status !== 'restocking' || !boot.variants.includes(variant)) throw new Error('This option is not awaiting a restock.')
  const alert = { bootId: boot.id, color: variant.color, size: variant.size, width: variant.width, channel, contact: normalized }
  const previous = readRestockAlerts(storage).filter(item =>
    !(item.bootId === alert.bootId && item.color === alert.color && item.size === alert.size && item.width === alert.width && item.channel === alert.channel && item.contact === alert.contact)
  )
  storage.setItem(alertStorageKey, JSON.stringify([...previous, alert]))
  return alert
}
