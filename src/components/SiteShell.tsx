import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import type { ReactNode } from 'react'
import { withBasePath } from '@/app/paths'

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <Container component="main" sx={{ pb: { xs: 6, md: 10 } }}>
      <Box
        component="nav"
        aria-label="Primary"
        sx={{
          display: 'flex',
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          flexWrap: 'wrap',
          gap: 3,
          py: 2.5
        }}
      >
        <Link href={withBasePath('/#leadership')} underline="none">
          Leadership
        </Link>
        <Link href={withBasePath('/#projects')} underline="none">
          Technical
        </Link>
        <Link href={withBasePath('/#contact')} underline="none">
          Contact
        </Link>
      </Box>
      <Stack spacing={{ xs: 7, md: 10 }}>{children}</Stack>
    </Container>
  )
}
