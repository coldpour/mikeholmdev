const H = require('jshtml')
const page = require('./page')
const contact = require('./contact')
const education = require('./education')

const articleUrl =
  'https://codeburst.io/deleting-2000-lines-of-javascript-with-svg-424b89c6e466'

const projectVisual = () =>
  H.div(
    { class: 'project-visual', 'aria-hidden': 'true' },
    '<div class="triangles-layer"></div>'
  )

const deepDive = () =>
  H.article(
    { class: 'deep-dive', id: 'svg-animation' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Featured deep dive'),
      H.h2('Deleting 2000 lines of JavaScript with SVG')
    ),
    H.div(
      { class: 'deep-dive-grid' },
      projectVisual(),
      H.div(
        { class: 'deep-dive-copy' },
        H.p(
          'A performance problem on the Mineral-UI homepage turned into a build-time SVG generation project. The original animation updated hundreds of polygons every few milliseconds, monopolizing the JavaScript thread and making the page hard to scroll.'
        ),
        H.p(
          'The replacement moved the expensive work out of the browser runtime. I generated a static SVG with per-triangle keyframes, using centroid math, light-path interpolation, mirrored timing, and compact color output to keep the animation smooth and portable.'
        ),
        H.p(
          'The generator lives in coldpour/triangles as svg-triangles, a small JavaScript project for drawing and animating SVG triangles with compute and draw modules plus Mocha/Chai tests.'
        ),
        H.ul(
          H.li(
            'Converted a DOM-thrashing runtime loop into declarative SVG animation.'
          ),
          H.li(
            'Computed viewBox bounds, triangle centroids, light distance, keyTimes, and values ahead of time.'
          ),
          H.li(
            'Kept the final asset compatible with the site layout by shipping it as a scalable background image.'
          ),
          H.li(
            'Documented the project publicly in a technical article after building the original code.'
          )
        ),
        H.p(
          { class: 'link-row' },
          H.a(
            { class: 'text-link', href: articleUrl },
            'Read the original article'
          ),
          H.a(
            {
              class: 'text-link',
              href: 'https://github.com/coldpour/triangles'
            },
            'View the generator repo'
          )
        )
      )
    )
  )

const projects = () =>
  H.section(
    { class: 'projects', id: 'projects' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Selected work'),
      H.h2('Projects with room for the tradeoffs')
    ),
    H.div(
      { class: 'project-list' },
      H.article(
        { class: 'project-card' },
        H.h3('SVG animation generator'),
        H.p(
          'Moved animation cost from runtime JavaScript into generated SVG, preserving the visual effect while avoiding DOM churn.'
        ),
        H.a({ href: '#svg-animation' }, 'Read the deep dive')
      ),
      H.article(
        { class: 'project-card' },
        H.h3('Design system foundations'),
        H.p(
          'Drove design-system adoption inside a large enterprise by combining developer advocacy, cross-team consulting, and targeted engineering work.'
        ),
        H.a({ href: '#mineral-ui' }, 'Read the case study')
      ),
      H.article(
        { class: 'project-card' },
        H.h3('Human-centered AI workflows'),
        H.p(
          'Current work at Percipient.ai focuses on interfaces and systems for analysts working with AI-assisted intelligence workflows.'
        ),
        H.p(
          { class: 'card-links' },
          H.a({ href: '#library-scalability' }, 'Library scalability'),
          H.a({ href: '#results-map' }, 'Results maps'),
          H.a({ href: '#identity-image-upload' }, 'Identity upload')
        )
      ),
      H.article(
        { class: 'project-card' },
        H.h3('Prolog Connect 4'),
        H.p(
          'Built a terminal Connect 4 game with multiple computer opponents, strategic rules, and turn-based game-state handling in Prolog.'
        ),
        H.a({ href: '#prolog-connect-4' }, 'Read the project notes')
      )
    )
  )

