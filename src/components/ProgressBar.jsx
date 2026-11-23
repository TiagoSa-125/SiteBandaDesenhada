export default function ProgressBar({ value }) {
  const pct = Math.round(value * 100)
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Progresso da leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="progress__fill" style={{ transform: `scaleX(${value})` }} />
    </div>
  )
}
