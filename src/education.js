const H = require('jshtml')
const school = require('./school')

const education = [
  {
    school: 'St. Olaf College',
    location: 'Northfield, MN',
    degree: 'BA Computer Science',
    gpa: '3.75',
    start: 'Sept 2007',
    end: 'June 2011',
    description: `
Built several AI for competing against in Connect4 in Prolog. Built a map-reduce pipeline to create rhyming poetry from the combined works of Shakespear, Milton, and Spenser using several rhyme schemes in Java Hadoop. Built Mario tribute animation in Scheme compiled to SVG. Built a guitar and drum tablature editor and player in C++.
`,
    tools: [
      'C++',
      'Java',
      'Hadoop',
      'SVG',
      'Scheme',
      'Prolog',
      'Bash',
      'Fedora',
      'Ubuntu'
    ]
  },
  {
    school: 'Madison High School',
    location: 'Madison, NJ',
    gpa: '3.75',
    start: 'Sept 2007',
    end: 'June 2011',
    description: `
Recieved scholarship for performance in AP CS class. Built multiplayer networked battleship game in Visual Basic.
`,
    tools: ['Java', 'HTML', 'CSS', 'Visual Basic', 'Windows']
  }
]

module.exports = () =>
  H.section(
    { class: 'education' },
    H.h2('Education'),
    education.map(school).join('')
  )
