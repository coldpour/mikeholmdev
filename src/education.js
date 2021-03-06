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
    start: 'Sept 2003',
    end: 'June 2007',
    description: `
Recieved scholarship for performance in AP CS class. Built multiplayer networked battleship game in Visual Basic. Built class-winning Mario tribute in Macromedia Flash detailing Mario's video game history. For each game system, you could sroll through games, when you selected one, the cartidge would insert into the console and the power light would illuminate. A screen would tell you about the game. There was a dungeon section where Boo would chase your mouse around the screen. The main menu had some flying Koopas and Mario would jump between pipes with your left and right arrow keys. When you landed on a pipe, a title would emerge from the pipe and hover above Mario's head. When you hit the down arrow, Mario would descend into the pipe and take you to that section of the presentation.
`,
    tools: ['Java', 'HTML', 'CSS', 'Visual Basic', 'Windows']
  }
]

module.exports = () =>
  H.section(
    { class: 'education' },
    H.h2('Education'),
    education
      .slice(0, 1)
      .map(school)
      .join('')
  )
