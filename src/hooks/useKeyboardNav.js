import { useEffect, useRef } from 'react'

export function useKeyboardNav({ onPrev, onNext, enabled = true }) {
  const cb = useRef({ onPrev, onNext, enabled })
  cb.current = { onPrev, onNext, enabled }

  useEffect(() => {
    const onKey = (e) => {
      if (!cb.current.enabled || e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        cb.current.onNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        cb.current.onPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
