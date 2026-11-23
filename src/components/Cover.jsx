import { useRef } from 'react'

const REST = { rx: 3, ry: -12 } // posição de repouso: ligeiramente virada, como um livro pousado

/**
 * Capa 3D: inclina-se seguindo o rato (ou o dedo), com brilho que desliza
 * e sombra que acompanha o movimento. Clicar começa a leitura.
 */
export default function Cover({ src, alt, onClick }) {
  const ref = useRef(null)
  const frame = useRef(0)

  const set = (vars) => {
    const el = ref.current
    if (!el) return
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v)
  }

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (reduced()) return
    const r = ref.current.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 2 - 1 // -1 .. 1
    const py = ((e.clientY - r.top) / r.height) * 2 - 1
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      ref.current.dataset.active = 'true'
      set({
        '--rx': `${-py * 11}deg`,
        '--ry': `${px * 15}deg`,
        '--gx': `${(px + 1) * 50}%`,
        '--gy': `${(py + 1) * 50}%`,
        '--shx': `${-px * 28}px`,
        '--shy': `${-py * 14}px`,
      })
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    const el = ref.current
    delete el.dataset.active
    set({
      '--rx': `${REST.rx}deg`,
      '--ry': `${REST.ry}deg`,
      '--shx': '-14px',
      '--shy': '0px',
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      className="cover"
      aria-label="Começar a ler"
      onClick={onClick}
      onPointerEnter={onMove}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      <span className="cover__body">
        <img className="cover__img" src={src} alt={alt} draggable={false} />
        <span className="cover__spine" aria-hidden="true" />
        <span className="cover__glare" aria-hidden="true" />
      </span>
    </button>
  )
}
