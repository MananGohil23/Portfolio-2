const TONE = {
  paper: { layer: 'bg-paper', text: 'text-ink' },
  ink: { layer: 'bg-ink', text: 'text-paper' },
  coral: { layer: 'bg-coral', text: 'text-paper' },
  mustard: { layer: 'bg-mustard', text: 'text-ink' },
  cobalt: { layer: 'bg-cobalt', text: 'text-paper' },
  teal: { layer: 'bg-teal', text: 'text-paper' },
  plum: { layer: 'bg-plum', text: 'text-paper' },
}

/**
 * A torn-paper label with crisp, un-warped text.
 *
 * The `.torn-*` filters displace pixels, so applying them to an element that
 * contains text smears the glyphs. Like `PaperCard`, this keeps the torn sheet
 * on an absolutely-positioned background layer and the text on top, so only the
 * paper silhouette is torn.
 *
 * The outer element carries the caller's classes (position, rotation, size) and
 * stays `inline-block` so transforms apply; the inner element is the positioning
 * context and holds the padding so the torn layer covers it exactly.
 *
 * Props:
 *  - tone:            'paper' | 'ink' | 'coral' | 'mustard' | 'cobalt' | 'teal' | 'plum'
 *  - className:       classes for the outer label (typography, rotation, position)
 *  - layerClassName:  extra classes for the paper layer (borders, opacity, ...)
 */
export default function Sticker({
  tone = 'paper',
  className = '',
  layerClassName = '',
  as: Tag = 'span',
  children,
  ...rest
}) {
  const t = TONE[tone] ?? TONE.paper

  return (
    <Tag className={`inline-block ${className}`} {...rest}>
      <span
        className={`relative inline-flex items-center gap-1.5 px-[0.7rem] py-[0.28rem] font-semibold leading-tight ${t.text}`}
      >
        <span
          aria-hidden="true"
          className={`paper torn-sm absolute inset-0 ${t.layer} ${layerClassName}`}
        />
        <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      </span>
    </Tag>
  )
}
