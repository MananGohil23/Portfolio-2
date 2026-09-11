import { projects, TODO } from '../data/resume'
import Carousel from './Carousel'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Slot from './Slot'
import { DoodleArrow } from './SvgDefs'

const ACCENT = {
  mustard: { chip: 'bg-mustard', text: 'text-mustard', border: 'border-mustard' },
  coral: { chip: 'bg-coral', text: 'text-coral', border: 'border-coral' },
  cobalt: { chip: 'bg-cobalt', text: 'text-cobalt', border: 'border-cobalt' },
  teal: { chip: 'bg-teal', text: 'text-teal', border: 'border-teal' },
  plum: { chip: 'bg-plum', text: 'text-plum', border: 'border-plum' },
}

function ProjectCard({ project, index }) {
  const accent = ACCENT[project.accent] ?? ACCENT.coral
  const flip = index % 2 === 1
  const images = Array.isArray(project.images)
    ? project.images.filter((src) => typeof src === 'string' && !src.startsWith(TODO))
    : []

  return (
    <Reveal tilt={flip ? -1.5 : 1.5} className="relative">
      <PaperCard
        torn="lg"
        tilt={flip ? -1.2 : 1.2}
        tapes={[
          { top: '-0.9rem', left: flip ? 'auto' : '1.5rem', right: flip ? '1.5rem' : 'auto', rotate: flip ? 5 : -5 },
        ]}
        className="overflow-hidden p-4 sm:p-6"
      >
        {/* image frame */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-4 border-paper-3 bg-paper-3">
          {images.length > 0 ? (
            <Carousel
              images={images}
              alt={`${project.title} — ${project.subtitle}`}
              accent={project.accent}
            />
          ) : (
            <Slot
              value={TODO}
              label="add project screenshots"
              className="absolute inset-0 h-full w-full justify-center text-base"
            />
          )}
          <span
            className={`sticker torn-flat absolute top-3 left-3 -rotate-3 ${accent.chip} text-[0.7rem] font-bold tracking-wide uppercase`}
          >
            {project.context}
          </span>
          <span className="sticker torn-flat absolute bottom-3 left-3 -rotate-2 bg-paper text-[0.7rem] font-bold uppercase">
            {project.year}
          </span>
        </div>

        {/* body */}
        <div className="px-1 pt-6 sm:px-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-3xl tracking-wide uppercase sm:text-4xl">
              {project.title}
            </h3>
            <span className={`font-hand text-2xl ${accent.text}`}>{project.subtitle}</span>
          </div>

          <ul className="mt-5 grid gap-2.5">
            {project.points.map((point) => (
              <li key={point} className="flex gap-3 text-[0.97rem] leading-relaxed text-ink-soft">
                <span className={`mt-2 h-2 w-2 shrink-0 rotate-45 ${accent.chip}`} />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="sticker torn-flat border border-ink/15 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-dashed border-ink/25 pt-5">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="stamp bg-ink px-4 py-2 text-xs font-bold tracking-widest text-paper uppercase transition-transform hover:-translate-y-0.5"
              >
                Live site ↗
              </a>
            )}

            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="font-semibold tracking-wide text-ink underline decoration-2 underline-offset-4 hover:text-coral"
              >
                View code ↗
              </a>
            )}
          </div>
        </div>
      </PaperCard>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02 — Work"
          title="Selected projects"
          kicker="Things I built, broke, and rebuilt until they worked."
          accent="coral"
        />

        <div className="relative grid gap-16 lg:gap-24">
          <DoodleArrow className="pointer-events-none absolute -top-6 right-2 hidden w-24 rotate-[35deg] text-ink/50 lg:block" />
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
