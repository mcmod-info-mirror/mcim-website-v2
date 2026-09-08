export type ThemePreference = 'system' | 'light' | 'dark'

const KEY = 'mcim_theme'
const CLASSES: Record<ThemePreference, string> = {
  system: 'mdui-theme-auto',
  light: 'mdui-theme-light',
  dark: 'mdui-theme-dark',
}

export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')
  const systemDark = useState<boolean>('theme-system-dark', () => false)

  const effective = computed<'light' | 'dark'>(() =>
    preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value,
  )

  function apply(p: ThemePreference) {
    const html = document.documentElement
    html.classList.remove(...Object.values(CLASSES))
    html.classList.add(CLASSES[p])
  }

  function setPreference(p: ThemePreference) {
    preference.value = p
    localStorage.setItem(KEY, p)
    apply(p)
  }

  onMounted(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') preference.value = stored
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    mq.addEventListener('change', (e) => {
      systemDark.value = e.matches
    })
  })

  return { preference, effective, setPreference }
}
