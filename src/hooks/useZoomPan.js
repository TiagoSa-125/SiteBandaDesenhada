import { useCallback, useEffect, useRef, useState } from 'react'

export const MIN_SCALE = 1
export const MAX_SCALE = 4

/**
 * Zoom + deslocação de uma imagem dentro de um "palco" (stage).
 * Suporta roda do rato / trackpad, arrastar, pinça (2 dedos) e duplo toque.
 * Coordenadas internas: relativas ao centro do palco.
 */
export function useZoomPan(stageRef, contentRef) {
  const [view, setView] = useState({ s: 1, x: 0, y: 0 })
  const [smooth, setSmooth] = useState(false)
  const viewRef = useRef(view)
  viewRef.current = view

  const pointers = useRef(new Map())
  const pinch = useRef(null)
  const travel = useRef(0)
  const lastTap = useRef({ t: 0, x: 0, y: 0 })

  const clamp = useCallback(
    (v) => {
      const st = stageRef.current
      const c = contentRef.current
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.s))
      if (!st || !c) return { ...v, s }
      const mx = Math.max(0, (c.offsetWidth * s - st.clientWidth) / 2)
      const my = Math.max(0, (c.offsetHeight * s - st.clientHeight) / 2)
      return {
        s,
        x: Math.min(mx, Math.max(-mx, v.x)),
        y: Math.min(my, Math.max(-my, v.y)),
      }
    },
    [stageRef, contentRef],
  )

  const toCenter = useCallback(
    (clientX, clientY) => {
      const r = stageRef.current.getBoundingClientRect()
      return { x: clientX - (r.left + r.width / 2), y: clientY - (r.top + r.height / 2) }
    },
    [stageRef],
  )

  // Muda a escala mantendo fixo o ponto (px, py) por baixo do cursor/dedos.
  const zoomAt = useCallback(
    (nextScale, px, py, animate = false) => {
      setSmooth(animate)
      setView((v) => {
        const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, typeof nextScale === 'function' ? nextScale(v.s) : nextScale))
        const k = s / v.s
        return clamp({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k })
      })
    },
    [clamp],
  )

  const zoomBy = useCallback((factor) => zoomAt((s) => s * factor, 0, 0, true), [zoomAt])

  const reset = useCallback(() => {
    setSmooth(true)
    setView({ s: 1, x: 0, y: 0 })
  }, [])

  const panBy = useCallback(
    (dx, dy) => {
      setSmooth(true)
      setView((v) => (v.s > 1 ? clamp({ ...v, x: v.x + dx, y: v.y + dy }) : v))
    },
    [clamp],
  )

  // Roda do rato / pinça no trackpad (precisa de listener não-passivo)
  useEffect(() => {
    const st = stageRef.current
    if (!st) return
    const onWheel = (e) => {
      e.preventDefault()
      const { x, y } = toCenter(e.clientX, e.clientY)
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0018))
      zoomAt((s) => s * k, x, y, false)
    }
    st.addEventListener('wheel', onWheel, { passive: false })
    return () => st.removeEventListener('wheel', onWheel)
  }, [stageRef, toCenter, zoomAt])

  const handlers = {
    onPointerDown(e) {
      e.currentTarget.setPointerCapture?.(e.pointerId)
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.current.size === 1) travel.current = 0
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        pinch.current = {
          dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          mid: toCenter((a.x + b.x) / 2, (a.y + b.y) / 2),
          view: viewRef.current,
        }
      }
    },

    onPointerMove(e) {
      const prev = pointers.current.get(e.pointerId)
      if (!prev) return
      const cur = { x: e.clientX, y: e.clientY }
      pointers.current.set(e.pointerId, cur)

      if (pointers.current.size === 1) {
        const dx = cur.x - prev.x
        const dy = cur.y - prev.y
        travel.current += Math.abs(dx) + Math.abs(dy)
        if (viewRef.current.s > 1) {
          setSmooth(false)
          setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }))
        }
      } else if (pointers.current.size === 2 && pinch.current) {
        const [a, b] = [...pointers.current.values()]
        const g = pinch.current
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1
        const mid = toCenter((a.x + b.x) / 2, (a.y + b.y) / 2)
        const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, g.view.s * (dist / g.dist)))
        // ponto da imagem que estava sob os dedos no início do gesto
        const lx = (g.mid.x - g.view.x) / g.view.s
        const ly = (g.mid.y - g.view.y) / g.view.s
        travel.current += 10
        setSmooth(false)
        setView(clamp({ s, x: mid.x - s * lx, y: mid.y - s * ly }))
      }
    },

    onPointerUp(e) {
      const had = pointers.current.delete(e.pointerId)
      if (pointers.current.size < 2) pinch.current = null
      if (!had || pointers.current.size > 0) return

      // Duplo toque / duplo clique: alterna entre ajustado e ampliado
      if (travel.current < 8) {
        const now = Date.now()
        const lt = lastTap.current
        const near = Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 30
        if (now - lt.t < 320 && near) {
          const { x, y } = toCenter(e.clientX, e.clientY)
          if (viewRef.current.s > 1.05) reset()
          else zoomAt(2.5, x, y, true)
          lastTap.current = { t: 0, x: 0, y: 0 }
        } else {
          lastTap.current = { t: now, x: e.clientX, y: e.clientY }
        }
      }
    },

    onPointerCancel(e) {
      pointers.current.delete(e.pointerId)
      pinch.current = null
    },
  }

  return { view, smooth, handlers, zoomBy, reset, panBy, wasDragged: () => travel.current >= 8 }
}
