'use client'

import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

type CopySkillButtonProps = {
  skill: string
}

export function CopySkillButton({ skill }: CopySkillButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copySkill() {
    try {
      await navigator.clipboard.writeText(skill)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Button
        onClick={copySkill}
        startIcon={status === 'copied' ? <CheckIcon /> : <ContentCopyIcon />}
        variant="outlined"
      >
        {status === 'copied' ? 'Skill copied' : 'Copy agent skill'}
      </Button>
      <Typography aria-live="polite" color="text.secondary" variant="body2">
        {status === 'error' ? 'Copy failed. Select the skill text below instead.' : ''}
      </Typography>
    </Stack>
  )
}