const mineralUi = () =>
  H.article(
    { class: 'case-study', id: 'mineral-ui' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Design system work'),
      H.h2('Mineral-UI')
    ),
    H.div(
      { class: 'case-study-layout' },
      H.p(
        { class: 'role-meta' },
        'Developer advocacy and adoption, CA Technologies, 2017-2018'
      ),
      H.div(
        { class: 'case-study-copy' },
        H.p(
          "Mineral-UI was CA Technologies' React design system and component library. My primary role was not simply adding components; three full-time engineers were already focused on that. I operated more like a developer advocate, evangelist, forward-deployed engineer, and internal solution architect for design-system adoption."
        ),
        H.p(
          'Inside a 12,000-person company, the harder problem was finding UI teams, building trust, and showing why shared components were worth the migration cost. I worked with the Chief Design Officer, traveled to other sites, partnered directly with product teams, and helped teams implement Mineral-UI in their own codebases.'
        ),
        H.ul(
          H.li(
            'Identified and networked with UI teams across the company to understand their constraints and adoption blockers.'
          ),
          H.li(
            'Built bridges between design leadership, product teams, and the component-library team so reuse could become an organizational habit.'
          ),
          H.li(
            'Delivered direct implementations with partner teams, functioning as a forward-deployed engineer and solution architect.'
          ),
          H.li(
            'Created demos, documentation, install guidance, roadmap/status pages, and process docs that made adoption easier to evaluate and start.'
          ),
          H.li(
            'Used repo contributions as leverage for adoption: live examples, website improvements, Button/Tooltip/Popover work, tests, and build/release fixes were bonus work on top of the advocacy role.'
          )
        ),
        H.p(
          'The public history still shows meaningful engineering output: 39 merged PRs authored by coldpour and 50 commits authored as Mike Holm. But the most important contribution was helping a design system move from a library in a repo to a shared practice across teams.'
        ),
        H.a(
          {
            class: 'text-link',
            href: 'https://github.com/mineral-ui/mineral-ui'
          },
          'View the Mineral-UI repository'
        )
      )
    )
  )

const prologConnectFour = () =>
  H.article(
    { class: 'case-study', id: 'prolog-connect-4' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Early AI project'),
      H.h2('Connect 4 in Prolog')
    ),
    H.div(
      { class: 'case-study-layout' },
      H.p(
        { class: 'role-meta' },
        'Logic programming final, St. Olaf College, May 2011'
      ),
      H.div(
        { class: 'case-study-copy' },
        H.p(
          'This was a playable terminal implementation of Connect 4 written for the gprolog interpreter. A human player could choose a tile, choose a computer opponent, play through a text-rendered 7x6 grid, and quit or restart from the prompts.'
        ),
        H.p(
          'The interesting part was not the board game itself; it was expressing game flow, move validation, win detection, and opponent strategy in Prolog. The main loop alternated user and computer moves, checked for wins and full boards, and kept input handling separate enough that the player could quit from any prompt.'
        ),
        H.ul(
          H.li(
            'Implemented four distinct computer opponents with a framework for adding more.'
          ),
          H.li(
            'Prioritized immediate wins, forced blocks, two-piece extensions, and defensive blocking of opponent threats.'
          ),
          H.li(
            'Added forward-looking checks so the computer would avoid moves that set up the player to win or broke its own threats.'
          ),
          H.li(
            'Printed game statistics on quit and highlighted the winning connection in the terminal.'
          )
        ),
        H.p(
          'The project also exposed a practical testing problem: strategic games are hard to debug when the opponent is nondeterministic. Reproducing bugs often meant steering the board into a specific state by hand, and random move selection was constrained by Prolog backtracking behavior.'
        )
      )
    )
  )

const currentWork = () =>
  H.section(
    { class: 'current-work', id: 'current-work' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Current work'),
      H.h2('Percipient.ai')
    ),
    H.div(
      { class: 'role-layout' },
      H.p(
        { class: 'role-meta' },
        'Principal UI Engineer, Tech Lead, 2020-present'
      ),
      H.div(
        H.p(
          'Percipient.ai builds Mirage, an intelligence analysis platform for national security missions. My portfolio should handle this work differently from a resume: some details need to stay high-level, but the product context and engineering shape still matter.'
        ),
        H.p(
          'This section is intentionally framed as a placeholder for deeper, approved writeups about complex product work, AI-assisted workflows, data-heavy interfaces, and engineering decisions made under real operational constraints.'
        )
      )
    )
  )

