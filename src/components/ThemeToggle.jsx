import useTheme from './useTheme'

function Sun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Moon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThemeToggle({ className = '' }) {
  const [theme, toggle] = useTheme()
  const night = theme === 'night'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={night ? 'Switch to day mode' : 'Switch to night mode'}
      aria-pressed={night}
      title={night ? 'Day mode' : 'Night mode'}
      className={`stamp grid h-10 w-10 place-items-center bg-paper transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {night ? <Sun className="h-5 w-5 text-mustard" /> : <Moon className="h-5 w-5 text-cobalt" />}
    </button>
  )
}
