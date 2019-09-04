const H = require('jshtml')

const email = value => H.a({ href: `mailto:${value}` }, value)
const link = value => H.a({ href: `https://${value}` }, value)
const printOnly = children => H.li({ class: 'printOnly' }, children)

module.exports = () =>
  H.address(
    H.ul(
      printOnly('3077 Fulton Cir'),
      printOnly('Boulder, CO 80301'),
      printOnly('(973) 615-1592'),
      H.li(email('coldpour@gmail.com')),
      H.li(link('github.com/coldpour'))
    )
  )
