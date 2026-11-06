import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { withBasePath } from '@/app/paths'
import { CodeBlock as Code } from '@/components/CodeBlock'
import { SectionHeading } from '@/components/SectionHeading'
import { SiteShell } from '@/components/SiteShell'
import { ChipsDemo, DenseDemo, FinalDemo, StartDemo, TypeDemo } from './Demo'

export const metadata: Metadata = {
  title: 'Filters that stay out of the way | Mike Holm',
  description:
    'How I rebuilt a reporting interface, from plain form rows to field chips, shareable reports and a filter model that catches mistakes before users see them.'
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <Typography component="div" variant="body1" sx={{ maxWidth: 760 }}>
      {children}
    </Typography>
  )
}

function StorySection({
  title,
  children,
  id
}: {
  title: string
  children: ReactNode
  id?: string
}) {
  return (
    <Box component="section" id={id} sx={{ scrollMarginTop: 24 }}>
      <Stack spacing={3}>
        <SectionHeading title={title} />
        {children}
      </Stack>
    </Box>
  )
}

export default function ReportingFiltersPage() {
  return (
    <SiteShell>
      <Box component="article">
        <Stack spacing={{ xs: 7, md: 10 }}>
          <Box component="header">
            <Button href={withBasePath('/#projects')} startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
              Back to projects
            </Button>
            <Stack spacing={3}>
              <Typography variant="overline">Designing filters for desktop reporting</Typography>
              <Typography variant="h1">
                Filters that stay <br />
                out of the way.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                I wanted users to be able to put together a report without spending most of their
                time configuring filters. Here’s where I ended up. Below it, I’ll show you what I
                started with, what I changed, and a few things that took more work than I expected.
              </Typography>
            </Stack>
          </Box>

          <FinalDemo />

          <StorySection id="starting-point" title="Functional unstyled foundation">
            <Prose>
              Native elements give me a lot for free: keyboard support, focus behavior, validation
              and browser date pickers. That’s a useful foundation. But if I stop at something
              purely functional, users are going to spend more time operating the form than they
              want to.
            </Prose>
            <StartDemo />
            <Prose>
              Let’s say you want to find all audio equipment that costs more than $50 and less than
              $150 per day. First, you choose Category, set the condition to is and select Audio.
              Then you add a Daily rate filter, choose above and enter 50. Add another filter,
              select Daily rate again, choose below and enter 150. Finally, click Apply.
            </Prose>
            <Prose>
              By then, the filters take up most of the screen. Sure, it works, but it makes a simple
              report feel like a chore. I want this interface to make the user’s work easier. All
              that repeated setup gets in the way of the report they came to make.
            </Prose>
          </StorySection>

          <StorySection title="First, I made the rows smaller">
            <Prose>
              I brought the controls into the site’s design system and put each condition on one
              line. Each row read like a sentence: “Where equipment contains recorder,” followed by
              “and” for the next condition. I didn’t need three labels above every condition to
              explain that.
            </Prose>
            <DenseDemo />
            <Prose>
              I also replaced the operator dropdown with a few visible choices. Text searches start
              with contains because that’s what I usually want when I’m trying to find a record.
              Dates say before and after. I don’t want users translating “less than” into a date
              comparison in their heads.
            </Prose>
            <Prose>
              Once the results updated automatically, I could remove Apply. Empty rows don’t affect
              the report, so a user can start a condition without accidentally filtering everything
              out.
            </Prose>
            <Prose>
              This gave the table more room, but I still had to click Add filter before I could even
              choose a field. And that daily rate range still took two rows. I kept going.
            </Prose>
          </StorySection>

          <StorySection title="Then I got rid of Add filter">
            <Prose>
              Why am I making users click “Add filter” over and over? Why am I making them click it
              even once? What if all the filters were already on screen, so users could see every
              available field and start using it without choosing it from a dropdown?
            </Prose>
            <ChipsDemo />
            <Prose>
              For numbers and dates, I put both ends of the range in the same editor. Either end
              could be blank for a one-sided condition. I added an exact-value switch for the cases
              where a range wasn’t what the user wanted. That $50 to $150 report took one editor
              instead of two rows.
            </Prose>
            <Prose>
              I liked this until I entered a long value. The button got wider, the next button
              moved, and sometimes a whole row wrapped. Every edit could rearrange the controls.
              That’s annoying when a user has already learned where to find a field.
            </Prose>
            <Prose>
              I gave each field a fixed slot and put its value underneath the label. Find equipment
              grouped the name, location and custodian. Inventory profile put category, rate and
              units together for reports. Lifecycle held the two dates. I chose those groups around
              the tasks I’d expect users to return to.
            </Prose>
            <Prose>
              Fixed slots made the positions predictable, but I was still giving each field a large
              button and a separate editor. The table had more room than it started with, and I
              thought I could get some more of that space back.
            </Prose>
          </StorySection>

          <StorySection title="I put the inputs in the filters">
            <Prose>
              Once the fields had stable positions, I didn’t need the buttons to open another
              interface. I put the inputs directly inside the filters. The label, value and
              comparison controls now stay together, and users can move straight from one field to
              the next without opening and closing popups.
            </Prose>
            <Prose>
              I kept the groups and tightened the controls around the values they hold. Text and
              category fields have one input; ranges keep both ends together. The inputs use the
              same MUI theme as the rest of the site, so I can make this denser without inventing
              another set of fonts, colors and interaction states.
            </Prose>
            <Prose>
              That puts more controls on screen at once, but each one takes less room than the
              button it replaced. For a desktop user changing several conditions, I’d rather keep
              the fields ready to edit. With eighty fields or nested AND/OR conditions, I’d still
              want a searchable picker and a more flexible builder.
            </Prose>
          </StorySection>

          <StorySection title="Share the work with a link">
            <Prose>
              What’s the point of a web application if users have to take a screenshot or export a
              CSV just to show someone what they’re looking at?
            </Prose>
            <Prose>
              I want users to be able to share the work they’ve done or something interesting
              they’ve found. Sending a link should let another user pick up where they left off,
              with the same filters and sort order. The interface should support that as part of the
              work.
            </Prose>
            <Prose>
              Single-page applications don’t give me that automatically. It’s not difficult, but I
              have to decide which state belongs in the URL and make sure the application can
              restore it. That also gives users a report they can bookmark, refresh or return to
              with the Back button.
            </Prose>
            <Prose>
              So I put the applied filters and sort order in the URL. I use{' '}
              <code>useSyncExternalStore</code> to subscribe to it. There isn’t another copy of the
              applied filters in React state that I have to keep in sync.
            </Prose>
            <Code language="text">{`Input draft → 300 ms pause → URL → query → results`}</Code>
            <Prose>
              Each input keeps a short-lived draft. That lets it update immediately while I wait for
              a short pause before changing the report. Moving out of the input commits the latest
              draft. Pressing Back discards unfinished edits and restores the filters from the URL.
            </Prose>
            <Prose>
              My first pass added too many history entries. Pressing Back through every letter of
              “North studio” is a pretty good way to make users stop trusting the Back button. I
              changed it so edits within 700 ms share an entry. I keep the actual report settings in
              the URL; an input draft or a copied-link message can stay local.
            </Prose>
          </StorySection>

          <StorySection title="Designed for the real world">
            <Prose>
              I treat every network request like a flight to the moon. It can take longer than I’d
              like, and there are a hundred ways for it to go wrong. Slow connections, failed
              requests and timeouts are part of the environment I’m building for.
            </Prose>
            <Prose>
              Users want to take the network for granted. They also need to know when the app is
              waiting, retrying or unable to get fresh data. I don’t want results changing out of
              nowhere because a background request was invisible, or the layout jumping around while
              new content loads.
            </Prose>
            <Prose>
              A single failed request shouldn’t stop users from working or force them to reload and
              rebuild their report. I want the interface to keep their work, explain what’s
              happening and give them a way to recover.
            </Prose>
            <Prose>
              To exercise those conditions here, I generate the equipment records locally and run
              the report through an asynchronous function that can delay or fail a request.
            </Prose>
            <Prose>
              The Realistic setting chooses a fresh outcome for each attempt. Some finish quickly,
              some take a few seconds, and some fail. I let TanStack Query retry a failed request
              twice. Each retry gets its own random outcome, so it can fail again. If all three
              attempts fail, users get a Try again button and keep their filters. The other settings
              let you hold the demo on fast success, slow success, or persistent failure.
            </Prose>
            <Prose>
              While a request runs, I leave the previous results visible and label them as previous
              results. After two seconds I add a message acknowledging the wait. I disable Export
              until the new results arrive, because I don’t want users downloading stale rows under
              the new filter settings.
            </Prose>
            <Prose>
              I also don’t want typing to wait on any of this. I keep input updates inside the field
              and memoize the table rows so a keystroke doesn’t rebuild the table. A slow request
              can delay the results without delaying what the user is typing.
            </Prose>
            <Prose>
              I put copy buttons on asset IDs, phone numbers and email addresses. Those are easy to
              miscopy when users have to select the text themselves. Phone numbers also have a call
              button, and email addresses have an email button. The actions appear on hover or
              keyboard focus, and stay visible on touchscreens.
            </Prose>
            <Prose>
              I used TanStack Query for caching and cancellation as well. When users change the
              question before a request finishes, I cancel the old work. For the table, I used its{' '}
              <Link href="https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries">
                previous-data support
              </Link>{' '}
              to avoid flashing an empty result area on every change. The{' '}
              <Link href="https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation">
                cancellation docs
              </Link>{' '}
              cover how the abort signal reaches the query function.
            </Prose>
          </StorySection>

          <StorySection
            id="filter-model"
            title="Use TypeScript to make the architecture harder to get wrong"
          >
            <Prose>
              I want the types to carry the rules for a filter, so the rest of the architecture has
              fewer ways to get it wrong. If a combination doesn’t make sense, TypeScript should
              reject it wherever it’s created. Every caller shouldn’t have to remember the same
              checks.
            </Prose>
            <Prose>
              Separate lists of fields and operators can keep the controls working, but they don’t
              stop other code from constructing this:
            </Prose>
            <Code>{`type LooseFilter = {
  field: keyof Equipment;
  operator: 'is' | 'includes' | 'lessThan' | 'greaterThan';
  value: string;
};

const filter: LooseFilter = {
  field: 'name',
  operator: 'greaterThan',
  value: 'Field recorder'
};`}</Code>
            <Prose>
              TypeScript is happy with that. I’m asking whether an equipment name is greater than
              “Field recorder,” and nothing in the type says I can’t. The dropdown may prevent users
              from choosing it, but another caller could still build that object.
            </Prose>
            <Prose>
              That’s why I made Filter a discriminated union. The relationship between the field,
              operator and value becomes part of the type, and every editor, report and export gets
              the same restrictions:
            </Prose>
            <Code>{`type Filter =
  | {
      type: 'text';
      field: 'name' | 'location' | 'custodian';
      operator: 'is' | 'includes';
      value: string;
    }
  | {
      type: 'number';
      field: 'dailyRate' | 'units';
      operator: 'is' | 'lessThan' | 'greaterThan';
      value: number;
    }
  | {
      type: 'date';
      field: 'acquiredOn' | 'servicedOn';
      operator: 'is' | 'lessThan' | 'greaterThan';
      value: string;
    }
  | {
      type: 'category';
      field: 'category';
      operator: 'is';
      value: 'Audio' | 'Camera' | 'Lighting' | 'Support';
    };`}</Code>
            <Prose>
              The <code>type</code> property is the discriminant. When it’s text, TypeScript only
              allows text fields and text operators. When it’s number, the value has to be a number
              too. I gave category its own branch so a misspelled category can’t quietly become a
              filter that never matches anything.
            </Prose>
            <Code>{`// This works.
const rate: Filter = {
  type: 'number', field: 'dailyRate', operator: 'lessThan', value: 150
};

// TypeScript rejects this operator for a text filter.
const invalid: Filter = {
  type: 'text', field: 'name', operator: 'greaterThan', value: 'Field recorder'
};`}</Code>
            <TypeDemo />
            <Prose>
              I still have to validate data coming from the URL. TypeScript can check the objects I
              write, but it can’t check a link a user pastes into the address bar. I check the
              parsed fields, operators and values before running the report. Dates need a real
              calendar date, numbers need to be finite, and categories need to be one of the known
              choices.
            </Prose>
            <Prose>
              I’ve made invalid filters harder to express and moved those checks into one place. The
              types do more of the work, so correctness depends less on every caller getting every
              detail right.
            </Prose>
          </StorySection>

          <StorySection title="Where I’d take it next">
            <Prose>
              I’d improve the date picker. Native date pickers work well on mobile, but on desktop
              they leave a lot to be desired, especially when users need to jump between years or
              set a date range. I’d keep the native mobile experience and give desktop users a
              picker that makes those tasks easier.
            </Prose>
            <Prose>
              With only 120 records, I don’t need pagination or virtualization to keep the DOM
              manageable. At ten thousand, a hundred thousand or millions of records, loading
              everything would be expensive for the server to serialize and the user’s browser to
              render. I’d use server-side filtering and pagination to limit how much data moves at
              once, and virtualization to limit how much the browser renders. I’d also consider
              whether a more focused workflow could help users find what they need without asking
              them to navigate such a large result set.
            </Prose>
            <Prose>
              I’d also want to watch regular users build a few reports. I chose the field groups
              based on likely tasks; I’d want to see whether users reach for the same fields
              together. That would tell me whether to keep these groups or change them before adding
              more controls.
            </Prose>
          </StorySection>
        </Stack>
      </Box>
    </SiteShell>
  )
}
