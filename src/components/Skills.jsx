import { skillGroups } from '../data/resume'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { DoodleSquiggle } from './SvgDefs'

const ACCENT = {
  coral: 'bg-coral',
  mustard: 'bg-mustard',
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  plum: 'bg-plum',
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04 — Toolbox"
          title="Skills & tools"
          kicker="The stack I reach for when an idea needs building."
          accent="plum"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 80} tilt={i % 2 === 0 ? -1 : 1}>
              <PaperCard torn="md" className="h-full p-6">
                <div className="flex items-center gap-3">
                  <span className={`h-8 w-1.5 ${ACCENT[group.accent] ?? ACCENT.coral}`} />
                  <h3 className="font-display text-xl tracking-wide uppercase">{group.label}</h3>
                </div>
                <DoodleSquiggle className="mt-2 w-24 text-ink/30" />
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="sticker torn-flat border border-ink/15 text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </PaperCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
