import { contact, profile } from '../data/resume'

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden px-4 pt-16 pb-10 sm:px-6">
      <div aria-hidden="true" className="paper torn-flat absolute inset-x-0 bottom-0 top-6" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="font-hand text-4xl text-coral">{profile.name}</p>
        <p className="max-w-md text-sm text-ink-soft">
          Built with React, Vite & Tailwind — collaged with torn paper and too much coffee.
        </p>

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold">
          <li>
            <a href={`mailto:${contact.email}`} className="hover:text-coral">
              Email
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-coral">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-coral">
              GitHub
            </a>
          </li>
          <li>
            <a href="#top" className="hover:text-coral">
              Back to top ↑
            </a>
          </li>
        </ul>

        <p className="font-mono text-[0.7rem] tracking-widest text-ink-soft uppercase">
          © {new Date().getFullYear()} {profile.name} · All scraps reserved
        </p>
      </div>
    </footer>
  )
}
