const H = require('jshtml')

module.exports = ({
  company,
  location,
  title,
  start,
  end,
  description,
  tools
}) => (
  H.section(
    { class: 'job' },
    H.h3(
      H.span({ class: 'company' }, company),
      H.span({ class: 'title' }, title)
    ),
    H.p({ class: 'location' }, location),
    H.time(
      { class: 'tenure' },
      H.span({ class: 'start' }, start),
      H.span({ class: 'end' }, end)
    ),
    H.p({ class: 'tools' }, tools.join(', ')),
    H.p({ class: 'description' }, description)
  )
)
