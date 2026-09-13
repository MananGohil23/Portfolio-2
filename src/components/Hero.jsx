import { isPlaceholder, profile, stats } from '../data/resume'
import PaperCard from './PaperCard'
import Reveal from './Reveal'
import Slot from './Slot'
import Sticker from './Sticker'
import { DoodleArrow, DoodleSplash, DoodleStar, Scribble } from './SvgDefs'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
      {/* abstract background doodles */}
      <DoodleSplash className="animate-drift pointer-events-none absolute -top-24 -left-24 w-80 text-mustard/25 sm:w-[26rem]" />
      <DoodleSplash className="animate-drift pointer-events-none absolute -right-28 bottom-0 w-72 text-cobalt/15 [animation-delay:2s] sm:w-96" />
      <DoodleStar className="animate-floaty pointer-events-none absolute top-28 right-[18%] w-8 text-coral sm:w-12" />
      <DoodleStar className="animate-wiggle pointer-events-none absolute bottom-40 left-[8%] w-6 text-teal" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---------------- copy ---------------- */}
        <div className="relative">
          <Reveal tilt={-1}>
            <Sticker tone="mustard" className="-rotate-2 text-xs font-bold tracking-[0.2em] uppercase">
              ● {profile.available}
            </Sticker>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-6 font-hand text-2xl text-ink-soft sm:text-3xl">
              Hey, I&apos;m
            </p>
            <h1 className="mt-1 font-display text-[clamp(3.4rem,13vw,9.5rem)] leading-[0.82] tracking-tight uppercase">
              <span className="block">{profile.firstName}</span>
              <span className="relative block">
                <span className="text-coral">{profile.lastName}</span>
                <Scribble className="absolute -bottom-2 left-0 w-[min(15rem,60%)] text-ink/70" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">{profile.role}</span> based in {profile.location}.
              I build <span className="ink-underline font-semibold text-ink">AI, data and web</span>{' '}
              projects that solve real problems — {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="stamp bg-ink px-6 py-3 text-sm font-bold tracking-widest text-paper uppercase transition-transform hover:-translate-y-1"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="stamp bg-paper px-6 py-3 text-sm font-bold tracking-widest uppercase transition-transform hover:-translate-y-1"
            >
              Get in touch
            </a>
            <span className="relative">
              <DoodleArrow className="absolute -top-10 -right-4 hidden w-16 rotate-[15deg] text-coral lg:block" />
            </span>
          </Reveal>

          <Reveal delay={320} className="mt-10 flex flex-wrap gap-3">
            {stats.map((s, i) => (
              <Sticker
                key={s.label}
                tone="paper"
                className="text-sm"
                style={{ transform: `rotate(${i % 2 === 0 ? -3 : 2}deg)` }}
              >
                <b className="font-display text-lg">{s.value}</b>
                <span className="text-xs tracking-wide text-ink-soft uppercase">{s.label}</span>
              </Sticker>
            ))}
          </Reveal>
        </div>

        {/* ---------------- portrait ---------------- */}
        <Reveal delay={200} tilt={3} className="relative mx-auto w-full max-w-sm">
          <PaperCard
            torn="lg"
            tilt={3}
            tapes={[{ top: '-1rem', left: '50%', rotate: -4, width: '9rem', height: '2rem' }]}
            className="p-4 pb-20"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-3 stitch-border">
              {isPlaceholder(profile.photo) ? (
                <Slot
                  value={profile.photo}
                  label="drop your photo here"
                  className="absolute inset-0 h-full w-full justify-center text-base"
                />
              ) : (
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              )}
            </div>
            <p className="mt-4 text-center font-hand text-3xl">
              {profile.name}
              <span className="block text-base text-ink-soft">{profile.location}</span>
            </p>
          </PaperCard>

          <Sticker tone="teal" className="animate-wiggle absolute -right-3 -bottom-4 -rotate-6 text-xs font-bold uppercase">
            CSE · Data Science
          </Sticker>
        </Reveal>
      </div>
    </section>
  )
}
