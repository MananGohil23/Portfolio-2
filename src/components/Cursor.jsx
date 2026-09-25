import { useEffect, useRef, useState } from 'react'

const TEXT = 'input, textarea, select, [contenteditable="true"]'

// trail shape
const TRAIL_LIFE = 850 // ms a point stays in the tail
const MIN_POINTS = 6 // always-visible stub, even while idle
const MAX_POINTS = 220 // hard cap so a fast fling can't build a huge path
const SMUDGE_LIFE = 1100 // ms a click smudge lives

// appearance lives in CSS so it can flip with the day/night theme:
//   --cursor-graphite  "r, g, b" for canvas rgba()
//   --cursor-trail     deposit-strength multiplier (light paper needs more)
const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim()

const readTrailStyle = (root) => ({
  graphite: cssVar(root, '--cursor-graphite') || '74, 70, 61',
  strength: Number.parseFloat(cssVar(root, '--cursor-trail')) || 1,
})

const isEnabled = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Pencil cursor that leaves a graphite trail.
 *
 * The trail is redrawn from scratch every frame (clearRect + a bounded, aged
 * point list) rather than faded with `destination-out`. That avoids the
 * canvas residue trap — a low-alpha erase leaves pixels stuck at 1/255 that
 * accumulate into a permanent scribble (very obvious as light-on-dark).
 *
 * Each point is pushed once per frame; points older than TRAIL_LIFE are
 * dropped, but the newest MIN_POINTS always remain, so a short tail is always
 * visible. Segments taper and scale by the theme's `--cursor-trail` strength.
 * Disabled on touch and for `prefers-reduced-motion`; the native I-beam is
 * kept over editable fields.
 */
