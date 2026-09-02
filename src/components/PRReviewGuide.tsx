import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { prReviewSkill } from '@/content/prReviewSkill'
import { CopySkillButton } from './CopySkillButton'

type ArticleSectionProps = {
  children: ReactNode
  eyebrow: string
  id: string
  title: string
}

const attentionTiers = [
  {
    title: 'Tier zero · skim',
    body: 'Lockfiles, snapshots, generated files, formatting-only edits, and renames. Separate this churn when it would bury meaningful decisions.'
  },
  {
    title: 'Tier one · verify',
    body: 'Code that meaningful tests exercise. Read it alongside the proof instead of re-deriving every behavior by hand.'
  },
  {
    title: 'Tier two · judge',
    body: 'State ownership, exported interfaces, architecture, data and error boundaries, access control, and exceptions to shared systems.'
  }
]

const reviewFocus = [
  ['Dark feature slice', 'Correctness, current standards, and architecture fit. A flag limits blast radius; it does not discount review.'],
  ['Refactor or migration', 'Behavior preservation. The safety case is evidence that the live experience did not change.'],
  ['Release hotfix', 'Minimality. Every unrelated line is fresh risk headed toward production under time pressure.'],
  ['Agent-authored change', 'Intent, abstraction, architecture fit, and possible duplication. High output volume makes these the scarce judgments.']
]

function ArticleSection({ children, eyebrow, id, title }: ArticleSectionProps) {
  return (
    <Stack component="section" id={id} spacing={3} sx={{ scrollMarginTop: 24 }}>
      <Stack spacing={1}>
        <Typography variant="overline">{eyebrow}</Typography>
        <Typography component="h2" variant="h2">
          {title}
        </Typography>
      </Stack>
      {children}
    </Stack>
  )
}

function Paragraph({ children }: { children: ReactNode }) {
  return <Typography variant="body1">{children}</Typography>
}

