import Box from '@mui/material/Box'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import { Fragment, type ReactNode } from 'react'

function renderTokens(tokens: Prism.TokenStream): ReactNode {
  if (typeof tokens === 'string') return tokens
  if (Array.isArray(tokens)) {
    return tokens.map((token, index) => <Fragment key={index}>{renderTokens(token)}</Fragment>)
  }
  const aliases = typeof tokens.alias === 'string' ? [tokens.alias] : (tokens.alias ?? [])
  return (
    <span className={['token', tokens.type, ...aliases].join(' ')}>
      {renderTokens(tokens.content)}
    </span>
  )
}

// Tokenize during rendering/building; the browser receives ordinary selectable HTML.
export function CodeBlock({
  children,
  language = 'typescript'
}: {
  children: string
  language?: 'typescript' | 'text'
}) {
  const tokens =
    language === 'text' ? children : Prism.tokenize(children, Prism.languages.typescript)
  return (
    <Box
      component="pre"
      tabIndex={0}
      sx={{
        m: 0,
        p: { xs: 2, md: 3 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        color: 'text.primary',
        overflowX: 'auto',
        typography: 'body2',
        '& code': { fontFamily: 'monospace' },
        '& .token.keyword, & .token.builtin, & .token.operator, & .token.function': {
          color: 'primary.main'
        },
        '& .token.class-name': { color: 'primary.main', fontWeight: 'fontWeightBold' },
        '& .token.string, & .token.number, & .token.boolean': { color: 'secondary.main' },
        '& .token.comment': { color: 'text.secondary', fontStyle: 'italic' },
        '& .token.punctuation': { color: 'text.secondary' }
      }}
    >
      <code className={`language-${language}`}>{renderTokens(tokens)}</code>
    </Box>
  )
}
