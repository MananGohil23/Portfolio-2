import { useEffect } from 'react'

/**
 * Watches every `.doodle` SVG on the page and adds `is-drawn` when it scrolls
 * into view, which triggers the stroke/fill animation defined in index.css.
 *
 * Runs once after mount (all doodles are rendered in the same commit) and is a
 * no-op that draws everything immediately if IntersectionObserver is missing.
 */
export default function ScrollDraw() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('svg.doodle'))
    if (!nodes.length) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-drawn'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-drawn')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return null
}
