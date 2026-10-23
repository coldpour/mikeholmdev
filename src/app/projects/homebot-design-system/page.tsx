import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { SiteShell } from '@/components/SiteShell'
import { withBasePath } from '@/app/paths'
import { BeforeAfterDemo, FinancialCompositionDemo, MarketExplorerDemo, WorkbenchDemo } from './Demo'

export const metadata: Metadata = {
  title: 'Building Homebot’s design system | Mike Holm',
  description:
    'How Mike Holm helped turn a stylesheet and a handful of React components into shared, responsive product infrastructure at Homebot.'
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="div" sx={{ maxWidth: 760 }} variant="body1">
      {children}
    </Typography>
  )
}

function StorySection({
  children,
  eyebrow,
  title
}: {
  children: React.ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <Box component="section">
      <Stack spacing={3}>
        <SectionHeading eyebrow={eyebrow} title={title} />
        {children}
      </Stack>
    </Box>
  )
}

export default function HomebotDesignSystemPage() {
  return (
    <SiteShell>
      <Stack spacing={{ xs: 7, md: 10 }}>
        <Box component="article">
          <Stack spacing={{ xs: 7, md: 10 }}>
            <Box component="header">
              <Button href={withBasePath('/')} startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
                Back to projects
              </Button>
              <Stack spacing={3}>
                <Typography variant="overline">Homebot · Design system deep dive</Typography>
                <Typography variant="h1">From one stylesheet to shared product infrastructure</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 820 }} variant="body1">
                  When I joined Homebot, the front end for the homeowner digest was a small collection of React components and a single CSS file. I extracted a custom design system and built a component library so that we could apply a consistent brand voice and user experience to a buyer experience and set up the company for eventual acquisition and rebranding or white-labeling. As I built, I made sure that my components were
                compatible across Chrome, Safari, Edge and Firefox as well as responsive on desktop
                  and mobile.
                </Typography>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                  {[
                    ['Role', 'Frontend Developer; system builder and team lead'],
                    ['Years', '2018–2020'],
                    ['Architecture', 'JavaScript design variables and shared React components'],
                    ['Testing', 'Jest and browser testing']
                  ].map(([label, value]) => (
                    <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography color="text.secondary" variant="body2">{label}</Typography>
                      <Typography sx={{ mt: 0.5, fontWeight: 700 }} variant="body2">{value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Box>

            <Box
              sx={{
                borderLeft: 4,
                borderColor: 'secondary.main',
                backgroundColor: 'background.paper',
                p: { xs: 2.5, md: 3.5 }
              }}
            >
              <Typography component="p" variant="body1">
                The original Homebot code is private, so these demos rebuild the ideas with fresh code
                and sample data. The product itself has continued to evolve since my time there.
              </Typography>
            </Box>

            <StorySection eyebrow="01 · Alignment" title="Making the investment decision together">
              <Grid container spacing={{ xs: 3, md: 6 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2.5}>
                    <Prose>
                      Building a custom component library and design system was no small task in 2018, and I was acutely aware of that cost from my work on
                      Mineral-UI. A custom system could give Homebot a distinctive brand voice and
                      precise control over product behavior, but it would require sustained investment—not
                      just an initial round of polished components.
                    </Prose>
                    <Prose>
                      Before committing to that path, I brought design and engineering leadership into
                      the decision. I explained the tradeoff plainly: adopting an existing library would
                      provide a reliable baseline faster, while building our own would cost considerably
                      more but give the product a completely custom visual and interaction language.
                    </Prose>
                    <Prose>
                      I wanted everyone in the room to understand the expected investment, the ongoing
                      maintenance obligation and the benefits we believed the product would gain. Both
                      groups chose the custom path and committed to it together.
                    </Prose>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography component="h3" variant="h3">The decision</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                        Spend more to create a differentiated, white-label product language—and fund the
                        people and maintenance required to make it durable.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </StorySection>

            <StorySection eyebrow="02 · Foundations" title="Extracting a system from product work">
              <Stack spacing={4}>
                <Prose>
                  The foundations were JavaScript variables rather than components: shared decisions
                  for color, spacing, typography and responsive breakpoints. Reusable React components
                  lived in <code>src/components</code>, separate from page implementations in{' '}
                  <code>src/pages</code>. The system remained inside the product repository, close to its
                  consumers and inside the same build and styling environment.
                </Prose>
                <Prose>
                  We did not stop product development for a rewrite. Patterns were extracted from real
                  features, introduced incrementally and reused as existing screens changed. Wherever the
                  product was already consistent, it stayed visually the same. We made visual changes where
                  the existing interface had drifted; the larger change was underneath, as decisions moved
                  out of individual pages and into shared infrastructure.
                </Prose>
                <BeforeAfterDemo />
              </Stack>
            </StorySection>

            <StorySection eyebrow="03 · Components" title="Composing financial experiences">
              <Stack spacing={4}>
                <Prose>
                  A component was not finished when its default example looked right. It needed useful
                  behavior with partial data, loading and failure states, long content, partner branding,
                  narrow screens, keyboards and touch. The example below uses modern MUI primitives for
                  this portfolio, but recreates the kind of composition and pressure-testing the Homebot
                  system enabled.
                </Prose>
                <FinancialCompositionDemo />
              </Stack>
            </StorySection>

            <StorySection eyebrow="04 · Workflow" title="Testing components inside the real application">
              <Stack spacing={4}>
                <Prose>
                  As the library grew, we needed a fast way to see every component, prop combination and
                  edge state together. The goal was to scan for visual errors and inconsistencies before
                  those components reached product pages. Storybook was one option for that catalog, but
                  its build environment was separate from our webpack application. We observed discrepancies
                  in which stylesheets loaded, their order and how rules overrode one another. A component
                  could appear correct in the catalog and behave differently in the product.
                </Prose>
                <Prose>
                  React already made it straightforward to render a component with controlled props, so
                  we built the workbench inside the application: one page for buttons, another for text
                  inputs, selects, sliders and the rest of the library. Developers could inspect variants,
                  edge states and product contexts without leaving the production build environment. Jest
                  and browser testing covered behavior beyond those visual examples.
                </Prose>
                <WorkbenchDemo />
              </Stack>
            </StorySection>

            <StorySection eyebrow="05 · Reliability" title="Native behavior, custom product language">
              <Grid container spacing={{ xs: 3, md: 6 }}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={2.5}>
                    <Prose>
                      We kept native inputs underneath the visual treatment so keyboard, touch and browser
                      semantics remained available. The tradeoff was making browser-controlled elements
                      feel consistent. Range tracks and thumbs differed across engines; number fields
                      brought steppers, validation and mobile keyboards into the component contract.
                    </Prose>
                    <Prose>
                      Responsive behavior was part of each component rather than a cleanup pass on each
                      page. Text reflow, spacing, touch targets and composition changes were exercised in
                      Chrome, Safari, Edge and Firefox across desktop and mobile layouts.
                    </Prose>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Card>
                    <CardContent>
                      <Typography component="h3" variant="h3">White-label by construction</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                        Themes flowed into shared components so lender partners could receive a distinct
                        brand treatment without forking the behavior, responsive rules or accessibility
                        work underneath.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </StorySection>

            <StorySection eyebrow="06 · Reuse" title="The system traveled farther than the original digest">
              <Stack spacing={4}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography component="h3" variant="h3">A sample digest for acquisition</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                          When prospective users needed to understand the product before signing up, we
                          recreated the digest with fictional data and blurred financial values. The shared
                          system preserved the authenticated product’s structure and responsive behavior
                          while serving a different audience and conversion goal.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography component="h3" variant="h3">A new experience for home buyers</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                          Market exploration introduced a large Mapbox interface that changed most of the
                          screen layout. Around that genuinely new centerpiece, the product reused existing
                          controls, cards, typography, spacing and responsive behavior.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <MarketExplorerDemo />
              </Stack>
            </StorySection>

            <StorySection eyebrow="07 · Leadership" title="Building, hiring and continuing to build">
              <Stack spacing={2.5}>
                <Prose>
                  I began by building the system directly. As the investment grew, I helped hire additional
                  frontend engineers and moved into leading the work while continuing to contribute
                  components and product code. The shared system became both product infrastructure and a
                  way for a growing team to make compatible decisions.
                </Prose>
                <Prose>
                  It’s fun to see the changes the current team has made in my absence, and to recognize
                  both what is still the same and what has evolved. Patterns that remain visible include
                  native controls beneath custom styling, shared spacing, deliberate responsive text breaks,
                  themed white labeling, range inputs and composable purchasing-power cards.
                </Prose>
              </Stack>
            </StorySection>

            <StorySection eyebrow="08 · Retrospective" title="What I would do today">
              <Stack spacing={2.5}>
                <Prose>
                  Building a custom system was a conscious investment appropriate to Homebot’s brand
                  ambitions and the available options at the time. It was not the inexpensive default.
                </Prose>
                <Prose>
                  Today I would start with a mature, accessible component library and apply a custom theme
                  rather than rebuilding solved primitives. I would invest custom engineering in the visual
                  language, financial compositions and interactions unique to the business. I would still
                  bring design and engineering leadership the same explicit choice: understand the cost,
                  decide how much differentiation is worth and make the investment together.
                </Prose>
              </Stack>
            </StorySection>
          </Stack>
        </Box>
      </Stack>
    </SiteShell>
  )
}
