import { useState } from 'react'
import { COMIC, PAGES } from '../data/comic.js'
import { ArrowRight } from './Icons.jsx'

export default function Intro({ onStart }) {
  const [leaving, setLeaving] = useState(false)

  const start = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(onStart, 450)
  }

  return (
    <main className={`intro ${leaving ? 'is-leaving' : ''}`}>
      <div className="backdrop" aria-hidden="true" />

      <div className="intro__cover" aria-hidden="true">
        <img src={PAGES[0].src} alt="" draggable={false} />
      </div>

      <section className="intro__text">
        <p className="eyebrow">Banda desenhada</p>
        <h1 className="intro__title">
          <span className="intro__name">{COMIC.title}</span>
          <span className="intro__subtitle">{COMIC.subtitle}</span>
        </h1>
        <p className="intro__desc">{COMIC.description}</p>
        <button type="button" className="btn-primary" onClick={start}>
          Começar a ler
          <ArrowRight />
        </button>
        <p className="intro__hint">Usa as setas do teclado ou toca nas páginas para as virar.</p>
      </section>
    </main>
  )
}