const stateNode = (status, title, description) =>
  H.li({ class: `state-node state-${status}` }, H.h3(title), H.p(description))

const identityUploadWorkflow = () =>
  H.article(
    { class: 'case-study percipient-case-study', id: 'identity-image-upload' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Percipient deep dive sketch'),
      H.h2('Bulk image upload for identity creation')
    ),
    H.div(
      { class: 'case-study-layout' },
      H.p(
        { class: 'role-meta' },
        'Principal UI Engineer, Tech Lead, product workflow and resilient async UX'
      ),
      H.div(
        { class: 'case-study-copy' },
        H.p(
          'The feature helped users create an identity from a folder of images without forcing them to manually inspect and label every image up front. Each uploaded image could contain zero, one, or many faces, so the interface needed to make useful assumptions while keeping the analyst in control.'
        ),
        H.p(
          'After upload, the system ran face detection and returned detections above a confidence threshold, around 60 percent. We displayed detections as clickable bounding boxes over the source image, then guided the user through the smallest necessary amount of confirmation.'
        ),
        H.ul(
          H.li(
            'No images or unsupported file types were handled immediately with clear validation states.'
          ),
          H.li(
            'A single confident face was auto-selected because there was no meaningful ambiguity.'
          ),
          H.li(
            'Images with no faces stayed visible with a red outline and removal instruction, rather than disappearing automatically.'
          ),
          H.li(
            'Images with multiple faces showed a yellow warning border and entered a disambiguation flow with selectable face tiles.'
          ),
          H.li(
            'The Proceed action stayed disabled until every remaining image had exactly one selected detection.'
          )
        ),
        H.p(
          'The key product choice was restraint. We could have tried to infer which face matched the other images, but that would have required more complex checking and rechecking against a folder that might contain arbitrary content. Instead, the workflow facilitated the decision and let the user make the call when ambiguity was real.'
        ),
        H.div(
          {
            class: 'state-diagram',
            role: 'img',
            'aria-label':
              'State diagram for bulk image upload identity creation workflow'
          },
          H.ol(
            stateNode(
              'neutral',
              'Upload folder',
              'Accept images, reject unsupported files, and handle empty folders.'
            ),
            stateNode(
              'loading',
              'Detect faces',
              'Run detection, show in-flight status, and fetch detections above the confidence threshold.'
            ),
            stateNode(
              'success',
              'Single face',
              'Auto-select the only confident detection and mark the image ready.'
            ),
            stateNode(
              'warning',
              'Multiple faces',
              'Warn the user and open a face-tile disambiguation workflow on click.'
            ),
            stateNode(
              'danger',
              'No faces',
              'Keep the image visible, explain the issue, and ask the user to remove it explicitly.'
            ),
            stateNode(
              'success',
              'Ready to proceed',
              'Enable Proceed when every remaining image has one selected face.'
            ),
            stateNode(
              'loading',
              'Create identity',
              'Use the first selected detection to create the identity entity.'
            ),
            stateNode(
              'loading',
              'Attach remaining faces',
              'Make subsequent REST calls to add the other selected detections.'
            ),
            stateNode(
              'warning',
              'Partial failure',
              'Allow retry, remove-and-proceed, or partial success where possible.'
            ),
            stateNode(
              'success',
              'Complete',
              'Finish with no hidden work and no ambiguous state.'
            )
          )
        ),
        H.p(
          'Failure handling was part of the core workflow rather than an afterthought. Network failures exposed retry paths, partial success when appropriate, or a way to remove a problematic image and continue. The user always had visible progress, color, and text explaining what was happening.'
        )
      )
    )
  )

