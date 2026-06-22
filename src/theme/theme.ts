import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0f5e68'
        },
        secondary: {
          main: '#8c4b2f'
        },
        background: {
          default: '#f7f5ef',
          paper: '#fffdf8'
        },
        text: {
          primary: '#1f2933',
          secondary: '#43505c'
        },
        divider: '#d7d0c3'
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#7ccbd4'
        },
        secondary: {
          main: '#d69a78'
        },
        background: {
          default: '#101418',
          paper: '#171d22'
        },
        text: {
          primary: '#eef2f5',
          secondary: '#b7c1ca'
        },
        divider: '#33404a'
      }
    }
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h1: {
      fontFamily: 'Georgia, Times, serif',
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 0.95,
      fontSize: 'clamp(3rem, 8vw, 6.6rem)'
    },
    h2: {
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1.1,
      fontSize: 'clamp(1.8rem, 3vw, 2.45rem)'
    },
    h3: {
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: 1.2,
      fontSize: '1.25rem'
    },
    body1: {
      fontFamily: 'Georgia, Times, serif',
      fontSize: '1.08rem',
      lineHeight: 1.62
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.5
    },
    overline: {
      color: 'var(--mui-palette-secondary-main)',
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth'
        },
        body: {
          minWidth: 320
        },
        a: {
          textUnderlineOffset: '0.18em',
          textDecorationThickness: '0.08em'
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid var(--mui-palette-divider)',
          boxShadow: 'none'
        }
      }
    }
  }
})
