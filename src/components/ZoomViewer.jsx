import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useZoomPan, MAX_SCALE } from '../hooks/useZoomPan.js'
import IconButton from './IconButton.jsx'
import { CloseIcon, PlusIcon, MinusIcon } from './Icons.jsx'

/**
 * Visualizador em ecrã inteiro para ampliar uma página.
 * Rato: roda / duplo clique / arrastar · Toque: pinça / duplo toque / arrastar
 * Teclado: +  −  0  setas  Esc
 */
export default function ZoomViewer({ page, onClose }) {
  const stageRef = useRef(null)
  const contentRef = useRef(null)
  const dialogRef = useRef(null)
  const { view, smooth, handlers, zoomBy, reset, panBy, wasDragged } = useZoomPan(stageRef, contentRef)

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const step = 90
      switch (e.key) {
        case 'Escape': onClose(); break
        case '+': case '=': zoomBy(1.4); break
        case '-': case '_': zoomBy(1 / 1.4); break
        case '0': reset(); break
        case 'ArrowLeft': panBy(step, 0); break
        case 'ArrowRight': panBy(-step, 0); break
        case 'ArrowUp': panBy(0, step); break
        case 'ArrowDown': panBy(0, -step); break
        default: return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, zoomBy, reset, panBy])

  const zoomed = view.s > 1.01
  const pct = Math.round(view.s * 100)

  const onStageUp = (e) => {
    handlers.onPointerUp(e)
    // clicar no fundo (fora da imagem) fecha, se não houve arrasto nem zoom
    // (o pointer capture faz o e.target ser sempre o palco, por isso testo a posição)
    const r = contentRef.current.getBoundingClientRect()
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    if (!inside && !zoomed && !wasDragged()) onClose()
  }

  // Portal no <body>: assim não herda o `position: relative` que o .reader aplica aos filhos.
  return createPortal(
    <div
      ref={dialogRef}
      className="zoom"
      role="dialog"
      aria-modal="true"
      aria-label={`Ampliar — ${page.alt}`}
      tabIndex={-1}
    >
      <div
        ref={stageRef}
        className={`zoom__stage ${zoomed ? 'is-zoomed' : ''}`}
        {...handlers}
        onPointerUp={onStageUp}
      >
        <div
          ref={contentRef}
          className="zoom__content"
          data-smooth={smooth}
          style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})` }}
        >
          <img src={page.src} alt={page.alt} draggable={false} />
        </div>
      </div>

      <div className="zoom__close">
        <IconButton label="Fechar ampliação" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="zoom__bar" role="group" aria-label="Controlos de zoom">
        <IconButton label="Diminuir" onClick={() => zoomBy(1 / 1.4)} disabled={view.s <= 1.001}>
          <MinusIcon />
        </IconButton>
        <button
          type="button"
          className="zoom__pct"
          onClick={reset}
          title="Ajustar ao ecrã"
          aria-label={`Zoom a ${pct}%. Ajustar ao ecrã`}
        >
          {pct}%
        </button>
        <IconButton label="Ampliar" onClick={() => zoomBy(1.4)} disabled={view.s >= MAX_SCALE - 0.001}>
          <PlusIcon />
        </IconButton>
      </div>

      <p className="zoom__hint" aria-hidden="true">
        Duplo clique ou roda do rato para ampliar · arrasta para mover
      </p>
    </div>,
    document.body,
  )
}
