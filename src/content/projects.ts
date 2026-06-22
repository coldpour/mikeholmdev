import type { CaseStudyContent } from '@/components/CaseStudy'

export type Project = CaseStudyContent & {
  homepageGroup: 'featured' | 'percipient' | 'background'
  links?: Array<{
    href: string
    label: string
  }>
}

export const projects: Project[] = [
  {
    slug: 'results-map',
    homepageGroup: 'percipient',
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
