import { useEffect } from 'react'
import { COMIC, PAGES } from '../data/comic.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { usePageTurn } from '../hooks/usePageTurn.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import { useSwipe } from '../hooks/useSwipe.js'
import Book from './Book.jsx'
import Pager from './Pager.jsx'
import IconButton from './IconButton.jsx'
import { HomeIcon } from './Icons.jsx'

export default function Reader({ onHome }) {
  const single = useMediaQuery('(max-width: 720px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const total = PAGES.length

  const { left, step, flip, canPrev, canNext, next, prev } = usePageTurn({
    total,
    single,
    reducedMotion,
  })

  useKeyboardNav({ onPrev: prev, onNext: next })

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

  const last = Math.min(left + step, total)
  const label = single
    ? `Página ${left + 1} de ${total}`
    : `Páginas ${left + 1}–${last} de ${total}`

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
        <span className="reader__top-spacer" aria-hidden="true" />
      </header>

      <main className="reader__main">
        <Book
          pages={PAGES}
          left={left}
          single={single}
          flip={flip}
          canPrev={canPrev}
          canNext={canNext}
          onPrev={onZone(prev)}
          onNext={onZone(next)}
          swipeHandlers={handlers}
        />
      </main>

      <Pager
        label={label}
        progress={last / total}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
      />
    </div>
  )
}
