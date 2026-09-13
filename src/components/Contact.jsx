import { contact, profile } from '../data/resume'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Slot from './Slot'
import Sticker from './Sticker'
import { DoodleArrow, DoodleStar } from './SvgDefs'

export default function Contact() {
  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          index="05 — Contact"
          title="Let’s build something"
          kicker="Have an idea, an internship, or just want to say hi?"
          accent="coral"
          align="center"
        />

        <Reveal tilt={-1}>
          <PaperCard
            torn="lg"
            className="relative px-6 py-12 text-center sm:px-12"
            tapes={[
              { top: '-1rem', left: '1.5rem', rotate: -6 },
              { top: '-1rem', right: '1.5rem', rotate: 6 },
            ]}
          >
            <DoodleStar className="absolute top-6 left-6 w-7 rotate-12 text-mustard" />
            <DoodleArrow className="absolute right-8 bottom-8 hidden w-20 rotate-[-20deg] text-coral sm:block" />

            <p className="font-hand text-3xl text-ink-soft">Currently {profile.available.toLowerCase()} ✦</p>
            <h3 className="mt-3 font-display text-[clamp(2rem,6vw,4rem)] leading-none tracking-tight uppercase">
              Say hello
            </h3>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                className="stamp bg-coral px-6 py-3 text-sm font-bold tracking-widest text-paper uppercase transition-transform hover:-translate-y-1"
              >
                Email me ↗
              </a>
              <a
                href={contact.phoneHref}
                className="stamp bg-paper px-6 py-3 text-sm font-bold tracking-widest uppercase transition-transform hover:-translate-y-1"
              >
                {contact.phone}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Sticker
                as="a"
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                tone="cobalt"
                className="-rotate-2 text-sm font-bold"
              >
                in · {contact.linkedinLabel}
              </Sticker>
              <Sticker
                as="a"
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                tone="ink"
                className="rotate-1 text-sm font-bold"
              >
                ⌂ {contact.githubLabel}
              </Sticker>
              {contact.twitter === 'TODO' ? (
                <Slot value={contact.twitter} label="add X / twitter" />
              ) : (
                <Sticker
                  as="a"
                  href={contact.twitter}
                  target="_blank"
                  rel="noreferrer"
                  tone="plum"
                  className="-rotate-1 text-sm font-bold"
                >
                  ✕ {contact.twitterLabel}
                </Sticker>
              )}
            </div>

            <p className="mt-10 font-mono text-xs tracking-widest text-ink-soft uppercase">
              {contact.email}
            </p>
          </PaperCard>
        </Reveal>
      </div>
    </section>
  )
}
