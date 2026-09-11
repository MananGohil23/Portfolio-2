/**
 * Full-bleed torn-paper band that scrolls a row of words forever.
 */
export default function Marquee({ items, className = '', tilt = -1.5, tone = 'ink' }) {
  const row = [...items, ...items]
  const bg = tone === 'ink' ? 'var(--color-ink)' : 'var(--color-coral)'
  const fg = tone === 'ink' ? 'var(--color-paper)' : 'var(--color-ink)'

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ overflowX: 'clip', overflowY: 'visible' }}
    >
      {/* overhang so the tilt never reveals gaps at the edges */}
      <div
        className="relative -mx-[6%] w-[112%] origin-center"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div
          aria-hidden="true"
          className="torn-sm grain absolute inset-0"
          style={{ backgroundColor: bg }}
        />
        <div className="relative z-10 overflow-hidden py-4">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap pr-10">
            {row.map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                <span
                  className="font-display text-2xl tracking-[0.12em] uppercase sm:text-3xl"
                  style={{ color: fg }}
                >
                  {item}
                </span>
                <span aria-hidden="true" className="text-xl" style={{ color: 'var(--color-mustard)' }}>
                  ✶
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
