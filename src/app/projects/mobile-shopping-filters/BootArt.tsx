import Box from '@mui/material/Box'
import type { Boot } from './catalog'

export function BootArt({ boot, color }: { boot: Boot; color?: string }) {
  const selected = color ?? boot.variants[0].color
  const tall = boot.height === 'Tall'
  const mid = boot.height === 'Mid calf'
  return (
    <Box sx={{ color: selected === 'Brown' ? 'boot.brown' : selected === 'Green' || selected === 'Camo' ? 'boot.green' : 'boot.black', width: '100%' }}>
      <svg viewBox="0 0 240 190" role="img" aria-label={`${selected} ${boot.name} ${boot.height.toLowerCase()} boot`} style={{ display: 'block', width: '100%' }}>
        <ellipse cx="125" cy="168" rx="88" ry="7" fill="currentColor" opacity="0.1" />
        <path d={tall
          ? 'M64 24 L123 24 L119 108 Q133 122 179 128 Q206 131 211 150 L208 160 L45 160 Q39 143 49 122 L60 108 Z'
          : mid
            ? 'M63 49 L126 49 L119 108 Q136 122 179 128 Q206 131 211 150 L208 160 L45 160 Q39 143 49 122 L60 108 Z'
            : 'M61 84 L122 84 L119 110 Q138 124 179 128 Q206 131 211 150 L208 160 L45 160 Q39 143 49 122 L59 110 Z'} fill="currentColor" />
        <path d="M45 148 Q113 159 211 148 L212 160 Q124 178 43 163 Z" fill="var(--mui-palette-boot-sole)" />
        <path d="M54 143 Q108 154 200 143 M64 118 Q84 127 112 119" fill="none" stroke="var(--mui-palette-boot-detail)" strokeWidth="2" opacity="0.4" />
        <path d={tall ? 'M75 34 L110 34 L107 102 Q88 113 70 105 Z' : mid ? 'M75 59 L111 59 L107 104 Q88 113 70 105 Z' : 'M73 90 L110 90 L108 110 Q88 119 70 110 Z'} fill="var(--mui-palette-boot-detail)" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <path d={tall ? 'M66 26 L64 14 L75 14 L76 26' : mid ? 'M65 51 L63 39 L74 39 L75 51' : 'M63 86 L61 74 L72 74 L73 86'} fill="none" stroke="currentColor" strokeWidth="5" />
        {boot.closure === 'Lace-up' ? <path
          d={mid ? 'M81 66 L109 76 M81 76 L109 66 M80 82 L108 92 M80 92 L108 82 M79 98 L107 108 M79 108 L107 98' : 'M80 92 L109 102 M80 102 L109 92 M79 108 L108 118 M79 118 L108 108'}
          fill="none" stroke="var(--mui-palette-boot-detail)" strokeWidth="3" opacity="0.8"
        /> : null}
        {boot.closure === 'Zip-up' ? <>
          <path d="M98 61 L98 113" stroke="var(--mui-palette-boot-detail)" strokeWidth="3" opacity="0.7" />
          <rect x="94" y="63" width="8" height="10" rx="2" fill="var(--mui-palette-boot-detail)" opacity="0.8" />
        </> : null}
        <path d="M52 158 L52 166 M68 160 L68 169 M86 161 L86 170 M151 163 L151 170 M171 161 L171 168 M191 158 L191 165" stroke="var(--mui-palette-boot-sole)" strokeWidth="6" />
        {selected === 'Camo' ? <path d="M72 66 L91 58 L102 73 L87 84 Z M65 111 L87 100 L97 116 L76 129 Z M125 124 L146 134 L134 147 L111 139 Z" fill="var(--mui-palette-boot-detail)" opacity="0.25" /> : null}
      </svg>
    </Box>
  )
}
