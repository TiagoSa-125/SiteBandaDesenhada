// Dados da banda desenhada. Para trocar de imagens ou adicionar páginas,
// basta editar esta lista (as imagens vivem em /public/pages).

export const COMIC = {
  cover: 'capa.webp',
  title: 'O Roncador',
  subtitle: 'Fama a qualquer preço',
  description:
    'Pequeno, mas com uma enorme vontade de ser importante. Entre gostos, selfies e aplausos fáceis, o Roncador vai descobrir o que realmente conta.',
}

const PAGE_COUNT = 6

export const PAGES = Array.from({ length: PAGE_COUNT }, (_, i) => ({
  id: i + 1,
  src: `pages/page-${i + 1}.webp`,
  alt: `Página ${i + 1} de ${PAGE_COUNT} — ${COMIC.title}`,
}))
