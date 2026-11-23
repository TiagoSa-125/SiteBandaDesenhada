/**
 * Uma folha da banda desenhada.
 * side: 'left' | 'right' | 'single'  -> define cantos arredondados e sombra da lombada
 * cast: 'fade' | 'rise' | undefined   -> sombra projetada pela folha que está a virar
 */
export default function Page({ page, side, cast }) {
  return (
    <div className={`page page--${side}`} data-cast={cast}>
      {page && (
        <img
          src={page.src}
          alt={page.alt}
          draggable={false}
          decoding="async"
        />
      )}
      <span className="page__cast" aria-hidden="true" />
    </div>
  )
}
