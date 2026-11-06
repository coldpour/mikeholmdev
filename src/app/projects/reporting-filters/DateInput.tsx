'use client'

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import type { SxProps, Theme } from '@mui/material/styles'
import { useRef } from 'react'

type DateInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error: boolean
  sx?: SxProps<Theme>
}

export function DateInput({ label, value, onChange, error, sx }: DateInputProps) {
  const input = useRef<HTMLInputElement | null>(null)

  function openPicker() {
    const element = input.current
    if (!element) return
    element.focus()
    try {
      element.showPicker?.()
    } catch {
      // Keep the native date input usable when the browser cannot open its picker here.
      element.focus()
    }
  }

  return (
    <InputBase
      inputRef={input}
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputProps={{ 'aria-label': label, 'aria-invalid': error }}
      startAdornment={
        <IconButton
          size="small"
          aria-label={`Choose ${label} date`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={openPicker}
          sx={{ p: 0.25, mr: 0.5, minWidth: 24, height: 24, fontSize: 'inherit', color: 'inherit' }}
        >
          <CalendarTodayOutlinedIcon fontSize="inherit" />
        </IconButton>
      }
      sx={[
        {
          flex: 1,
          minWidth: 0,
          typography: 'caption',
          '& input': { p: 0, minWidth: 0, width: '100%', appearance: 'textfield' },
          '& input::-webkit-datetime-edit': { p: 0 },
          '& input::-webkit-calendar-picker-indicator': { display: 'none' }
        },
        ...(Array.isArray(sx) ? sx : [sx ?? {}])
      ]}
    />
  )
}
