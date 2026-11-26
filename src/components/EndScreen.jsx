import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { COMIC } from '../data/comic.js'
import { ReplayIcon } from './Icons.jsx'

/** Ecrã final: aparece ao tentar avançar depois da última página. */
export default function EndScreen({ onReplay, onClose, onHome }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Portal no <body>: não herda o `position: relative` que o .reader aplica aos filhos.
  return createPortal(
    <div
      ref={ref}
      className="end"
      role="dialog"
      aria-modal="true"
      aria-label="Fim"
      tabIndex={-1}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="end__card">
        <p className="eyebrow">{COMIC.title}</p>
        <h2 className="end__title">Fim</h2>
        <svg className="end__wave" viewBox="0 0 120 12" aria-hidden="true">
          <path d="M2 6c7-8 14-8 21 0s14 8 21 0 14-8 21 0 14 8 21 0 14-8 12 0" />
        </svg>
        <p className="end__text">
          Obrigado por leres.
          <br />
          {COMIC.tagline}
        </p>
        <div className="end__actions">
          <button type="button" className="btn-primary" onClick={onReplay}>
            <ReplayIcon />
            Reler
          </button>
          <button type="button" className="btn-ghost" onClick={onHome}>
            Voltar ao início
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
