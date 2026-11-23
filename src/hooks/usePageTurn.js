import { useCallback, useEffect, useRef, useState } from 'react'

export const FLIP_MS = 760

/**
 * Estado da leitura + animação de virar página.
 *
 * - `left` é o índice (0-based) da primeira página visível.
 * - `flip` descreve a viragem em curso: { dir, from, to, done }.
 *   Quando `done` é true a página já foi confirmada, mas a folha animada
 *   ainda fica montada mais dois frames para não haver "piscar" da imagem.
 */
export function usePageTurn({ total, single, reducedMotion }) {
  const step = single ? 1 : 2
  const [page, setPage] = useState(0)
  const [flip, setFlip] = useState(null)
  const timers = useRef([])

  const left = single ? page : page - (page % 2)
  const idle = !flip
  const canPrev = idle && left > 0
  const canNext = idle && left + step < total

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  // Mudar de modo (desktop <-> mobile) cancela qualquer viragem em curso.
  useEffect(() => {
    clearTimers()
    setFlip(null)
  }, [single])

  const turn = useCallback(
    (dir) => {
      if (flip) return
      const to = dir === 'next' ? left + step : left - step
      if (to < 0 || to >= total) return

      if (reducedMotion) {
        setPage(to)
        return
      }

      setFlip({ dir, from: left, to, done: false })
      timers.current.push(
        setTimeout(() => {
          setPage(to)
          setFlip((f) => (f ? { ...f, done: true } : f))
          requestAnimationFrame(() => requestAnimationFrame(() => setFlip(null)))
        }, FLIP_MS),
      )
    },
    [flip, left, step, total, reducedMotion],
  )

  return {
    left,
    step,
    flip,
    canPrev,
    canNext,
    next: useCallback(() => turn('next'), [turn]),
    prev: useCallback(() => turn('prev'), [turn]),
  }
}
