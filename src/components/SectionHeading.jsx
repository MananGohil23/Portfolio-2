import Reveal from './Reveal'

/**
 * Big hand-collaged section title with an index tag and a scribbled accent.
 */
export default function SectionHeading({ index, title, kicker, accent = 'coral', align = 'left' }) {
  const bar = {
    coral: 'bg-coral',
    mustard: 'bg-mustard',
    cobalt: 'bg-cobalt',
    teal: 'bg-teal',
    plum: 'bg-plum',
  }[accent]

  return (
    <Reveal className={`relative mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`h-3 w-12 ${bar}`} style={{ clipPath: 'polygon(0 30%,100% 0,98% 100%,2% 80%)' }} />
        {index && (
          <span className="font-mono text-xs font-bold tracking-[0.3em] text-ink-soft uppercase">
            {index}
          </span>
        )}
      </div>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.9] tracking-tight uppercase">
        {title}
      </h2>
      {kicker && (
        <p className={`mt-3 max-w-2xl font-hand text-2xl text-ink-soft ${align === 'center' ? 'mx-auto' : ''}`}>
          {kicker}
        </p>
      )}
    </Reveal>
  )
}