export default function Cursor() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const textModeRef = useRef(false)
  const visibleRef = useRef(false)

  const [enabled] = useState(isEnabled)
  const [visible, setVisible] = useState(false)
  const [textMode, setTextMode] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const canvas = canvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null

    const size = () => {
      if (!canvas || !ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    let { graphite, strength } = readTrailStyle(root)
    const themeObserver = new MutationObserver(() => {
      ;({ graphite, strength } = readTrailStyle(root))
    })
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const points = []
    const smudges = []
    let frame = 0
    let paused = false

    // a hand-sketched stroke: wide soft smear + three thin offset passes
    const drawSegment = (from, to, taper) => {
      const dist = Math.hypot(to.x - from.x, to.y - from.y)
      if (dist < 0.01) return
      const width = Math.max(0.5, 2 - dist * 0.05)
      const nx = -(to.y - from.y) / dist
      const ny = (to.x - from.x) / dist
      const passes = [
        { off: 0, alpha: 0.05, width: width * 3.2 },
        { off: -1, alpha: 0.2, width: width * 0.7 },
        { off: 0, alpha: 0.5, width },
        { off: 1, alpha: 0.2, width: width * 0.7 },
      ]
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const pass of passes) {
        const alpha = Math.min(1, pass.alpha * taper * strength)
        if (alpha <= 0) continue
        ctx.strokeStyle = `rgba(${graphite}, ${alpha})`
        ctx.lineWidth = pass.width
        ctx.beginPath()
        ctx.moveTo(from.x + nx * pass.off, from.y + ny * pass.off)
        ctx.lineTo(to.x + nx * pass.off, to.y + ny * pass.off)
        ctx.stroke()
      }
    }

    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (paused) return

      const now = performance.now()

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      }

      if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

        if (visibleRef.current && !textModeRef.current) {
          const head = points[points.length - 1]
          if (!head || head.x !== pointer.x || head.y !== pointer.y) {
            points.push({ x: pointer.x, y: pointer.y, t: now })
          }
        }

        // age out old points, but never below the always-visible stub
        while (points.length > MIN_POINTS && now - points[0].t > TRAIL_LIFE) points.shift()
        if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS)

        // draw the tail newest → oldest so fresh graphite sits on top
        for (let i = points.length - 1; i > 0; i -= 1) {
          const taper = 0.18 + 0.82 * (i / (points.length - 1))
          drawSegment(points[i - 1], points[i], taper)
        }

        // click smudges
        for (let i = smudges.length - 1; i >= 0; i -= 1) {
          const smudge = smudges[i]
          const life = 1 - (now - smudge.t) / SMUDGE_LIFE
          if (life <= 0) {
            smudges.splice(i, 1)
            continue
          }
          ctx.fillStyle = `rgba(${graphite}, ${0.32 * life * strength})`
          for (const dot of smudge.dots) {
            ctx.beginPath()
            ctx.arc(smudge.x + Math.cos(dot.a) * dot.r, smudge.y + Math.sin(dot.a) * dot.r, dot.size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }
    frame = requestAnimationFrame(tick)

    const onMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
        points.length = 0 // don't draw a line from wherever we last were
      }
      const el = event.target instanceof Element ? event.target : null
      const nextText = Boolean(el?.closest(TEXT))
      if (nextText !== textModeRef.current) {
        textModeRef.current = nextText
        setTextMode(nextText)
      }
    }

    const onDown = (event) => {
      setPressed(true)
      if (!visibleRef.current || textModeRef.current) return
      smudges.push({
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
        dots: Array.from({ length: 7 }, () => ({
          a: Math.random() * Math.PI * 2,
          r: Math.random() * 3.4,
          size: 1 + Math.random() * 0.9,
        })),
      })
    }

    const onUp = () => setPressed(false)
    const onLeave = () => {
      visibleRef.current = false
      setVisible(false)
    }
    const onEnter = () => {
      visibleRef.current = true
      setVisible(true)
      points.length = 0
    }
    const onVisibility = () => {
      paused = document.hidden
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', size)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      themeObserver.disconnect()
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', size)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled])

  if (!enabled) return null

  const shown = visible && !textMode

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* the pencil — tip sits exactly on the pointer at (10, 42) */}
      <div ref={wrapRef} className="absolute top-0 left-0 z-10 will-change-transform">
        <svg
          viewBox="0 0 20 44"
          width="20"
          height="44"
          style={{ marginLeft: -10, marginTop: -42 }}
          className={`text-ink origin-[10px_42px] rotate-[35deg] drop-shadow-[1px_3px_2px_rgba(27,26,23,0.35)] transition-[scale,opacity] duration-150 ease-out ${
            pressed ? 'scale-[0.88]' : 'scale-100'
          } ${shown ? 'opacity-100' : 'opacity-0'}`}
        >
          <defs>
            <linearGradient id="pc-wood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b9802f" />
              <stop offset="0.28" stopColor="#eebd68" />
              <stop offset="0.55" stopColor="#e3b261" />
              <stop offset="1" stopColor="#a9711f" />
            </linearGradient>
            <linearGradient id="pc-metal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8d867c" />
              <stop offset="0.35" stopColor="#e2dbcb" />
              <stop offset="0.7" stopColor="#a9a296" />
              <stop offset="1" stopColor="#7f786e" />
            </linearGradient>
            <linearGradient id="pc-eraser" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#c8411c" />
              <stop offset="0.4" stopColor="#f0774f" />
              <stop offset="1" stopColor="#bc3d1a" />
            </linearGradient>
            <linearGradient id="pc-graphite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5a554c" />
              <stop offset="0.55" stopColor="#3a3733" />
              <stop offset="1" stopColor="#26241f" />
            </linearGradient>
          </defs>

          {/* eraser */}
          <path
            d="M8.5 1h3A2.5 2.5 0 0 1 14 3.5V5.5H6V3.5A2.5 2.5 0 0 1 8.5 1Z"
            fill="url(#pc-eraser)"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M7.4 3.4A2.1 2.1 0 0 1 9 1.6"
            fill="none"
            stroke="#f6a98d"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* metal ferrule */}
          <path d="M6 5.5h8v4H6z" fill="url(#pc-metal)" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <path d="M6 6.7h8M6 8.3h8" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

          {/* wooden shaft with hex facets */}
          <path d="M6 9.5h8v23H6z" fill="url(#pc-wood)" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <path d="M6 9.5h2.2v23H6z" fill="currentColor" opacity="0.14" />
          <path d="M12 9.5h2v23h-2z" fill="currentColor" opacity="0.1" />
          <path d="M8.6 10.4v21.4" stroke="#fff3d6" strokeWidth="0.7" strokeLinecap="round" opacity="0.55" />

          {/* sharpened wood cone */}
          <path d="M6 32.5h8L10 42z" fill="#f2ddb0" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <path d="M10 33.2v7.4" stroke="#c79a4e" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
          <path d="M7 33.6l2.2 5.8" stroke="#c79a4e" strokeWidth="0.5" strokeLinecap="round" opacity="0.45" />

          {/* graphite tip */}
          <path
            d="M7.5 39.4h5L10 42z"
            fill="url(#pc-graphite)"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
