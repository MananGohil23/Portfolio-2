import { useEffect, useState } from 'react'

/**
 * Day/night theme. The initial value is read from the `data-theme` attribute
 * that index.html sets before first paint (localStorage → OS preference), so
 * there is no flash. Toggling writes the choice back to localStorage.
 *
 * Returns `[theme, toggle]` where theme is 'day' | 'night'.
 */
const readTheme = () =>
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'night'
    ? 'night'
    : 'day'

export default function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () =>
    setTheme((current) => {
      const next = current === 'night' ? 'day' : 'night'
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* storage blocked — theme still applies for this visit */
      }
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', next === 'night' ? '#1c1916' : '#f3ead6')
      return next
    })

  return [theme, toggle]
}
