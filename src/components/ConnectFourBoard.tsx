import Box from '@mui/material/Box'

const cells = [
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'empty', 'red', 'empty', 'empty', 'empty'],
  ['empty', 'empty', 'yellow', 'yellow', 'red', 'empty', 'empty'],
  ['empty', 'red', 'yellow', 'red', 'yellow', 'empty', 'empty'],
  ['red', 'yellow', 'red', 'yellow', 'red', 'yellow', 'empty']
] as const

const fillByCell = {
  empty: 'var(--mui-palette-background-paper)',
  red: 'var(--connect-four-red)',
  yellow: 'var(--connect-four-yellow)'
}

export function ConnectFourBoard() {
  return (
    <Box
      aria-label="Static Connect 4 board in mid game"
      component="svg"
      role="img"
      viewBox="0 0 760 660"
      sx={{
        display: 'block',
        width: '100%',
        maxWidth: 760,
        mx: 'auto',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '--connect-four-board': 'var(--mui-palette-primary-main)',
        '--connect-four-shadow': 'var(--mui-palette-primary-dark)',
        '--connect-four-red': 'var(--mui-palette-error-main)',
        '--connect-four-yellow': 'var(--mui-palette-warning-main)',
        '--connect-four-highlight': 'var(--mui-palette-common-white)'
      }}
    >
      <rect fill="var(--connect-four-board)" height="540" rx="28" width="700" x="30" y="80" />
      <rect fill="var(--connect-four-shadow)" height="36" rx="18" width="760" x="0" y="600" />
      {cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const cx = 90 + columnIndex * 96
          const cy = 140 + rowIndex * 78

          return (
            <g key={`${rowIndex}-${columnIndex}`}>
              <circle cx={cx} cy={cy} fill="var(--connect-four-shadow)" r="34" />
              <circle cx={cx} cy={cy - 4} fill={fillByCell[cell]} r="30" />
              {cell !== 'empty' ? (
                <circle
                  cx={cx - 9}
                  cy={cy - 14}
                  fill="var(--connect-four-highlight)"
                  opacity="0.36"
                  r="7"
                />
              ) : null}
            </g>
          )
        })
      )}
    </Box>
  )
}
