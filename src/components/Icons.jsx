const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ChevronLeft = (p) => (
  <svg {...base} {...p}><path d="m14.5 5-7 7 7 7" /></svg>
)
export const ChevronRight = (p) => (
  <svg {...base} {...p}><path d="m9.5 5 7 7-7 7" /></svg>
)
export const ArrowRight = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M4 11.2 12 4l8 7.2V20h-5.5v-5.5h-5V20H4z" /></svg>
)

export const ZoomIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="5.8" />
    <path d="m15 15 5 5M10.5 8v5M8 10.5h5" />
  </svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const MinusIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
)
