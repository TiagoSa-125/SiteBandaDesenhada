import IconButton from './IconButton.jsx'
import ProgressBar from './ProgressBar.jsx'
import { ChevronLeft, ChevronRight } from './Icons.jsx'

export default function Pager({ label, progress, canPrev, canNext, onPrev, onNext }) {
  return (
    <footer className="pager">
      <div className="pager__row">
        <IconButton label="Página anterior" onClick={onPrev} disabled={!canPrev}>
          <ChevronLeft />
        </IconButton>
        <p className="pager__label" aria-live="polite">
          {label}
        </p>
        <IconButton label="Página seguinte" onClick={onNext} disabled={!canNext}>
          <ChevronRight />
        </IconButton>
      </div>
      <ProgressBar value={progress} />
    </footer>
  )
}
