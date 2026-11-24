import { useEffect, useState } from 'react'
import { COMIC, PAGES } from '../data/comic.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { usePageTurn } from '../hooks/usePageTurn.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useSwipe } from '../hooks/useSwipe.js'
import Book from './Book.jsx'
import Pager from './Pager.jsx'
import ZoomViewer from './ZoomViewer.jsx'
import IconButton from './IconButton.jsx'
import { HomeIcon, ZoomIcon } from './Icons.jsx'

export default function Reader({ onHome }) {
  const single = useMediaQuery('(max-width: 720px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const total = PAGES.length

  const { left, step, flip, canPrev, canNext, next, prev } = usePageTurn({
    total,
    single,
    reducedMotion,
  })

  const [zoomPage, setZoomPage] = useState(null) // página aberta no visualizador
  const [pick, setPick] = useState(false) // modo "escolher página a ampliar" (só em duas páginas)

  useKeyboardNav({ onPrev: prev, onNext: next, enabled: !zoomPage })

  useEffect(() => {
    if (single) setPick(false)
  }, [single])

  useEffect(() => {
    if (!pick) return
    const onKey = (e) => e.key === 'Escape' && setPick(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pick])

  const { swiped, handlers } = useSwipe({ onSwipeLeft: next, onSwipeRight: prev })

  // Pré-carregar todas as imagens para a viragem nunca mostrar páginas em branco.
  useEffect(() => {
    PAGES.forEach((p) => {
      const img = new Image()
      img.src = p.src
      img.decode?.().catch(() => {})
    })
  }, [])

  const onZone = (go) => () => {
    if (!swiped.current) go()
  }

  // Em modo de uma página, a lupa abre logo essa página; em duas, pede para escolher.
  const onZoomButton = () => {
    if (flip) return
    if (single) setZoomPage(PAGES[left])
    else setPick((p) => !p)
  }

  const onPick = (offset) => {
    const target = PAGES[left + offset]
    if (flip || !target) return
    setPick(false)
    setZoomPage(target)
  }

  const last = Math.min(left + step, total)
  const label = single
    ? `Página ${left + 1} de ${total}`
    : `Páginas ${left + 1}–${last} de ${total}`
  const pagerLabel = pick ? 'Escolhe a página a ampliar' : label

  return (
    <div className="reader">
      <div className="backdrop" aria-hidden="true" />

      <header className="reader__top">
        <IconButton label="Voltar ao início" onClick={onHome}>
          <HomeIcon />
        </IconButton>
        <p className="reader__title">
          <span>{COMIC.title}</span>
          <span className="reader__title-sub"> — {COMIC.subtitle}</span>
        </p>
        <IconButton label="Ampliar página" onClick={onZoomButton} active={pick}>
          <ZoomIcon />
        </IconButton>
      </header>

      <main className="reader__main">
        <Book
          pages={PAGES}
          left={left}
          single={single}
          flip={flip}
          canPrev={pick || canPrev}
          canNext={pick || canNext}
          onPrev={onZone(pick ? () => onPick(0) : prev)}
          onNext={onZone(pick ? () => onPick(1) : next)}
          pick={pick}
          swipeHandlers={handlers}
        />
      </main>

      <Pager
        label={pagerLabel}
        progress={last / total}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
      />

      {zoomPage && <ZoomViewer page={zoomPage} onClose={() => setZoomPage(null)} />}
    </div>
  )
}
