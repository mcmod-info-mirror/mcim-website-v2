// 由品牌色生成 Material 3 配色，写成 mdui 的 CSS 变量。改了品牌色就重跑：npm run scheme
import { writeFileSync } from 'node:fs'
import { CorePalette, Scheme, blueFromArgb, greenFromArgb, redFromArgb, argbFromHex } from '@material/material-color-utilities'

const SOURCE = '#ab96d9'
const source = argbFromHex(SOURCE)
const palette = CorePalette.of(source)

const schemes = {
  light: {
    ...Scheme.light(source).toJSON(),
    surfaceDim: palette.n1.tone(87),
    surfaceBright: palette.n1.tone(98),
    surfaceContainerLowest: palette.n1.tone(100),
    surfaceContainerLow: palette.n1.tone(96),
    surfaceContainer: palette.n1.tone(94),
    surfaceContainerHigh: palette.n1.tone(92),
    surfaceContainerHighest: palette.n1.tone(90),
  },
  dark: {
    ...Scheme.dark(source).toJSON(),
    surfaceDim: palette.n1.tone(6),
    surfaceBright: palette.n1.tone(24),
    surfaceContainerLowest: palette.n1.tone(4),
    surfaceContainerLow: palette.n1.tone(10),
    surfaceContainer: palette.n1.tone(12),
    surfaceContainerHigh: palette.n1.tone(17),
    surfaceContainerHighest: palette.n1.tone(22),
  },
}
schemes.light.surfaceTintColor = schemes.light.primary
schemes.dark.surfaceTintColor = schemes.dark.primary

const kebab = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
const rgb = argb => `${redFromArgb(argb)}, ${greenFromArgb(argb)}, ${blueFromArgb(argb)}`
const hex = argb => `#${(argb & 0xffffff).toString(16).padStart(6, '0')}`

let css = `// 由 scripts/color-scheme.mjs 从 ${SOURCE} 生成，不要手改\n:root {\n`
for (const theme of ['light', 'dark']) {
  for (const [key, value] of Object.entries(schemes[theme])) {
    css += `  --mdui-color-${kebab(key)}-${theme}: ${rgb(value)}; // ${hex(value)}\n`
  }
}
css += '}\n'
writeFileSync(new URL('../app/assets/css/scheme.scss', import.meta.url), css)
for (const theme of ['light', 'dark']) {
  const s = schemes[theme]
  console.log(theme, 'primary', hex(s.primary), 'secondary', hex(s.secondary), 'tertiary', hex(s.tertiary), 'surface', hex(s.surface), 'on-surface', hex(s.onSurface), 'on-surface-variant', hex(s.onSurfaceVariant), 'outline', hex(s.outline), 'secondary-container', hex(s.secondaryContainer))
}
