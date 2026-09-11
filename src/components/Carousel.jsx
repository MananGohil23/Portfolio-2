import { useEffect, useRef, useState } from 'react'

const DOT = {
  mustard: 'bg-mustard',
  coral: 'bg-coral',
  cobalt: 'bg-cobalt',
  teal: 'bg-teal',
  plum: 'bg-plum',
}

/**
 * Torn-paper collage carousel.
 *
 * Props:
 *  - images:  array of image sources
 *  - alt:     base alt text (index is appended)
 *  - accent:  accent colour key for the active dot
 *  - autoplay / interval: auto-advance, paused on hover & focus
 */
export default function Carousel({ images, alt = 'Project screenshot', accent = 'coral', autoplay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const dragX = useRef(null)
  const count = images.length

  const goTo = (next) => setIndex(((next % count) + count) % count)
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    if (!autoplay || count < 2 || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval)
    return () => clearInterval(id)
  }, [autoplay, count, paused, interval])

  const onPointerDown = (e) => {
    dragX.current = e.clientX
    setPaused(true)
  }

  const onPointerUp = (e) => {
    if (dragX.current !== null) {
      const dx = e.clientX - dragX.current
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    }
    dragX.current = null
    setPaused(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  const multiple = count > 1

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="group relative h-full w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
    >
      {/* sliding track */}
      <div
        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="h-full min-w-full">
            <img
              src={src}
              alt={`${alt} — ${i + 1} of ${count}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* counter */}
      <span className="sticker torn-flat absolute top-3 right-3 bg-paper/90 text-[0.7rem] font-bold tracking-widest">
        {index + 1} / {count}
      </span>

      {multiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="stamp absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center bg-paper/90 pb-0.5 font-display text-lg transition-transform hover:-translate-y-1/2 hover:scale-110"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="stamp absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center bg-paper/90 pb-0.5 font-display text-lg transition-transform hover:-translate-y-1/2 hover:scale-110"
          >
            ›
          </button>

          {/* dots */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-3 w-3 rotate-45 border-2 border-ink transition-transform hover:scale-125 ${
                  i === index ? DOT[accent] ?? DOT.coral : 'bg-paper/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
