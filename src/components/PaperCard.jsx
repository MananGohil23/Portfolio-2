const TORN = {
  sm: 'torn-sm',
  md: 'torn-md',
  lg: 'torn-lg',
  flat: 'torn-flat',
}

/**
 * A sheet of torn paper with crisp, un-distorted content on top.
 *
 * The torn edge effect lives on an absolutely-positioned background layer so
 * the SVG displacement filter never warps the text.
 *
 * Props:
 *  - torn:  'sm' | 'md' | 'lg' | 'flat'
 *  - tone:  'base' | 'soft'
 *  - tilt:  resting rotation in degrees
 *  - tapes: array of { top,left,right,bottom, rotate, width, height }
 */
export default function PaperCard({
  children,
  className = '',
  torn = 'md',
  tone = 'base',
  tilt = 0,
  tapes = [],
  as: Tag = 'div',
  style,
  ...rest
}) {
  return (
    <Tag
      className={`relative ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      {...rest}
    >
      {/* torn sheet of paper */}
      <div
        aria-hidden="true"
        className={`paper ${tone === 'soft' ? 'paper-2' : ''} ${TORN[torn] ?? TORN.md} absolute inset-0`}
      />

      {/* masking tape */}
      {tapes.map((tape, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="tape z-20"
          style={{
            top: tape.top,
            left: tape.left,
            right: tape.right,
            bottom: tape.bottom,
            width: tape.width,
            height: tape.height,
            transform: `rotate(${tape.rotate ?? 0}deg)`,
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </Tag>
  )
}
