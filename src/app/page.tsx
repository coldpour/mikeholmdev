import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeading } from '@/components/SectionHeading'
import { SiteShell } from '@/components/SiteShell'
import { featuredProjects } from '@/content/projects'

export default function HomePage() {
  return (
    <SiteShell>
      <Box
        component="header"
        sx={{
          minHeight: { xs: 'auto', md: '78vh' },
          display: 'grid',
          alignContent: 'space-between',
          gap: { xs: 6, md: 10 },
          borderBottom: 1,
          borderColor: 'divider',
          pb: { xs: 6, md: 8 }
        }}
      >
        <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: 'end' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Typography variant="overline">Mike Holm</Typography>
              <Typography variant="h1">Software engineer for durable product interfaces</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 680 }} variant="body1">
                I build front-end systems, product workflows, and technical foundations that make
                complex software easier to understand, extend, and trust.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack
              component="address"
              id="contact"
              spacing={1}
              sx={{ fontStyle: 'normal', alignItems: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <Link href="mailto:coldpour@gmail.com">coldpour@gmail.com</Link>
              <Link href="https://github.com/coldpour">github.com/coldpour</Link>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box component="section" id="projects">
        <Stack spacing={4}>
          <SectionHeading eyebrow="Selected work" title="Projects with room for the tradeoffs">
            Deep dives into design systems, workflow design, spatial interfaces, and technical
            choices that made teams faster without making the product thinner.
          </SectionHeading>
          <Grid container spacing={2.5}>
            {featuredProjects.map(project => (
              <Grid key={project.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProjectCard
                  eyebrow={project.eyebrow}
                  href={`/projects/${project.slug}`}
                  summary={project.summary}
                  title={project.title}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>

      <Box
        component="section"
        id="current-work"
        sx={{ borderTop: 1, borderColor: 'divider', pt: { xs: 6, md: 8 } }}
      >
        <Stack spacing={4}>
          <SectionHeading eyebrow="Current work" title="Percipient.ai">
            Percipient built Mirage, an intelligence-analysis platform for national-security work. I
            set front-end technical direction for a 10-person UI group inside a 35-engineer
            organization: library and tooling decisions, repo standards, and analyst-facing
            workflows.
          </SectionHeading>
          <Grid container spacing={2.5}>
            {[
              {
                title: 'How I lead a front-end team',
                body: "I set technical direction for a 10-person front-end group inside a 35-engineer organization. I decide which libraries are in or out, what belongs in the repo, when to refactor and reuse versus build greenfield, and which paid services are worth the spend."
              },
              {
                title: 'Growing engineers',
                body: 'Over six years, around a dozen engineers came through my code reviews, code talk, and the repo standards I own. The ones who engaged grew through alignment on codebase patterns, then confidence on top of that.'
              }
            ].map(item => (
              <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography component="h3" variant="h3">
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                      {item.body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>

      <Box component="section" sx={{ borderTop: 1, borderColor: 'divider', pt: { xs: 6, md: 8 } }}>
        <Stack spacing={4}>
          <SectionHeading eyebrow="Background" title="Earlier product engineering" />
          <Grid container spacing={2.5}>
            {[
              ['Homebot', 'Software Engineer, 2018-2020'],
              ['CA Technologies / Rally Software', 'Software Engineer, 2014-2018'],
              ['Quantum Retail', 'Software Engineer, 2011-2014']
            ].map(([company, role]) => (
              <Grid key={company} size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography component="h3" variant="h3">
                      {company}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                      {role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Typography color="text.secondary" variant="body2">
            Education: St. Olaf College, BA Computer Science.
          </Typography>
          <Link href="/projects/prolog-connect-4">
            Early logic-programming project notes
          </Link>
        </Stack>
      </Box>
    </SiteShell>
  )
}
