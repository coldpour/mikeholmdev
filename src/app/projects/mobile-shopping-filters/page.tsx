import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { withBasePath } from '@/app/paths'
import { SectionHeading } from '@/components/SectionHeading'
import { SiteShell } from '@/components/SiteShell'
import { ShoppingDemo } from './Demo'

export const metadata: Metadata = {
  title: 'Making mobile shopping awesome | Mike Holm',
  description: 'A mobile shopping design study: keep filters within reach, put fit before technical details, clear away promotions and give shoppers a useful end to the results.'
}

function Prose({ children }: { children: ReactNode }) {
  return <Typography component="div" variant="body1" sx={{ maxWidth: 760 }}>{children}</Typography>
}

function StorySection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <Box component="section" id={id} sx={{ scrollMarginTop: 24 }}>
    <Stack spacing={3}><SectionHeading title={title} />{children}</Stack>
  </Box>
}

export default function MobileShoppingFiltersPage() {
  return (
    <SiteShell>
      <Box component="article">
        <Stack spacing={{ xs: 7, md: 10 }}>
          <Box component="header">
            <Button href={withBasePath('/#projects')} startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>Back to projects</Button>
            <Stack spacing={3}>
              <Typography variant="overline">Designing filters for mobile shopping</Typography>
              <Typography variant="h1">Making mobile shopping awesome.</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                In a <Link href="https://business.columbia.edu/faculty/research/when-choice-demotivating-can-one-desire-too-much-good-thing">study of jam choices</Link>,
                shoppers were more likely to buy when offered six varieties instead of 24.
                When there are over 100 boots to choose from in a single store, we have to make
                that manageable and remove friction, or people will give up and go to a store
                that’s easier to shop. We’ve just lost a sale. If we make our store nice to be
                in, people will spend more time there and invite their friends.
              </Typography>
            </Stack>
          </Box>

          <ShoppingDemo />

          <StorySection id="starting-point" title="I came here to find a pair of boots">
            <Prose>
              Let’s say I want ankle boots in size 10. I choose a few filters and start scrolling.
              A couple of pairs look promising. Then I see a steel toe I don’t need, or a narrow
              fit that probably won’t work. I’ve learned something useful. I want to adjust the
              results while I’m thinking about it.
            </Prose>
            <Prose>
              But the filters are back at the top. A discount tab, an offers button and a chat
              bubble have followed me instead. I dismiss the discount, open the filter panel,
              and there it is again, covering Clear filters. The store keeps making room for its
              next request while I’m still trying to finish mine.
            </Prose>
            <ShoppingDemo stage="start" />
            <Prose>
              This starting point brings those problems into Sad Boot Store. It can filter
              products, but using it means managing the page as well as choosing the boots. On
              a phone, every floating control takes space away from the thing I came to compare.
            </Prose>
          </StorySection>

          <StorySection id="within-reach" title="First, I kept the filters within reach">
            <Prose>
              I made the filter toolbar sticky at the top of the shopping viewport. It stays
              available as the products move underneath it. I can open it halfway down the list
              or after the last pair. I don’t have to remember where the controls went.
            </Prose>
            <Prose>
              I put the selected filters directly below the toolbar. If I decide height doesn’t
              matter after all, I can remove Ankle without opening the panel. The filter count
              tells me there are choices in effect, and the result count tells me what those
              choices leave to look through.
            </Prose>
            <ShoppingDemo stage="reachable" />
            <Prose>
              Opening a panel shouldn’t lose my place. If I close it without applying anything,
              I’m back at the same boots. If I change the results, I return to the beginning of
              the new set so I don’t miss a pair that now qualifies. Those are different actions,
              and I want the page to behave accordingly.
            </Prose>
          </StorySection>

          <StorySection id="room-to-shop" title="Then I gave the shopping controls their space back">
            <Prose>
              I removed the floating offers from browsing. Making their close buttons smaller
              or moving the bubbles to another corner would still leave shoppers working around
              them. A filter panel needs the whole small screen for choosing filters.
            </Prose>
            <Prose>
              Inside the panel, the heading and close button stay at the top. Clear filters and
              Show results stay at the bottom while the choices scroll between them. I can clear
              the selections, see how many boots would match, and apply when I’m ready. Closing
              the panel leaves my previous choices alone.
            </Prose>
            <Prose>
              The welcome offer still has a place: inside the bag, after I’ve chosen something.
              The discount appears automatically below the subtotal, with the saving and total
              shown together. I don’t need to click to claim it. It doesn’t follow
              me around the catalog. If another promotion can be dismissed, I’d remember that
              dismissal across navigation and filter changes too. Closing it is a decision the
              store should respect.
            </Prose>
          </StorySection>

          <StorySection id="useful-choices" title="I put the decisions in the order I need them">
            <Prose>
              Size and width can rule a boot out immediately. I might want a slip-on I can leave
              by the door, or laces I can tighten for a hike. Height, intended use and toe
              protection tell me whether it suits the job. Weather helps me choose something
              comfortable. I moved those ahead of the details I might only care about after
              I’ve found a few candidates. Price and color follow, with lining and collection
              at the end of the same list. Every section starts collapsed, so I can scan the
              available filters before opening the ones I need.
            </Prose>
            <Prose>
              That’s the starting order. If I choose Height first, it goes to the top the next
              time I open the filters. Active categories keep the order I selected them in.
              When I stop using one, it moves below the active categories and stays above the
              ones I haven’t touched. I wait until the panel is closed to change that order,
              so selecting a checkbox never moves the controls under my finger.
            </Prose>
            <Prose>
              Sizes run from 3 to 17, with half sizes between 7 and 12. Each style has its own
              availability; choosing a size shouldn’t leave me looking at boots I can’t buy.
              Size 10, ankle height and a soft toe leave 42 styles here. Choosing lace-up and
              a wide fit brings that down to four. Now I have a few pairs to compare instead
              of a long list to scroll through.
            </Prose>
            <Prose>
              I still want specialists to find what they need. But I don’t want every shopper
              interpreting lining materials before they can ask for a warm boot. Weather gives
              them a familiar starting point. The material specifications stay available for
              someone who already knows what they want.
            </Prose>
            <ShoppingDemo stage="focused" />
            <Prose>
              Two camouflage sections made me stop and work out the difference. I brought them
              into Color & pattern, under Camouflage details. I can open the brand and pattern
              choices when I need them. Checking Camo doesn’t expand another section or move
              the next choice under my finger. Removing Camo also removes its dependent choices.
            </Prose>
            <Prose>
              I reduced sorting to Recommended, Best selling, Newest and the two price directions.
              Alphabetical order and oldest first didn’t help the shopping task I was designing
              for. I’d bring another option back if shoppers needed it, with a label that explained
              what it would do.
            </Prose>
          </StorySection>

          <StorySection id="honest-results" title="The results have to earn that simpler interface">
            <Prose>
              A count is only useful if the boots really match. Size, width and color need to be
              available together on one variant. A boot with size 10 in regular width and size 12
              in wide shouldn’t appear when I ask for size 10 wide. The results check the same
              variant for all three choices.
            </Prose>
            <Prose>
              An unavailable size shouldn’t be a dead end without an explanation. If it’s coming
              back, I show the expected date and offer a restock alert by email or text for that
              exact size, width and color. If it isn’t coming back, I leave it out of the catalog.
              The product button and selection summary stay together in the page, so scrolling
              doesn’t add a row and push the description out of place.
            </Prose>
            <Prose>
              Each filter option shows how many boots it would match with the other fields still
              applied. Choices with no matches are disabled, while selected choices stay available
              to remove. Within a field, I can choose alternatives; between fields, the boot has
              to satisfy all my requirements.
            </Prose>
            <Prose>
              Checking a box needs to feel immediate. I update the selection first and let the
              counts catch up separately. Editing a filter doesn’t redraw the product list behind
              the panel. I also keep selected values on the same line as each heading and keep
              the counts a fixed width. The next checkbox stays where my finger expects it,
              even when I choose several sizes.
            </Prose>
            <Prose>
              I also gave each boot one card and kept its colors together. Repeating the same
              name, price and reviews for separate colors makes the catalog feel larger
              without giving me another boot to consider. Here I can compare the model, height,
              toe protection and price, then open the details.
            </Prose>
            <Prose>
              If I do reach an empty result, the page says what happened and offers Adjust filters.
              I can remove one requirement and keep the rest. Clearing everything is available,
              but I shouldn’t have to start over just because a combination didn’t work.
            </Prose>
          </StorySection>

          <StorySection id="the-end" title="Finally, I made the end of the results useful">
            <Prose>
              Getting to the bottom should answer a simple question: have I seen everything?
              A newsletter form followed by company links doesn’t answer it. I added a visible
              endpoint immediately after the products, before the footer.
            </Prose>
            <Prose>
              All matching boots are on the page. After the last pair, it says I’ve seen every
              match and offers Adjust filters. I can also browse
              the full catalog without the current restrictions. I don’t have to scroll back
              through pairs I’ve already ruled out to take the next step.
            </Prose>
            <ShoppingDemo />
            <Prose>
              The footer is still there. Help and company information can be opened when needed.
              But the shopping experience gets to finish first, with a clear status and a useful
              action. Clearing the filters shows all 147 styles without another button to press.
              That’s a lot to scan on a phone. Choosing the fit, boot style and conditions brings
              it down to the pairs worth comparing.
            </Prose>
          </StorySection>

          <StorySection id="next" title="What I’d want to learn from shoppers">
            <Prose>
              I’d watch people find a pair on their own phones. Can they change a requirement
              while browsing? Do they understand what’s applied? When they reach the last result,
              do they know it’s the last one? I’d also watch whether the sticky controls take up
              too much of a short screen, especially with larger text.
            </Prose>
            <Prose>
              For a larger catalog, I’d connect the filters to current variant inventory and put
              the applied choices in shareable URLs. Loading and error states would need to keep
              the shopper’s choices intact. The filter order would need testing too. I’ve made a
              starting choice around fit and use; shoppers should tell me whether it matches
              how they decide.
            </Prose>
            <Prose>
              In the <Link href={withBasePath('/projects/reporting-filters')}>desktop reporting
              study</Link>, I kept the inputs ready for someone changing several conditions at
              a desk. On a phone, I gave browsing the space and kept the way to refine it close.
              The goal is the same: let people use what they’ve just learned without making
              them operate the whole interface again.
            </Prose>
          </StorySection>
        </Stack>
      </Box>
    </SiteShell>
  )
}
