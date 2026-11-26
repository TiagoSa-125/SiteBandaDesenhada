import IconButton from './IconButton.jsx'
import ProgressBar from './ProgressBar.jsx'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

export default function Pager({
  label,
  pages,
  views,
  step,
  current,
  canPrev,
  canNext,
  nextIsEnd,
  onPrev,
  onNext,
  onJump,
}) {
  return (
    <footer className="pager">
      <div className="pager__row">
        <IconButton label="Página anterior" onClick={onPrev} disabled={!canPrev}>
          <ChevronLeft />
        </IconButton>
        <p className="pager__label" aria-live="polite">
          {label}
        </p>
        <IconButton
          label={nextIsEnd ? 'Terminar' : 'Página seguinte'}
          onClick={onNext}
          disabled={!canNext}
          className={nextIsEnd ? 'is-end' : ''}
        >
          <ChevronRight />
        </IconButton>
      </div>
      <ProgressBar pages={pages} views={views} step={step} current={current} onJump={onJump} />
    </footer>
  )
}
