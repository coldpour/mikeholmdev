import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { SectionHeading } from './SectionHeading'

export type Comparison = {
  title: string
  body: string
}

export type CaseStudyContent = {
  slug: string
  eyebrow: string
  title: string
  role: string
  summary: string
  body: string[]
  bullets?: string[]
  comparison?: Comparison[]
}

type CaseStudyProps = {
  project: CaseStudyContent
  children?: ReactNode
}

export function CaseStudy({ children, project }: CaseStudyProps) {
  return (
    <Box component="article" id={project.slug}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <SectionHeading eyebrow={project.eyebrow} title={project.title} />
        {children}
        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color="text.secondary" variant="body2">
              {project.role}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={3}>
              {project.body.map(paragraph => (
                <Typography key={paragraph} variant="body1">
                  {paragraph}
                </Typography>
              ))}
              {project.bullets ? (
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {project.bullets.map(item => (
                    <Typography component="li" key={item} sx={{ mb: 1 }} variant="body1">
                      {item}
                    </Typography>
                  ))}
                </Box>
              ) : null}
              {project.comparison ? (
                <Grid container spacing={2}>
                  {project.comparison.map(item => (
                    <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                      <Card>
                        <CardContent>
                          <Typography component="h3" variant="h3">
                            {item.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                            {item.body}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}
