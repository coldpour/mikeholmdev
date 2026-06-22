import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/CaseStudy'
import { SiteShell } from '@/components/SiteShell'
import { projectBySlug, projects } from '@/content/projects'
import { Demo } from './Demo'

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug.get(slug)

  if (!project) {
    return {}
  }

  return {
    title: `${project.title} | Mike Holm`,
    description: project.summary
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectBySlug.get(slug)

  if (!project) {
    notFound()
  }

  return (
    <SiteShell>
      <Stack spacing={{ xs: 5, md: 7 }}>
        <Box>
          <Button href="/" sx={{ mb: 3 }}>
            Back to projects
          </Button>
          <CaseStudy project={project} />
        </Box>
        {project.slug === 'svg-animation' ? (
          <Box
            aria-label="Generated triangle SVG animation preview"
            sx={{
              overflow: 'hidden',
              minHeight: { xs: 220, md: 360 },
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              backgroundColor: 'primary.dark',
              backgroundImage: 'url(/images/triangles.svg)',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.18)'
            }}
          />
        ) : (
          <Demo title={project.title} />
        )}
        {project.links?.length ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {project.links.map(link => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </Stack>
        ) : null}
        <Typography color="text.secondary" variant="body2">
          Static article HTML, hydrated demo surface, and shared MUI styles all come from the same
          project-page pattern.
        </Typography>
      </Stack>
    </SiteShell>
  )
}
