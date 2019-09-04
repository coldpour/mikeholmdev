const H = require('jshtml')
const page = require('./page')
const experience = require('./experience')
const education = require('./education')
const contact = require('./contact')

module.exports = () =>
  page({
    title: 'Mike Holm | Developer',
    content: H.main(
      H.header(
        H.div(H.h1('Mike Holm'), H.p('Developer committed to craftsmanship')),
        contact()
      ),
      experience(),
      education()
    )
  })
