import { useEffect, useRef } from 'react'

export function useKeyboardNav({ onPrev, onNext }) {
  const cb = useRef({ onPrev, onNext })
  cb.current = { onPrev, onNext }

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
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
