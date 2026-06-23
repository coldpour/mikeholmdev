import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/CaseStudy'
import { ConnectFourBoard } from '@/components/ConnectFourBoard'
import { MapAfter } from '@/components/MapAfter'
import { SiteShell } from '@/components/SiteShell'
import { withBasePath } from '@/app/paths'
import { projectBySlug, projects } from '@/content/projects'

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
          <Button href={withBasePath('/')} sx={{ mb: 3 }}>
            Back to projects
          </Button>
          <CaseStudy project={project}>
            {project.visual === 'map-after' ? <MapAfter /> : null}
          </CaseStudy>
        </Box>
        {project.visual === 'triangles' ? (
          <Box
            aria-label="Generated triangle SVG animation preview"
            sx={{
              overflow: 'hidden',
              minHeight: { xs: 220, md: 360 },
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              backgroundColor: 'primary.dark',
              backgroundImage: `url(${withBasePath('/images/triangles.svg')})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.18)'
            }}
          />
        ) : null}
        {project.visual === 'connect-four-board' ? <ConnectFourBoard /> : null}
        {project.links?.length ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {project.links.map(link => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </SiteShell>
  )
}
