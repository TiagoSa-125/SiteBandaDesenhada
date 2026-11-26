import { useMemo } from 'react'

const BUBBLE_COUNT = 16

// Peixes soltos: [altura %, tamanho px, duração s, atraso s, sentido (1 → | -1 ←), opacidade]
const FISH = [
  [18, 46, 70, -12, 1, 0.13],
  [34, 30, 95, -55, -1, 0.1],
  [58, 64, 62, -30, -1, 0.15],
  [74, 38, 84, -70, 1, 0.11],
  [46, 24, 110, -90, 1, 0.08],
]

// Cardume: grupo pequeno que nada junto [altura %, duração s, atraso s, sentido]
const SCHOOL = { top: 28, duration: 120, delay: -40, dir: 1, size: 18, opacity: 0.1 }
const SCHOOL_OFFSETS = [
  [0, 0], [26, -14], [30, 16], [58, -4], [62, 22], [90, 6],
]

function FishShape() {
  return (
    <svg className="fish__svg" viewBox="0 0 48 24" aria-hidden="true">
      <g className="fish__tail">
        <path d="M10 12 1 4.5Q4.5 12 1 19.5Z" />
      </g>
      <path d="M8 12C14 3 30 3 42 12 30 21 14 21 8 12Z" />
      <path d="M21 5.2 28 .8 30 6Z" />
    </svg>
  )
}

// Valores pseudo-aleatórios fixos (sem Math.random) para o fundo ser estável entre renders.
const rand = (i, n) => {
  const x = Math.sin(i * 97.13 + n * 31.7) * 10000
  return x - Math.floor(x)
}

/** Fundo azul-noite: luz, raios com deriva lenta e poucas bolhas discretas. */
export default function Backdrop() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
        left: `${rand(i, 1) * 100}%`,
        size: 4 + rand(i, 2) * 9,
        duration: 26 + rand(i, 3) * 28,
        delay: -rand(i, 4) * 50,
        sway: `${(rand(i, 5) - 0.5) * 70}px`,
        opacity: 0.1 + rand(i, 6) * 0.14,
      })),
    [],
  )

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="bubbles">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--sway': b.sway,
              '--op': b.opacity,
            }}
          />
        ))}
      </div>

      <div className="fishes">
        {FISH.map(([top, size, duration, delay, dir, opacity], i) => (
          <span
            key={i}
            className={`fish ${dir > 0 ? 'fish--right' : 'fish--left'}`}
            style={{
              top: `${top}%`,
              width: size,
              opacity,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <span className="fish__bob" style={{ animationDelay: `${-i * 1.7}s` }}>
              <FishShape />
            </span>
          </span>
        ))}

        <span
          className={`fish fish--school ${SCHOOL.dir > 0 ? 'fish--right' : 'fish--left'}`}
          style={{
            top: `${SCHOOL.top}%`,
            opacity: SCHOOL.opacity,
            animationDuration: `${SCHOOL.duration}s`,
            animationDelay: `${SCHOOL.delay}s`,
          }}
        >
          {SCHOOL_OFFSETS.map(([x, y], i) => (
            <span
              key={i}
              className="fish__bob fish__member"
              style={{
                left: x,
                top: y,
                width: SCHOOL.size,
                animationDelay: `${-i * 0.9}s`,
              }}
            >
              <FishShape />
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
