import { experience } from '../data/resume'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Sticker from './Sticker'

const DOT = {
  coral: 'bg-coral',
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  mustard: 'bg-mustard',
  plum: 'bg-plum',
}

export default function Experience() {
  return (
    <section id="experience" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index="03 — Experience"
          title="Where I pitch in"
          kicker="Committees, clubs and a satellite team — learning by shipping."
          accent="teal"
        />

        <div className="relative">
          {/* hand-drawn spine */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-4 w-0 border-l-4 border-dashed border-ink/30 lg:left-1/2 lg:-translate-x-1/2"
          />

          <ul className="grid gap-12">
            {experience.map((job, i) => {
              const right = i % 2 === 1
              return (
                <li key={job.role} className="relative">
                  {/* timeline node */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-8 left-4 z-20 h-4 w-4 -translate-x-1/2 rotate-45 border-2 border-ink ${
                      DOT[job.accent] ?? DOT.coral
                    } lg:left-1/2`}
                  />

                  <Reveal
                    tilt={right ? 1.5 : -1.5}
                    className={`pl-12 lg:w-1/2 lg:pl-0 ${right ? 'lg:ml-auto lg:pl-14' : 'lg:pr-14 lg:text-right'}`}
                  >
                    <PaperCard torn="md" className="p-6">
                      <Sticker tone="ink" className="-rotate-2 text-[0.7rem] font-bold uppercase">
                        {job.period}
                      </Sticker>
                      <h3 className="mt-4 font-display text-2xl leading-tight tracking-wide uppercase">
                        {job.role}
                      </h3>
                      <p className="font-hand text-2xl text-coral">{job.org}</p>

                      <ul className={`mt-4 grid gap-2 ${right ? '' : 'lg:justify-items-end'}`}>
                        {job.points.map((point) => (
                          <li
                            key={point}
                            className={`flex max-w-md gap-3 text-sm leading-relaxed text-ink-soft ${
                              right ? '' : 'lg:flex-row-reverse lg:text-right'
                            }`}
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-ink" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </PaperCard>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
