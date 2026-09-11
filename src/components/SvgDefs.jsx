/**
 * SVG filter definitions used by the `.torn-*` utilities, plus a small kit of
 * hand-drawn doodles. Rendered once near the root.
 */
export default function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        {/* small tears — stickers, labels */}
        <filter id="torn-sm" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.05" numOctaves="3" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* medium tears — note cards, polaroids */}
        <filter id="torn-md" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="4" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* big ragged tears — hero sheets, section panels */}
        <filter id="torn-lg" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 *  Doodles
 * ------------------------------------------------------------------ */
export function DoodleArrow({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 76C24 40 58 12 108 14"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M92 6l18 8-14 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DoodleStar({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" {...props}>
      <path
        d="M20 2l4 12 13 1-10 8 4 13-11-7-11 7 4-13-10-8 13-1z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleSquiggle({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 220 24" className={className} fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 16C26 2 40 24 64 12S104 0 128 12s40 12 64-4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DoodleSplash({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" {...props}>
      <path
        d="M96 12c22-6 44 8 47 30 4 26-12 40-6 62 5 19 26 26 22 47-5 24-34 34-58 30-26-5-31-28-50-42-18-13-43-17-40-40 3-24 32-27 45-44 12-16 16-38 40-43z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Scribble({ className = '', ...props }) {
  return (
    <svg viewBox="0 0 160 60" className={className} fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 40C30 10 52 52 80 30s50 18 76-12"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M10 52c26-18 48 8 70-8s46 10 72-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
