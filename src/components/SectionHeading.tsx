import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  children?: ReactNode
}

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
      {eyebrow ? <Typography variant="overline">{eyebrow}</Typography> : null}
      <Typography variant="h2">{title}</Typography>
      {children ? (
        <Typography color="text.secondary" variant="body1">
          {children}
        </Typography>
      ) : null}
    </Stack>
  )
}
