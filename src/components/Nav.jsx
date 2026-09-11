import { useEffect, useState } from 'react'
import { nav, profile } from '../data/resume'
import Slot from './Slot'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const resumeReady = profile.resumeFile !== 'TODO'

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`paper torn-flat absolute inset-x-0 top-0 h-[86px] transition-opacity duration-300 ${
          scrolled || open ? 'opacity-100' : 'opacity-90'
        }`}
      />

      <nav
        className={`relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 ${
          scrolled ? 'shadow-[0_10px_24px_rgba(27,26,23,0.14)]' : ''
        }`}
      >
        <a href="#top" className="group flex items-center gap-3">
          <span className="stamp torn-flat grid h-11 w-11 place-items-center bg-coral font-display text-lg text-paper transition-transform group-hover:-rotate-6">
            {profile.initials}
          </span>
          <span className="hidden font-display text-xl tracking-wide uppercase sm:block">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="relative rounded px-3 py-2 text-sm font-semibold tracking-wide transition-colors hover:text-coral"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {resumeReady ? (
            <a
              href={profile.resumeFile}
              download
              className="stamp hidden bg-ink px-4 py-2 text-xs font-bold tracking-widest text-paper uppercase transition-transform hover:-translate-y-0.5 sm:inline-block"
            >
              Résumé
            </a>
          ) : (
            <Slot value={profile.resumeFile} label="resume.pdf" className="hidden sm:inline-flex" />
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="stamp grid h-10 w-10 place-items-center bg-paper md:hidden"
          >
            <span className="text-lg leading-none">{open ? '✕' : '≡'}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="relative z-10 mx-4 md:hidden">
          <div className="paper torn-md grain relative p-4">
            <ul className="grid gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink/10 px-2 py-3 font-display text-lg tracking-wide uppercase last:border-0"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
