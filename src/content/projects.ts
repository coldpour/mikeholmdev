import type { CaseStudyContent } from '@/components/CaseStudy'

export type Project = CaseStudyContent & {
  homepageGroup: 'featured' | 'percipient' | 'background'
  company: string
  cardTitle: string
  visual?: 'connect-four-board' | 'map-after' | 'triangles'
  links?: Array<{
    href: string
    label: string
  }>
}

export const projects: Project[] = [
  {
    slug: 'mikeholmmusic',
    homepageGroup: 'featured',
    company: 'Mike Holm Music',
    cardTitle: 'Reduced listening friction without tracking fans',
    eyebrow: 'Featured deep dive',
    title: 'Building mikeholmmusic.com',
    role: 'Music-site architecture, mobile-first UX, release data modeling, privacy-light personalization',
    summary:
      'Minimized friction when sharing music without compromising user privacy.',
    body: [
      'MikeHolmMusic.com solves a small but real problem: every listener has a different music app. Sending someone a Spotify link, an Apple Music link, or a YouTube Music link always leaves some people doing the manual translation layer themselves. The site gives me one place to share, then lets the listener pick the service that works for them.',
      'The architecture is centered on release data. Songs and albums are modeled with slugs, titles, artists, cover images, descriptions, lyrics, album relationships, and service links. React Router loaders resolve each song or album by slug, return a 404 when the release does not exist, and generate per-release metadata so individual songs have shareable pages instead of being trapped in a single link list.',
      'The most useful interaction is intentionally privacy-light. When someone clicks a listening service, the app stores only that preferred service in localStorage. It does not identify the person or track what they played. On the next song page, the site uses that local preference to hide the extra links and keep the listener focused on the app they already use, while still offering a Show all services escape hatch.',
      'The link filtering has one musician-specific rule: Bandcamp stays visible when it exists, even if the listener prefers another streaming service. That keeps the purchase/support path available without forcing every listener to scan a full grid of Spotify, Apple Music, YouTube Music, Amazon, Tidal, Deezer, and SoundCloud links every time.',
      'Images are hosted in Cloudinary instead of being committed into GitHub. The repo stays small and text-focused, while release art is still delivered from a CDN with transformation parameters like automatic format, automatic quality, width limiting, and contain sizing. That keeps the page visually rich without turning the source repository into an image archive.',
      'The song pages also act like liner notes that never went to print. For songs I wrote or worked on, the site can show lyrics, collaborators, credits, album relationships, and notes about what I contributed: drum parts, engineering choices, influences, studio constraints, and how a track developed. Because I am bad at writing about myself directly, I used AI as an interviewer to iteratively pull out those details from conversation and turn them into usable release notes.',
      'The design is mobile-first because that is where music discovery usually happens: someone opens a link from a text, social profile, venue conversation, or QR code and needs to get to a listening app quickly. The desktop design is intentionally less elaborate for now; the core job is a clean phone experience with large cover art, direct service buttons, readable notes, and minimal friction.'
    ],
    bullets: [
      'Modeled songs and albums as structured release data with typed service links, lyrics, descriptions, and album-track relationships.',
      'Used React Router loaders and per-release metadata so each song and album has a direct, shareable URL.',
      'Stored only a preferred listening service in localStorage, avoiding account state, analytics identity, or listener tracking.',
      'Filtered service links to the listener preference plus Bandcamp when available, reducing choice overload while preserving the support path.',
      'Kept release artwork out of the GitHub repo by using Cloudinary-hosted images with CDN delivery and transformation parameters.',
      'Used AI as an interviewer to draw out process notes, credits, memories, and songwriting context that were hard to write cold.',
      'Added song-level notes that explain my role in the process, like drums, engineering, arrangement choices, influences, and collaborators.',
      'Backed the preference behavior, release data, and routes with focused tests so the small conveniences stay reliable.',
      'Designed the experience mobile-first, prioritizing quick listening actions and readable notes over a more ornamental desktop layout.'
    ],
    comparison: [
      {
        title: 'Less Friction',
        body: 'One shareable song page can route listeners to the app they actually use. After they pick once, future pages show the useful links first instead of making them scan every service again.'
      },
      {
        title: 'More Context',
        body: 'Song pages become personal liner notes: lyrics, collaborators, credits, and process notes that explain what I contributed and how the recording came together.'
      }
    ],
    links: [
      {
        href: 'https://mikeholmmusic.com',
        label: 'Visit mikeholmmusic.com'
      }
    ]
  },
  {
    slug: 'redkarma13',
    homepageGroup: 'featured',
    company: 'Red Karma',
    cardTitle: 'Built a resilient static site for a working tribute band',
    eyebrow: 'Featured deep dive',
    title: 'Building redkarma13.com',
    role: 'Site architecture, static build pipeline, responsive UI, SEO-oriented content structure',
    summary:
      'Built a band site optimized to save time and money while delivering strong SEO, a polished fan experience, and automatic problem monitoring.',
    body: [
      'Red Karma needed the kind of site that matters for a working band: the name and offer have to be obvious immediately, upcoming shows need to be current, venues and ticket links need to be easy to scan, and booking contact information has to be reachable without making the visitor work.',
      'The architecture is deliberately small. The published site is static HTML, CSS, a few images and fonts, and two tiny progressive-enhancement scripts. Show data lives in a plain shows.txt file, then a Node build script parses it, validates it, sorts it, escapes generated text, and injects the resulting markup into index.html and past.html between explicit build markers.',
      'The business constraint mattered as much as the technical one. The band had been paying for a website subscription, and that recurring fee came straight out of money the band members could otherwise keep. By moving to free static hosting and free email while preserving the same public functionality, the site stopped acting like an ongoing tax on a small band.',
      'That data flow keeps the site robust because the expensive and failure-prone work happens before deploy. If a show block has the wrong shape, an invalid date, or an unsupported call-to-action, the build fails instead of publishing malformed markup. If JavaScript fails in the browser, the core content is still present in the HTML: the band description, show list, ticket links, merch, mailing list, socials, videos, and booking contact are all readable without client rendering.',
      'Maintenance is intentionally low-friction because the real workflow happens from the GitHub app on my phone. Adding a show takes as few characters as possible: date, venue, location, optional link, and optional cta. The script checks my work, generates the repeated markup, and keeps the upcoming and past-show pages in sync without making me edit HTML cards by hand.',
      'The SEO benefit comes from shipping meaningful content as document content, not app state or artwork. The band name is text, not an image, so robots can read RED KARMA directly. The live page exposes a clear title, semantic sections, descriptive copy, venue names, locations, dates, and ordinary links on first request.',
      'Shows are rendered into both the homepage and the past-shows page, then CSS uses classes from data-date attributes to hide whichever side does not belong for the current day. If someone leaves the site open in a tab and comes back the next day, a show can drop off the upcoming list and appear in the past-show archive without needing a redeploy.',
      'The mailing-list form is treated as production infrastructure, not a decorative embed. There is an end-to-end health check for the Mailchimp signup path, and if a new subscriber cannot be added, I get an email instead of discovering the problem after fans have already tried to sign up.',
      'The responsive behavior is poster-like rather than ordinary reflow. The page keeps the proportions of the hero, typography, video, and show treatments across screen sizes so the design still feels like band collateral instead of a desktop layout squeezed onto mobile. The past-shows page leans into that, styling the archive like an Eras Tour shirt: big dates, year breaks, uppercase venue type, and a narrow concert-merch rhythm.'
    ],
    bullets: [
      'Replaced a paid website subscription with free static hosting and free email so recurring web costs no longer reduced band member profit.',
      'Used shows.txt as the durable editing surface so show updates can be made quickly from the GitHub mobile app.',
      'Generated index.html and past.html from one source of truth to avoid duplicate show maintenance.',
      'Escaped generated venue, location, and link text before injecting it into HTML.',
      'Validated show block length, date format, month/day ranges, and allowed cta values during the build.',
      'Rendered all shows into both pages, then used data-date attributes, a small deferred script, and CSS classes to split past and future lists over time.',
      'Kept the band name as real text instead of a logo image so crawlers, screen readers, and copy/paste all see the same primary identity.',
      'Added an end-to-end Mailchimp signup monitor with email alerting for subscriber-add failures.',
      'Added reduced-motion and pointer checks to the sparkle trail so the visual flourish avoids touch devices and motion-sensitive users.',
      'Used proportional, viewport-aware sizing so the page scales like a poster while preserving the intended visual relationships.',
      'Styled past shows as a concert-shirt archive rather than a generic event table.'
    ],
    comparison: [
      {
        title: 'Easy to Maintain',
        body: 'The site can be kept current from a phone by changing tiny plain-text show entries. The script validates the input and regenerates layout, ticket buttons, and archive history.'
      },
      {
        title: 'Cheaper and Findable',
        body: 'Free hosting and email preserve the same functionality without a recurring subscription. The static HTML remains easy for robots to read: text band name, show dates, venues, locations, links, and booking details.'
      }
    ],
    links: [
      {
        href: 'https://redkarma13.com',
        label: 'Visit redkarma13.com'
      }
    ]
  },
  {
    slug: 'results-map',
    homepageGroup: 'percipient',
    company: 'Percipient.ai',
    cardTitle: 'Stabilized spatial review for search results',
    visual: 'map-after',
    eyebrow: 'Percipient deep dive',
    title: 'Maps for search result exploration',
    role: 'Principal UI Engineer, Tech Lead, spatial UX and map performance',
    summary:
      'Made spatial context a first-class part of media review, with stable clusters, mobile camera paths, and venue maps.',
    body: [
      'Customers were asking for mobile camera maps and venue maps on results pages at the same time. The starting point was not ready for that demand: maps were hidden on a separate tab, so users could not see spatial context while reviewing video, and the existing markers were unstable once the map became visible.',
      'Mirage results pair media review with spatial and temporal context: users inspect a video or image result, see where the source was located, and use a timeline to find other moments where relevant detections occurred. When map markers flashed and reclustered after metadata fetches or result changes, users lost the context they had just built.',
      'I moved the map below the video player and put the player and map in resizable panels with manual resizing plus preset maximize/minimize controls. Then I stabilized marker memoization by narrowing its inputs to search-scoped datasource locations.',
      'Once the map became a first-class part of the results page, it unlocked richer use cases. For mobile camera results, we plotted both the flight path and the specific detection locations associated with results and videos, helping users understand the route the camera took and the area it surveilled.',
      'We also added venue maps for indoor footage where geolocation alone was not enough. A user could associate a camera with an arbitrary image of a venue map, then see those cameras in search results. For retail loss-prevention workflows, that helped analysts build a report showing a suspect path through a store.'
    ],
    bullets: [
      'Removed selected-result state from the marker selector inputs so selection changes did not invalidate the marker set.',
      'Stopped feeding every cached datasource from Redux into marker memoization; the map only needed locations from datasources within the search, and stable markers mattered more than rare live location metadata updates.',
      'Replaced default Leaflet green markers with design-system-aware clustered markers.',
      'Used pie-style cluster markers so users could see multiple datasource types without expanding a cluster.',
      'Adapted the implementation across results pages ranging from TypeScript with hooks and React Query to older untyped JavaScript with Redux.'
    ],
    comparison: [
      {
        title: 'Before',
        body: 'The map was hidden on another tab, markers flashed and reclustered after unrelated metadata changes, and default markers gave little context about datasource types.'
      },
      {
        title: 'After',
        body: 'The map lived beside the review workflow, markers stayed stable across result changes, clusters communicated datasource composition, and users could resize media and map panels for the task at hand.'
      }
    ]
  },
  {
    slug: 'identity-image-upload',
    homepageGroup: 'percipient',
    company: 'Percipient.ai',
    cardTitle: 'Turned ambiguous AI output into a controllable workflow',
    eyebrow: 'Percipient deep dive',
    title: 'Bulk image upload for identity creation',
    role: 'Principal UI Engineer, Tech Lead, product workflow and resilient async UX',
    summary:
      'Designed a resilient folder-upload workflow that handled ambiguous face detection while keeping analysts in control.',
    body: [
      'The feature helped users create an identity from a folder of images without forcing them to manually inspect and label every image up front. Each uploaded image could contain zero, one, or many faces, so the interface needed to make useful assumptions while keeping the analyst in control.',
      'After upload, the system ran face detection and returned detections above a confidence threshold, around 60 percent. We displayed detections as clickable bounding boxes over the source image, then guided the user through the smallest necessary amount of confirmation.',
      'The key product choice was restraint. We could have tried to infer which face matched the other images, but that would have required more complex checking and rechecking against a folder that might contain arbitrary content. Instead, the workflow facilitated the decision and let the user make the call when ambiguity was real.',
      'Failure handling was part of the core workflow rather than an afterthought. Network failures exposed retry paths, partial success when appropriate, or a way to remove a problematic image and continue. The user always had visible progress, color, and text explaining what was happening.'
    ],
    bullets: [
      'No images or unsupported file types were handled immediately with clear validation states.',
      'A single confident face was auto-selected because there was no meaningful ambiguity.',
      'Images with no faces stayed visible with a red outline and removal instruction, rather than disappearing automatically.',
      'Images with multiple faces showed a yellow warning border and entered a disambiguation flow with selectable face tiles.',
      'The Proceed action stayed disabled until every remaining image had exactly one selected detection.'
    ]
  },
  {
    slug: 'library-scalability',
    homepageGroup: 'percipient',
    company: 'Percipient.ai',
    cardTitle: 'Made the media library linkable, scalable, and easier to debug',
    eyebrow: 'Percipient deep dive',
    title: 'Refactoring the library for scale and navigation',
    role: 'Principal UI Engineer, Tech Lead, URL architecture and scalable library UX',
    summary:
      'Moved durable navigation state into URLs, improved deep linking, and helped the library scale to larger datasets.',
    body: [
      'The original library stored navigation state in Redux: which folder the user was viewing, which video was selected, and where they were in the browsing flow. That made the interface fragile. A refresh dropped the user back at the beginning, browser back and forward did not map cleanly to the work being done, and users could not share a deep link to a folder or video.',
      'It also slowed development. This was before reliable webpack hot reload, so developers had to click through the same screens repeatedly after every change. Deep linking improved the feedback loop and made bugs easier to reproduce because a broken state could be captured, shared, refreshed, and debugged directly.',
      'The rewrite moved durable navigation state into the URL. A video or folder became addressable, reload-safe, and compatible with natural browser history, which made the library feel more like a filesystem and less like a single-page app that forgot its place.',
      'The important design choice was deciding what not to put in the URL. Encoding the full hierarchy looked descriptive, but it made links brittle in a collaborative system where objects could move. Encoding only the target resource made the route more durable and let the app resolve current context from the backend.'
    ],
    bullets: [
      'Kept URLs intentionally minimal: library/video/3 and library/folder/1 instead of library/1/folder/1/video/3.',
      'Reduced stale-link risk when another user moved a video, because URLs no longer encoded impossible parent-child combinations.',
      'Added pagination to list endpoints for libraries, folders, folder items, videos, identities, cameras, and similar collections.',
      'Made load time more consistent by avoiding accidental serialization of every entity in the database.',
      'Added drag and drop for reorganizing library content and folder permissions for constraining media visibility.',
      'Added deep search with keywords, data-type filters, and detection-object filters.',
      'Added bulk edit flows so users could update location or timezone across selected items instead of editing one by one.'
    ],
    comparison: [
      {
        title: 'Before',
        body: 'Redux held location-like state. Refreshing lost context, deep links were unavailable, list loads could balloon with dataset size, and content organization required too much one-off interaction.'
      },
      {
        title: 'After',
        body: 'The URL represented the current resource. Browser navigation worked naturally, links were shareable, list endpoints were paginated, and users could search, reorganize, permission, and bulk edit at scale.'
      }
    ]
  },
  {
    slug: 'build-vs-buy',
    homepageGroup: 'percipient',
    company: 'Percipient.ai',
    cardTitle: 'Protected product velocity with build-vs-buy discipline',
    eyebrow: 'Percipient deep dive',
    title: 'Build vs buy for product velocity',
    role: 'Principal UI Engineer, Tech Lead, technical strategy and standardization',
    summary:
      'Standardized around mature ecosystem tools so startup engineering time went toward product-specific workflows.',
    body: [
      'Mirage differentiated through the unique capabilities we brought to customers, not through reimplementing solved frontend infrastructure. I pushed the team toward a build-vs-buy posture: build the domain-specific workflows that made the product valuable, and adopt mature libraries for generic problems.',
      'That meant replacing local utilities and inconsistent patterns with well-documented ecosystem tools. The goal was to reduce maintenance surface area, improve correctness, and let engineers spend more time on customer-facing product work.',
      'The same reasoning shaped testing. We chose Cypress because it gave us a dashboard for aggregating results and managing UI-test flake over time. We wrote tests for our business logic and workflows; we did not spend startup cycles building test aggregation infrastructure.',
      'In a startup environment, those saved cycles translated directly into more complete features. Deep documentation and shared ecosystem patterns helped developers move faster, onboard more easily, and focus on the business problems instead of the edge cases of solved problems.'
    ],
    bullets: [
      'Moved date handling from custom browser-sensitive date utilities to Moment, then Luxon.',
      'Replaced custom pluralization helpers with pluralize.',
      'Shifted server-state management away from hand-rolled Redux slices toward React Query.',
      'Moved user-input and API-response validation from bespoke checks to Zod schemas.',
      'Consolidated bespoke CSS, color constants, layout styles, and inconsistent padding into Material UI with a custom theme.'
    ],
    comparison: [
      {
        title: 'Build',
        body: 'Analyst workflows, search and results experiences, identity creation, spatial review, and product-specific behavior customers were paying us to solve.'
      },
      {
        title: 'Buy or adopt',
        body: 'Dates, pluralization, server-state caching, validation, design-system primitives, theming, layout consistency, and test-result infrastructure.'
      }
    ]
  },
  {
    slug: 'mineral-ui',
    homepageGroup: 'featured',
    company: 'CA Technologies',
    cardTitle: 'Moved a design system from component library to shared practice',
    eyebrow: 'Design system work',
    title: 'Mineral-UI',
    role: 'Developer advocacy and adoption, CA Technologies, 2017-2018',
    summary:
      'Helped move a large enterprise design system from a library in a repo to a shared practice across product teams.',
    body: [
      "Mineral-UI was CA Technologies' React design system and component library. My primary role was not simply adding components; three full-time engineers were already focused on that. I operated more like a developer advocate, evangelist, forward-deployed engineer, and internal solution architect for design-system adoption.",
      'Inside a 12,000-person company, the harder problem was finding UI teams, building trust, and showing why shared components were worth the migration cost. I worked with the Chief Design Officer, traveled to other sites, partnered directly with product teams, and helped teams implement Mineral-UI in their own codebases.',
      'The public history still shows meaningful engineering output: 39 merged PRs authored by coldpour and 50 commits authored as Mike Holm. But the most important contribution was helping a design system move from a library in a repo to a shared practice across teams.'
    ],
    bullets: [
      'Identified and networked with UI teams across the company to understand their constraints and adoption blockers.',
      'Built bridges between design leadership, product teams, and the component-library team so reuse could become an organizational habit.',
      'Delivered direct implementations with partner teams, functioning as a forward-deployed engineer and solution architect.',
      'Created demos, documentation, install guidance, roadmap/status pages, and process docs that made adoption easier to evaluate and start.',
      'Used repo contributions as leverage for adoption: live examples, website improvements, Button/Tooltip/Popover work, tests, and build/release fixes were bonus work on top of the advocacy role.'
    ],
    links: [
      {
        href: 'https://github.com/mineral-ui/mineral-ui',
        label: 'View the Mineral-UI repository'
      }
    ]
  },
  {
    slug: 'svg-animation',
    homepageGroup: 'featured',
    company: 'Mineral-UI / coldpour',
    cardTitle: 'Deleted runtime animation cost by generating SVG',
    visual: 'triangles',
    eyebrow: 'Featured deep dive',
    title: 'Deleting 2000 lines of JavaScript with SVG',
    role: 'SVG animation generator',
    summary:
      'Moved animation cost from runtime JavaScript into generated SVG, preserving the visual effect while avoiding DOM churn.',
    body: [
      'A performance problem on the Mineral-UI homepage turned into a build-time SVG generation project. The original animation updated hundreds of polygons every few milliseconds, monopolizing the JavaScript thread and making the page hard to scroll.',
      'The replacement moved the expensive work out of the browser runtime. I generated a static SVG with per-triangle keyframes, using centroid math, light-path interpolation, mirrored timing, and compact color output to keep the animation smooth and portable.',
      'The generator lives in coldpour/triangles as svg-triangles, a small JavaScript project for drawing and animating SVG triangles with compute and draw modules plus Mocha/Chai tests.'
    ],
    bullets: [
      'Converted a DOM-thrashing runtime loop into declarative SVG animation.',
      'Computed viewBox bounds, triangle centroids, light distance, keyTimes, and values ahead of time.',
      'Kept the final asset compatible with the site layout by shipping it as a scalable background image.',
      'Documented the project publicly in a technical article after building the original code.'
    ],
    links: [
      {
        href: 'https://codeburst.io/deleting-2000-lines-of-javascript-with-svg-424b89c6e466',
        label: 'Read the original article'
      },
      {
        href: 'https://github.com/coldpour/triangles',
        label: 'View the generator repo'
      }
    ]
  },
  {
    slug: 'prolog-connect-4',
    homepageGroup: 'background',
    company: 'St. Olaf College',
    cardTitle: 'Modeled a playable strategy game in logic programming',
    visual: 'connect-four-board',
    eyebrow: 'Logic programming',
    title: 'Connect 4 in Prolog',
    role: 'Logic programming final, St. Olaf College, May 2011',
    summary:
      'Built a terminal Connect 4 game with multiple computer opponents and strategic rules in Prolog.',
    body: [
      'This was a playable terminal implementation of Connect 4 written for the gprolog interpreter. A human player could choose a tile, choose a computer opponent, play through a text-rendered 7x6 grid, and quit or restart from the prompts.',
      'The interesting part was not the board game itself; it was expressing game flow, move validation, win detection, and opponent strategy in Prolog. The main loop alternated user and computer moves, checked for wins and full boards, and kept input handling separate enough that the player could quit from any prompt.',
      'The project also exposed a practical testing problem: strategic games are hard to debug when the opponent is nondeterministic. Reproducing bugs often meant steering the board into a specific state by hand, and random move selection was constrained by Prolog backtracking behavior.'
    ],
    bullets: [
      'Implemented four distinct computer opponents with a framework for adding more.',
      'Prioritized immediate wins, forced blocks, two-piece extensions, and defensive blocking of opponent threats.',
      'Added forward-looking checks so the computer would avoid moves that set up the player to win or broke its own threats.',
      'Printed game statistics on quit and highlighted the winning connection in the terminal.'
    ]
  }
]

export const projectBySlug = new Map(projects.map(project => [project.slug, project]))

export const featuredProjects = projects.filter(project => project.homepageGroup !== 'background')
