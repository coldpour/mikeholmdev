const H = require('jshtml')

module.exports = ({
  school,
  location,
  degree,
  start,
  end,
  description,
  tools
}) =>
  H.section(
    { class: 'school' },
    H.h3(
      H.span({ class: 'school' }, school),
      degree && H.span({ class: 'degree' }, degree)
    ),
    H.time(
      { class: 'tenure' },
      H.span({ class: 'start' }, start),
      H.span({ class: 'end' }, end)
    ),
    H.p({ class: 'tools' }, tools.join(', ')),
    H.p({ class: 'description' }, description)
  )
