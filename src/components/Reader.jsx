import { useEffect, useState } from 'react'
import { COMIC, PAGES } from '../data/comic.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { usePageTurn, OPEN_MS, OPEN_DELAY } from '../hooks/usePageTurn.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useSwipe } from '../hooks/useSwipe.js'
import Backdrop from './Backdrop.jsx'
import Book from './Book.jsx'
import Pager from './Pager.jsx'
import ZoomViewer from './ZoomViewer.jsx'
import EndScreen from './EndScreen.jsx'
import IconButton from './IconButton.jsx'
import { HomeIcon, ZoomIcon } from './Icons.jsx'

const COVER = { src: COMIC.cover, alt: `Capa de ${COMIC.title} — ${COMIC.subtitle}` }

export default function Reader({ onHome, fromIntro = false }) {
  const single = useMediaQuery('(max-width: 720px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const total = PAGES.length

  const { left, step, flip, canPrev, canNext, goTo, next, prev } = usePageTurn({
    total,
    single,
    reducedMotion,
  })

  // --- Capa a abrir (só quando se vem do ecrã inicial) ---
  const [entry] = useState(() => (fromIntro && !reducedMotion ? 'open' : 'fade'))
  const [phase, setPhase] = useState(entry === 'open' ? 'running' : 'done')
  const ready = phase === 'done'

  useEffect(() => {
    if (phase !== 'running') return
    const t = setTimeout(() => setPhase('settling'), OPEN_DELAY + OPEN_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'settling') return
    let r2
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setPhase('done'))
    })
    return () => {
      cancelAnimationFrame(r1)
      cancelAnimationFrame(r2)
    }
  }, [phase])

  // --- Ampliar / ecrã final ---
  const [zoomPage, setZoomPage] = useState(null) // página aberta no visualizador
  const [pick, setPick] = useState(false) // modo "escolher página a ampliar" (só em duas páginas)
  const [showEnd, setShowEnd] = useState(false)

  const atEnd = left + step >= total
  const idle = ready && !flip
  const prevEnabled = ready && canPrev
  const nextEnabled = idle && (canNext || atEnd)

  const back = () => {
    if (prevEnabled) prev()
  }
  // No fim, "avançar" mostra o ecrã final em vez de virar página.
  const forward = () => {
    if (!idle) return
    if (atEnd) setShowEnd(true)
    else next()
  }

  useKeyboardNav({
    onPrev: back,
    onNext: forward,
    enabled: !zoomPage && !showEnd && ready,
  })

  useEffect(() => {
    if (single) setPick(false)
  }, [single])

  useEffect(() => {
    if (!pick) return
    const onKey = (e) => e.key === 'Escape' && setPick(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pick])

  const { swiped, handlers } = useSwipe({ onSwipeLeft: forward, onSwipeRight: back })

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
    if (!idle) return
    if (single) setZoomPage(PAGES[left])
    else setPick((p) => !p)
  }

  const onPick = (offset) => {
    const target = PAGES[left + offset]
    if (!idle || !target) return
    setPick(false)
    setZoomPage(target)
  }

  const jump = (index) => {
    if (idle) goTo(index)
  }

  const replay = () => {
    setShowEnd(false)
    goTo(0)
  }

  // --- Ambilight: o fundo toma as cores dos bordos das páginas (já a pensar no destino da viragem) ---
  const lead = flip ? flip.to : left
  const glowL = PAGES[lead].glow.l
  const glowR = single ? PAGES[lead].glow.r : (PAGES[lead + 1] ?? PAGES[lead]).glow.r

  const last = Math.min(left + step, total)
  const label = single
    ? `Página ${left + 1} de ${total}`
    : `Páginas ${left + 1}–${last} de ${total}`
  const pagerLabel = pick ? 'Escolhe a página a ampliar' : label

  return (
    <div className="reader" style={{ '--glow-l': glowL, '--glow-r': glowR }}>
      <Backdrop />

      <header className="reader__top">
        <IconButton label="Voltar ao início" onClick={onHome}>
          <HomeIcon />
        </IconButton>
        <p className="reader__title">
          <span>{COMIC.title}</span>
          <span className="reader__title-sub"> — {COMIC.subtitle}</span>
        </p>
        <IconButton label="Ampliar página" onClick={onZoomButton} active={pick} disabled={!ready}>
          <ZoomIcon />
        </IconButton>
      </header>

      <main className="reader__main">
        <Book
          pages={PAGES}
          left={left}
          single={single}
          flip={flip}
          phase={phase}
          entry={entry}
          cover={COVER}
          canPrev={pick ? ready : prevEnabled}
          canNext={pick ? ready : nextEnabled}
          onPrev={onZone(pick ? () => onPick(0) : back)}
          onNext={onZone(pick ? () => onPick(1) : forward)}
          pick={pick}
          swipeHandlers={handlers}
        />
      </main>

      <Pager
        label={pagerLabel}
        pages={PAGES}
        views={Math.ceil(total / step)}
        step={step}
        current={left / step}
        canPrev={prevEnabled}
        canNext={nextEnabled}
        nextIsEnd={atEnd}
        onPrev={back}
        onNext={forward}
        onJump={jump}
      />

      {zoomPage && <ZoomViewer page={zoomPage} onClose={() => setZoomPage(null)} />}
      {showEnd && (
        <EndScreen onReplay={replay} onClose={() => setShowEnd(false)} onHome={onHome} />
      )}
    </div>
  )
}