const resultsMapWorkflow = () =>
  H.article(
    { class: 'case-study percipient-case-study', id: 'results-map' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Percipient deep dive sketch'),
      H.h2('Maps for search result exploration')
    ),
    H.div(
      { class: 'case-study-layout' },
      H.p(
        { class: 'role-meta' },
        'Principal UI Engineer, Tech Lead, spatial UX and map performance'
      ),
      H.div(
        { class: 'case-study-copy' },
        H.div(
          { class: 'star-story' },
          H.article(
            H.h3('Situation'),
            H.p(
              'Customers were asking for mobile camera maps and venue maps on results pages at the same time. The starting point was not ready for that demand: maps were hidden on a separate tab, so users could not see spatial context while reviewing video, and the existing markers were unstable once the map became visible.'
            ),
            H.p(
              'Mirage results pair media review with spatial and temporal context: users inspect a video or image result, see where the source was located, and use a timeline to find other moments where relevant detections occurred. When map markers flashed and reclustered after metadata fetches or result changes, users lost the context they had just built.'
            )
          ),
          H.article(
            H.h3('Task'),
            H.p(
              'Make maps a first-class part of the results workflow while supporting mobile camera paths, indoor venue maps, stable clustering, and six different results pages that each managed data differently.'
            )
          ),
          H.article(
            H.h3('Action'),
            H.p(
              'I moved the map below the video player and put the player and map in resizable panels with manual resizing plus preset maximize/minimize controls. Then I stabilized marker memoization by narrowing its inputs to search-scoped datasource locations.'
            ),
            H.ul(
              H.li(
                'Removed selected-result state from the marker selector inputs so selection changes did not invalidate the marker set.'
              ),
              H.li(
                'Stopped feeding every cached datasource from Redux into marker memoization; the map only needed locations from datasources within the search, and stable markers mattered more than rare live location metadata updates.'
              ),
              H.li(
                'Replaced default Leaflet green markers with design-system-aware clustered markers.'
              ),
              H.li(
                'Used pie-style cluster markers so users could see multiple datasource types without expanding a cluster.'
              ),
              H.li(
                'Adapted the implementation across results pages ranging from TypeScript with hooks and React Query to older untyped JavaScript with Redux.'
              )
            )
          ),
          H.article(
            H.h3('Result'),
            H.p(
              'The map became visible, stable, and useful during result review. Users could keep spatial context while moving between results, understand mixed datasource clusters before expanding them, inspect mobile camera paths and detection locations, and use venue maps to reason about indoor camera coverage.'
            )
          )
        ),
        H.div(
          { class: 'comparison-grid' },
          H.article(
            H.h3('Before'),
            H.p(
              'The map was hidden on another tab, markers flashed and reclustered after unrelated metadata changes, and default markers gave little context about datasource types.'
            )
          ),
          H.article(
            H.h3('After'),
            H.p(
              'The map lived beside the review workflow, markers stayed stable across result changes, clusters communicated datasource composition, and users could resize media and map panels for the task at hand.'
            )
          )
        ),
        H.p(
          'Once the map became a first-class part of the results page, it unlocked richer use cases. For mobile camera results, we plotted both the flight path and the specific detection locations associated with results and videos, helping users understand the route the camera took and the area it surveilled.'
        ),
        H.p(
          'We also added venue maps for indoor footage where geolocation alone was not enough. A user could associate a camera with an arbitrary image of a venue map, then see those cameras in search results. For retail loss-prevention workflows, that helped analysts build a report showing a suspect path through a store.'
        )
      )
    )
  )

