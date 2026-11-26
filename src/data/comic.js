// Dados da banda desenhada. Para trocar de imagens ou adicionar páginas,
// basta editar esta lista (as imagens vivem em /public/pages).

export const COMIC = {
  cover: 'capa.webp',
  title: 'O Roncador',
  subtitle: 'Fama a qualquer preço',
  description:
    'Pequeno, mas com uma enorme vontade de ser importante. Entre gostos, selfies e aplausos fáceis, o Roncador vai descobrir o que realmente conta.',
  tagline: 'Uma história sobre fama, atenção e verdadeiro valor.',
}

// Cor do bordo esquerdo (l) e direito (r) de cada página, usada no "ambilight"
// do fundo. Foram calculadas a partir das imagens; se trocares as páginas, podes
// pôr aqui as cores que quiseres (hex).
const GLOWS = [{'l': '#266458', 'r': '#643926'}, {'l': '#265c64', 'r': '#642c26'}, {'l': '#264664', 'r': '#644826'}, {'l': '#264564', 'r': '#264a64'}, {'l': '#263a64', 'r': '#264d64'}, {'l': '#386426', 'r': '#265164'}]

const PAGE_COUNT = GLOWS.length

export const PAGES = Array.from({ length: PAGE_COUNT }, (_, i) => ({
  id: i + 1,
  src: `pages/page-${i + 1}.webp`,
  alt: `Página ${i + 1} de ${PAGE_COUNT} — ${COMIC.title}`,
  glow: GLOWS[i],
}))
