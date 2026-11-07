'use client'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { normalizeContact, readRestockAlerts, saveRestockAlert, type AlertChannel } from './alerts'
import type { Boot, BootVariant } from './catalog'

export function RestockSignup({ boot, variant }: { boot: Boot; variant: BootVariant }) {
  const [channel, setChannel] = useState<AlertChannel>('email')
  const [contact, setContact] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    try {
      const previous = readRestockAlerts(localStorage).find(item => item.bootId === boot.id && item.color === variant.color && item.size === variant.size && item.width === variant.width)
      if (previous) { setChannel(previous.channel); setContact(previous.contact); setSaved(true) }
    } catch { /* The form reports storage failures when saving. */ }
  }, [boot.id, variant.color, variant.size, variant.width])
  return <Stack component="form" spacing={2} onSubmit={event => {
    event.preventDefault()
    if (!normalizeContact(channel, contact)) {
      setError(channel === 'sms' ? 'Enter a mobile number with its country code.' : 'Enter a valid email address.')
      return
    }
    try {
      saveRestockAlert(localStorage, boot, variant, channel, contact)
      setSaved(true); setError('')
    } catch { setError('Your alert could not be saved. Please try again.') }
  }}>
    <Typography variant="h3" component="h4">Get a restock alert</Typography>
    <Stack direction="row" spacing={1} role="group" aria-label="Alert delivery">
      {(['email', 'sms'] as const).map(value => <Button key={value} variant={channel === value ? 'contained' : 'outlined'} aria-pressed={channel === value}
        onClick={() => { setChannel(value); setContact(''); setSaved(false); setError('') }} sx={{ minHeight: 44 }}>
        {value === 'email' ? 'Email' : 'SMS'}
      </Button>)}
    </Stack>
    <TextField key={channel} required fullWidth size="small" type={channel === 'email' ? 'email' : 'tel'}
      label={channel === 'email' ? 'Email address' : 'Mobile number'} value={contact}
      autoComplete={channel === 'email' ? 'email' : 'tel'}
      onChange={event => { setContact(event.target.value); setSaved(false); setError('') }}
      error={Boolean(error)} helperText={error || (channel === 'sms' ? 'Include your country code, e.g. +1.' : undefined)}
      slotProps={{ htmlInput: { maxLength: channel === 'email' ? 254 : 30 } }} />
    <Typography variant="caption" color="text.secondary">One restock alert for this size and color.</Typography>
    {saved ? <Alert severity="success">Alert preference saved on this device.</Alert> : <Button type="submit" variant="contained" sx={{ minHeight: 44 }}>Save alert</Button>}
  </Stack>
}
