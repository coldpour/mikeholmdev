const H = require('jshtml')
const job = require('./job')

const jobs = [{
  company: 'Homebot',
  location: 'Denver, CO',
  title: 'Software Engineer',
  start: 'August 2018',
  end: 'Present',
  description: `
Unlocked code reuse and increased consistency throughout the React app by constructing an independently testable design system and component library focused on a11y and mobile. Led cross-functional team of 4 to deliver features across the stack. Increased test coverage and robustness by moving business logic into selectors and test data into factories. Broke down features into valuable yet actionable chunks of work that could be done by everyone on the team. Led organization-wide agile process transformation, set up ceremonies, working agreements, lunch and learns. Led several lunch and learns on a11y, reusable components, CSS techniques and pitfalls.
`,
  tools: [
    'React',
    'Redux',
    'Reselect',
    'SVG',
    'SCSS',
    'HTML',
    'Javascript',
    'Ruby on Rails'
  ]
}, {
  company: 'CA Technologies (Formerly Rally Software)',
  location: 'Boulder, CO',
  title: 'Software Engineer',
  start: 'July 2014',
  end: 'July 2018',
  description: `
Major contributor to ${H.a({ href: 'https://mineral-ui.com' }, 'Mineral-UI')}, a web UI component library for the company design system built in React. Increased library performance and composability by optimizing render cycles, spreading props on the root component, and composing event handlers. Drove adoption through dev advocacy work, networking with other fornt-end devs and teams around the company and helping them successfully implement Mineral.
${H.br() + H.br()}
Led a team of developers to build a polyglot service development harness with Openshift, Go, Python, Haskell, Rails, and NodeJS. Led another team to develop an email-driven task management and sharing app in Typescript. Built a model code generation pipeline to keep web and mobile devs in sync across geographies.
${H.br() + H.br()}
Upgraded 2-way integration of Rally and Flowdock by implementing webhooks in the Flowdock Rails backend. Increased engineering productivity and eased tensions by creating tooling around the shared Jenkins build pipeline.
`,
  tools: [
    'React',
    'Typescript',
    'Flow',
    'Go',
    'NodeJS',
    'Grunt',
    'Gulp',
    'Ruby on Rails',
    'ExtJS'
  ]
}, {
  company: 'Quantum Retail',
  location: 'Minneapolis, MN',
  title: 'Software Engineer',
  start: 'June 2011',
  end: 'June 2014',
  description: `
Delighted customers by customizing our allocation and replinishment software to their specific needs. Reduced regressions in JSP web app by building a Selenium Webdriver test suite. Optimized maintainability of the regression suite by implementing the Page Object paradigm and behavior-driven-design. Decreased developer cycle time by optimizing Gradle and Maven build scripts. Led migration from SVN to Git.
`,
  tools: [
    'Java',
    'Java Server Pages',
    'Spring',
    'Hibernate',
    'Gradle',
    'Groovy',
    'Maven',
    'Selenium Webdriver',
    'Oracle SQL'
  ]
}]

module.exports = () => (
  H.section(
    { class: 'experience' },
    H.h2('Experience'),
    jobs.map(job).join('')
  )
)
