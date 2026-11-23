import Page from './Page.jsx'
import Leaf from './Leaf.jsx'
import { FLIP_MS } from '../hooks/usePageTurn.js'

/**
 * Apresenta uma ou duas páginas e a folha animada.
 * Toda a lógica de estado vem de fora (Reader) — aqui só se decide o que desenhar.
 */
export default function Book({
  pages,
  left,
  single,
  flip,
  canPrev,
  canNext,
  onPrev,
  onNext,
  swipeHandlers,
}) {
  const at = (i) => pages[i] ?? null
  const active = flip && !flip.done // a folha ainda está em movimento
  const next = flip?.dir === 'next'

  let content
  let leaf = null

  if (single) {
    // Uma página de cada vez
    const baseIndex = active ? (next ? flip.to : flip.from) : left
    const cast = active ? (next ? 'fade' : 'rise') : undefined
    content = <Page page={at(baseIndex)} side="single" cast={cast} />
    if (flip) {
      leaf = (
        <Leaf
          dir={flip.dir}
          single
          front={at(next ? flip.from : flip.to)}
          frontSide="single"
        />
      )
    }
  } else {
    // Duas páginas lado a lado
    let l = left
    let r = left + 1
    let castL, castR
    if (active) {
      if (next) {
        l = flip.from
        r = flip.to + 1
        castL = 'rise'
        castR = 'fade'
      } else {
        l = flip.to
        r = flip.from + 1
        castL = 'fade'
        castR = 'rise'
      }
    }
    content = (
      <>
        <div className="book__slot book__slot--left">
          <Page page={at(l)} side="left" cast={castL} />
        </div>
        <div className="book__slot book__slot--right">
          <Page page={at(r)} side="right" cast={castR} />
        </div>
      </>
    )
    if (flip) {
      leaf = next ? (
        <Leaf
          dir="next"
          front={at(flip.from + 1)}
          back={at(flip.to)}
          frontSide="right"
          backSide="left"
        />
      ) : (
        <Leaf
          dir="prev"
          front={at(flip.from)}
          back={at(flip.to + 1)}
          frontSide="left"
          backSide="right"
        />
      )
    }
  }

  return (
    <div
      className="book"
      data-mode={single ? 'single' : 'double'}
      style={{ '--flip-ms': `${FLIP_MS}ms` }}
      {...swipeHandlers}
    >
      <div className="book__sheet" aria-hidden="true" />
      <div className="book__stage">
        {content}
        {leaf}
      </div>

      <button
        type="button"
        className="zone zone--prev"
        aria-label="Página anterior"
        aria-disabled={!canPrev}
        tabIndex={-1}
        onClick={onPrev}
      />
      <button
        type="button"
        className="zone zone--next"
        aria-label="Página seguinte"
        aria-disabled={!canNext}
        tabIndex={-1}
        onClick={onNext}
      />
    </div>
  )
}
