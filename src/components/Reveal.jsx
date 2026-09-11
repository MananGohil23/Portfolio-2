import { useEffect, useRef, useState } from 'react'

/**
 * Fades / drifts children into view on scroll.
 *
 * Props:
 *  - tilt: resting rotation (deg) after reveal
 *  - delay: ms before the transition starts
 *  - as:    wrapper element (default div)
 */
export default function Reveal({
  children,
  tilt = 0,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-tilt': `${tilt - 3}deg`,
        '--reveal-tilt-rest': `${tilt}deg`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