export function PRReviewGuide() {
  return (
    <Box component="article" id="pr-review-at-speed">
      <Stack spacing={{ xs: 6, md: 9 }}>
        <Stack component="header" spacing={3} sx={{ maxWidth: 900 }}>
          <Typography variant="overline">Team engineering playbook</Typography>
          <Typography component="h1" variant="h1">
            Pull requests that make fast teams stronger
          </Typography>
          <Typography color="text.secondary" variant="body1">
            When you are working on a project by yourself, pull-request practice is something you
            barely need to think about. With a team of ten, the problem changes: the organization is
            trying to become resilient. People join, people leave, and context moves. Good review and
            authoring practices let the team move quickly while pulling the best judgment out of
            everyone—without making progress depend on the same few people always being present.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack
              component="nav"
              aria-label="Article sections"
              spacing={1.5}
              sx={{ position: { md: 'sticky' }, top: { md: 24 } }}
            >
              <Typography variant="overline">In this guide</Typography>
              {[
                ['#why-review', 'Why review'],
                ['#attention', 'Attention is the budget'],
                ['#author-contract', 'The author contract'],
                ['#review-focus', 'Constant rigor'],
                ['#change-requests', 'Useful change requests'],
                ['#agents', 'Humans and agents'],
                ['#skill', 'Copy the skill']
              ].map(([href, label]) => (
                <Typography component="a" href={href} key={href} variant="body2">
                  {label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={{ xs: 7, md: 9 }}>
              <ArticleSection eyebrow="The guarantee" id="why-review" title="Why review exists">
                <Paragraph>
                  Review keeps UI design, API design, and coding practice aligned. That alignment
                  makes a codebase learnable: an engineer entering an unfamiliar area can recognize
                  the patterns, and two parts of the product are less likely to solve the same problem
                  in incompatible ways.
                </Paragraph>
                <Paragraph>
                  It is also the only point where a second mind is guaranteed to examine a change
                  before users depend on it. The job is not syntax checking. It is deciding whether
                  the change fits the problem, moves the system in the right direction, is complete,
                  and has proof proportionate to its risk.
                </Paragraph>
                <Box
                  sx={{
                    borderLeft: 4,
                    borderColor: 'secondary.main',
                    py: 1,
                    pl: 3
                  }}
                >
                  <Typography component="p" variant="h3">
                    Review is how a team turns individual output into organizational capability.
                  </Typography>
                </Box>
              </ArticleSection>

              <ArticleSection
                eyebrow="The scarce resource"
                id="attention"
                title="Reviewer judgment is the budget"
              >
                <Paragraph>
                  Every judgment call gets worse as the reviewer has to hold more unrelated context.
                  Review fatigue is not laziness; it is predictable overload. Push formatting, types,
                  lint rules, and repeatable tests to machines so people can spend attention on intent,
                  architecture, and risk.
                </Paragraph>
                <Paragraph>
                  Size is the easiest warning signal, not the principle itself. Roughly 200–400 changed
                  lines is a useful expectation, and a change above 1,000 lines usually needs a split.
                  But a small diff that moves state ownership can demand more judgment than a large,
                  mechanical rename. Measure the cognitive load, not just the line count.
                </Paragraph>
                <Grid container spacing={2}>
                  {attentionTiers.map(tier => (
                    <Grid key={tier.title} size={{ xs: 12, md: 4 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography component="h3" variant="h3">
                            {tier.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                            {tier.body}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Paragraph>
                  A PR also has to load its own context. Its ticket, description, tests, domain types,
                  and implementation should tell the same story. When they disagree, that is not a
                  paperwork problem; it is a review finding.
                </Paragraph>
              </ArticleSection>

              <ArticleSection
                eyebrow="Before review begins"
                id="author-contract"
                title="The author protects the reviewer’s ability to judge"
              >
                <Paragraph>
                  Each pull request should be independently reviewable and independently revertible.
                  A reviewer with no sibling-PR context can understand it, verify it, assess its risk,
                  and see real usage. If a later defect appears, the team can back out the smallest
                  coherent unit instead of removing an entire project.
                </Paragraph>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography component="h3" variant="h3">
                          Slice by behavior
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                          Carry one usable behavior through every layer it needs. “API first, UI later”
                          creates orphaned code and hides whether the pieces work together. A PR may
                          build on merged code; it must not require a promised future PR.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography component="h3" variant="h3">
                          Sequence one slice at a time
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                          Merge a coherent slice to main before opening its successor. This avoids
                          rebase cascades and keeps every review grounded in the code that actually
                          exists. It only works when review turnaround is measured in hours, not days.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Paragraph>
                  Feature flags are excellent seams for net-new work: land the thinnest end-to-end path
                  dark, then add one complete behavior at a time. The flag reduces deployment risk, not
                  review responsibility. Migrations have a different seam: fully convert one component,
                  file, or screen, preserve its behavior, and stop when the feature can land. In both
                  cases, keep lockfiles, snapshots, formatting, and renames out of the judgment diff.
                </Paragraph>
                <Paragraph>
                  This contract has a blunt rule: judge every PR as if no future PR exists. “I’ll wire
                  it up next” and “cleanup is coming” are hopes, not reviewable facts. Real deployment
                  constraints—schema expansion, generated contracts, or servers that must precede
                  clients—need explicit human judgment, a named consumer, and an independent rollback.
                </Paragraph>
              </ArticleSection>

              <ArticleSection
                eyebrow="Risk changes the lens"
                id="review-focus"
                title="Keep the rigor constant; move the focus"
              >
                <Paragraph>
                  A lower-blast-radius change does not deserve a casual review. It deserves the same
                  rigor aimed at a different failure mode. Dark code may never be reread when its flag
                  turns on. Refactors touch live behavior. Hotfixes ship under pressure. The reviewer’s
                  question changes, but the responsibility does not.
                </Paragraph>
                <Grid container spacing={2}>
                  {reviewFocus.map(([title, body]) => (
                    <Grid key={title} size={{ xs: 12, sm: 6 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography component="h3" variant="h3">
                            {title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
                            {body}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </ArticleSection>

              <ArticleSection
                eyebrow="Feedback that converges"
                id="change-requests"
                title="Write change requests that protect quality without creating drag"
              >
                <Paragraph>
                  Reserve blocking requests for clear bugs, meaningful performance or security risks,
                  missing risk-appropriate tests, and anti-patterns likely to produce those failures:
                  multiple sources of truth, confused state ownership, business logic in view
                  components, duplicated existing abstractions, or needless design-system bypasses.
                  If a rule can be enforced by lint or a test, automate it instead of charging every
                  future reviewer for the same comment.
                </Paragraph>
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: { xs: 2.5, md: 3 }
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="overline">A useful review comment</Typography>
                    <Typography variant="body1">
                      <strong>Requested —</strong> Keep the selected account in the URL rather than a
                      second Redux field. Two writable sources can disagree after back navigation;
                      the route is already the durable source of truth. Please derive the selection
                      from the route and add a back/forward assertion.
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      <strong>Optional —</strong> The helper name could be shorter, but this does not
                      need to hold up the PR.
                    </Typography>
                  </Stack>
                </Box>
                <Paragraph>
                  Label requested and optional feedback explicitly, explain why the requested change
                  is necessary, and cite evidence when it helps. Ask genuine questions when context is
                  missing. Assume positive intent; when written tone becomes ambiguous or a thread
                  stops converging, switch to a short conversation and record the decision afterward.
                  The reviewer owes the author prompt attention in return—small sequential PRs collapse
                  if feedback waits for days.
                </Paragraph>
              </ArticleSection>

              <ArticleSection eyebrow="AI changes the balance" id="agents" title="Let agents raise the floor">
                <Paragraph>
                  Agents are well suited to explicit, exhaustive checks: conventions, duplicate
                  searches, import restrictions, tests, and inventory comparisons. They are weaker at
                  the question that matters most: whether a change should exist. Let automation clear
                  tiers zero and one; preserve human attention for intent, abstraction, and architecture.
                </Paragraph>
                <Paragraph>
                  Avoid reviewing with the same model that authored the change when possible. The model
                  tends to reproduce its original reasoning and find it persuasive. Use a different
                  reviewer, frame the task adversarially, and search specifically for existing code the
                  agent may have reinvented. Agents raise the floor; they do not define the ceiling.
                </Paragraph>
              </ArticleSection>

              <ArticleSection eyebrow="Put it to work" id="skill" title="Copy the agent skill">
                <Paragraph>
                  This skill turns the article’s philosophy into operating instructions for an agent
                  authoring, splitting, or reviewing a pull request. Copy the complete Markdown into a{' '}
                  <code>SKILL.md</code> file in your agent’s skill directory.
                </Paragraph>
                <CopySkillButton skill={prReviewSkill} />
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    maxHeight: 640,
                    overflow: 'auto',
                    p: { xs: 2, md: 3 }
                  }}
                >
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{ fontFamily: 'monospace', m: 0, whiteSpace: 'pre-wrap' }}
                  >
                    {prReviewSkill}
                  </Typography>
                </Box>
              </ArticleSection>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}
