import { education, profile } from '../data/resume'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { DoodleStar } from './SvgDefs'

export default function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="01 — About"
          title="The short story"
          kicker="A curious builder who likes problems with real-world stakes."
          accent="cobalt"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <Reveal tilt={-0.5}>
            <PaperCard torn="lg" className="p-7 sm:p-10">
              <DoodleStar className="absolute -top-4 -left-3 w-9 rotate-12 text-mustard" />
              <div className="relative z-10 space-y-5 text-lg leading-relaxed text-ink-soft">
                {profile.bio.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="sticker torn-flat -rotate-2 bg-coral text-xs font-bold text-paper uppercase">
                  📍 {profile.location}
                </span>
                <span className="sticker torn-flat rotate-1 bg-cobalt text-xs font-bold text-paper uppercase">
                  🎓 Class of 2029
                </span>
                <span className="sticker torn-flat -rotate-1 bg-teal text-xs font-bold text-paper uppercase">
                  ✦ {profile.available}
                </span>
              </div>
            </PaperCard>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={120}>
              <h3 className="font-hand text-3xl text-ink">Education</h3>
            </Reveal>
            {education.map((edu, i) => (
              <Reveal key={edu.degree} delay={140 + i * 90} tilt={i % 2 === 0 ? 1 : -1}>
                <PaperCard torn="md" tone="soft" className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-display text-xl tracking-wide uppercase">{edu.degree}</h4>
                      <p className="mt-1 font-semibold text-ink-soft">{edu.school}</p>
                    </div>
                    <span className="sticker torn-flat shrink-0 bg-ink text-[0.7rem] font-bold text-paper uppercase">
                      {edu.period}
                    </span>
                  </div>
                  <p className="mt-3 border-t border-dashed border-ink/25 pt-3 font-mono text-sm text-ink-soft">
                    {edu.detail}
                  </p>
                </PaperCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
