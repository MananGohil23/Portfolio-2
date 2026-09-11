import { isPlaceholder } from '../data/resume'

/**
 * Renders `value`, or a dashed "input required" slot when the value is still a
 * TODO placeholder. Used for photos, image frames, links, etc.
 */
export default function Slot({
  value,
  label = 'add your input',
  className = '',
  children,
}) {
  const pending = isPlaceholder(value)

  if (!pending) return children ?? value

  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-dashed border-ink/45 bg-ink/5 px-3 py-1 text-xs font-semibold tracking-wide text-ink/60 ${className}`}
      title="Placeholder — replace this in src/data/resume.js"
    >
      <span aria-hidden="true">✎</span>
      {label}
    </span>
  )
}
