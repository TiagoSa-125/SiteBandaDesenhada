import { useRef } from 'react'

/**
 * Deteta gestos horizontais (toque, caneta ou rato).
 * `swiped` fica true brevemente depois de um gesto, para o clique
 * que se segue ao levantar o dedo ser ignorado.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 45 }) {
  const start = useRef(null)
  const swiped = useRef(false)

  const handlers = {
    onPointerDown(e) {
      start.current = { x: e.clientX, y: e.clientY }
      swiped.current = false
    },
    onPointerUp(e) {
      const s = start.current
      start.current = null
      if (!s) return
      const dx = e.clientX - s.x
      const dy = e.clientY - s.y
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.3) {
        swiped.current = true
        setTimeout(() => (swiped.current = false), 120)
        if (dx < 0) onSwipeLeft()
        else onSwipeRight()
      }
    },
    onPointerCancel() {
      start.current = null
    },
  }

  return { swiped, handlers }
}
