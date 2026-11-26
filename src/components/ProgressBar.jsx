/**
 * Barra de progresso dividida em segmentos (um por página ou par de páginas).
 * Ao passar o rato / focar um segmento aparece uma miniatura; clicar salta para lá.
 */
export default function ProgressBar({ pages, views, step, current, onJump }) {
  return (
    <div className="progress" role="group" aria-label="Progresso da leitura">
      {Array.from({ length: views }, (_, i) => {
        const start = i * step
        const shown = pages.slice(start, start + step)
        const label =
          shown.length > 1
            ? `Páginas ${start + 1}–${start + shown.length}`
            : `Página ${start + 1}`
        return (
          <button
            key={i}
            type="button"
            className={`progress__seg ${i <= current ? 'is-read' : ''} ${i === current ? 'is-current' : ''}`}
            aria-label={`Ir para ${label.toLowerCase()}`}
            aria-current={i === current ? 'step' : undefined}
            onClick={() => onJump(start)}
          >
            <span className="progress__bar" />
            <span className="progress__thumb" aria-hidden="true">
              <span className="progress__imgs">
                {shown.map((p) => (
                  <img key={p.id} src={p.src} alt="" draggable={false} />
                ))}
              </span>
              <span className="progress__cap">{label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
