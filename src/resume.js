const H = require('jshtml')
const page = require('./page')
const experience = require('./experience')

module.exports = () => (
  page({
    title: 'Mike Holm | Developer',
    content: (
      H.main(
        H.header(
          H.h1('Mike Holm'),
          H.p('Developer committed to craftsmanship')
        ),
        experience()
      )
    )
  })
)
