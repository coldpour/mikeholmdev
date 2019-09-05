const H = require('jshtml')

module.exports = ({ title, content }) => `
<!DOCTYPE html>
  ${H.html(
    { lang: 'en' },
    H.head(
      H.meta({
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=no'
      }),
      H.meta({ charset: 'utf-8' }),
      H.title(title),
      H.link({ rel: 'stylesheet', href: 'index.css' })
    ),
    H.body(content)
  )}
`
