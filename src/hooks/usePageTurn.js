import { useCallback, useEffect, useRef, useState } from 'react'

export const FLIP_MS = 760
export const OPEN_MS = 1250 // duração da capa a abrir
export const OPEN_DELAY = 500 // pausa com a capa fechada antes de abrir

/**
 * Estado da leitura + animação de virar página.
 *
 * - `left` é o índice (0-based) da primeira página visível.
 * - `flip` descreve a viragem em curso: { dir, from, to, done }.
 *   Quando `done` é true a página já foi confirmada, mas a folha animada
 *   ainda fica montada mais dois frames para não haver "piscar" da imagem.
 * - `goTo(i)` salta para qualquer página com uma só viragem.
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

  const goTo = useCallback(
    (index) => {
      if (flip) return
      const to = single ? index : index - (index % 2)
      if (to === left || to < 0 || to >= total) return

      if (reducedMotion) {
        setPage(to)
        return
      }

      setFlip({ dir: to > left ? 'next' : 'prev', from: left, to, done: false })
      timers.current.push(
        setTimeout(() => {
          setPage(to)
          setFlip((f) => (f ? { ...f, done: true } : f))
          requestAnimationFrame(() => requestAnimationFrame(() => setFlip(null)))
        }, FLIP_MS),
      )
    },
    [flip, left, single, total, reducedMotion],
  )

  return {
    left,
    step,
    flip,
    canPrev,
    canNext,
    goTo,
    next: useCallback(() => goTo(left + step), [goTo, left, step]),
    prev: useCallback(() => goTo(left - step), [goTo, left, step]),
  }
}