const libraryScalability = () =>
  H.article(
    { class: 'case-study percipient-case-study', id: 'library-scalability' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Percipient deep dive sketch'),
      H.h2('Refactoring the library for scale and navigation')
    ),
    H.div(
      { class: 'case-study-layout' },
      H.p(
        { class: 'role-meta' },
        'Principal UI Engineer, Tech Lead, URL architecture and scalable library UX'
      ),
      H.div(
        { class: 'case-study-copy' },
        H.p(
          'The original library stored navigation state in Redux: which folder the user was viewing, which video was selected, and where they were in the browsing flow. That made the interface fragile. A refresh dropped the user back at the beginning, browser back and forward did not map cleanly to the work being done, and users could not share a deep link to a folder or video.'
        ),
        H.p(
          'It also slowed development. This was before reliable webpack hot reload, so developers had to click through the same screens repeatedly after every change. Deep linking improved the feedback loop and made bugs easier to reproduce because a broken state could be captured, shared, refreshed, and debugged directly.'
        ),
        H.p(
          'The rewrite moved durable navigation state into the URL. A video or folder became addressable, reload-safe, and compatible with natural browser history, which made the library feel more like a filesystem and less like a single-page app that forgot its place.'
        ),
        H.ul(
          H.li(
            'Kept URLs intentionally minimal: library/video/3 and library/folder/1 instead of library/1/folder/1/video/3.'
          ),
          H.li(
            'Reduced stale-link risk when another user moved a video, because URLs no longer encoded impossible parent-child combinations.'
          ),
          H.li(
            'Added pagination to list endpoints for libraries, folders, folder items, videos, identities, cameras, and similar collections.'
          ),
          H.li(
            'Made load time more consistent by avoiding accidental serialization of every entity in the database.'
          ),
          H.li(
            'Added drag and drop for reorganizing library content and folder permissions for constraining media visibility.'
          ),
          H.li(
            'Added deep search with keywords, data-type filters, and detection-object filters.'
          ),
          H.li(
            'Added bulk edit flows so users could update location or timezone across selected items instead of editing one by one.'
          )
        ),
        H.div(
          { class: 'comparison-grid' },
          H.article(
            H.h3('Before'),
            H.p(
              'Redux held location-like state. Refreshing lost context, deep links were unavailable, list loads could balloon with dataset size, and content organization required too much one-off interaction.'
            )
          ),
          H.article(
            H.h3('After'),
            H.p(
              'The URL represented the current resource. Browser navigation worked naturally, links were shareable, list endpoints were paginated, and users could search, reorganize, permission, and bulk edit at scale.'
            )
          )
        ),
        H.p(
          'The important design choice was deciding what not to put in the URL. Encoding the full hierarchy looked descriptive, but it made links brittle in a collaborative system where objects could move. Encoding only the target resource made the route more durable and let the app resolve current context from the backend.'
        )
      )
    )
  )

const earlierExperience = () =>
  H.section(
    { class: 'experience-summary' },
    H.div(
      { class: 'section-heading' },
      H.p({ class: 'eyebrow' }, 'Background'),
      H.h2('Earlier product engineering')
    ),
    H.div(
      { class: 'timeline' },
      H.article(
        H.h3('Homebot'),
        H.p({ class: 'role-meta' }, 'Software Engineer, 2018-2020'),
        H.p(
          'Built React product features, improved reuse through component-library work, and helped move business logic into more testable boundaries.'
        )
      ),
      H.article(
        H.h3('CA Technologies / Rally Software'),
        H.p({ class: 'role-meta' }, 'Software Engineer, 2014-2018'),
        H.p(
          'Contributed heavily to Mineral-UI, internal tooling, service development workflows, integrations, and front-end adoption across teams.'
        )
      ),
      H.article(
        H.h3('Quantum Retail'),
        H.p({ class: 'role-meta' }, 'Software Engineer, 2011-2014'),
        H.p(
          'Customized enterprise allocation and replenishment software, built Selenium regression coverage, and improved build and source-control workflows.'
        )
      )
    )
  )

module.exports = () =>
  page({
    title: 'Mike Holm | Portfolio',
    content: H.main(
      H.header(
        { class: 'hero' },
        H.nav(
          H.a({ href: '#projects' }, 'Projects'),
          H.a({ href: '#current-work' }, 'Current work'),
          H.a({ href: '#contact' }, 'Contact')
        ),
        H.div(
          { class: 'hero-layout' },
          H.div(
            H.p({ class: 'eyebrow' }, 'Mike Holm'),
            H.h1('Software engineer for durable product interfaces'),
            H.p(
              { class: 'lede' },
              'I build front-end systems, product workflows, and technical foundations that make complex software easier to understand, extend, and trust.'
            )
          ),
          contact()
        )
      ),
      projects(),
      currentWork(),
      resultsMapWorkflow(),
      identityUploadWorkflow(),
      libraryScalability(),
      mineralUi(),
      deepDive(),
      prologConnectFour(),
      earlierExperience(),
      education()
    )
  })
