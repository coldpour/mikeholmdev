'use client'

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

type DemoProps = {
  title: string
}

export function Demo({ title }: DemoProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <AutoFixHighIcon color="primary" />
            <Typography component="h2" variant="h3">
              Interactive demo placeholder
            </Typography>
          </Stack>
          <Typography color="text.secondary" variant="body2">
            This page is ready for a client-side React demo for {title}. The surrounding case study
            remains static HTML for SEO, while this component hydrates only where interaction is
            needed.
          </Typography>
          {expanded ? (
            <Typography variant="body2">
              Demo state is already client-side: this is where controls, visualizations, spatial
              review prototypes, upload workflows, or generated SVG tooling can live without
              changing the page model.
            </Typography>
          ) : null}
          <Button onClick={() => setExpanded(value => !value)} sx={{ alignSelf: 'flex-start' }}>
            {expanded ? 'Hide demo notes' : 'Show demo notes'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
