# O Roncador — Fama a qualquer preço

Leitor de banda desenhada digital (React + CSS, sem backend).

## Ver já
Abre `dist/index.html` no browser (funciona diretamente, sem servidor).

## Desenvolvimento
```
npm install
npm run dev      # servidor de desenvolvimento (Vite)
npm run build    # gera dist/ otimizado
```

## Estrutura
- `src/data/comic.js` — título, descrição e lista de páginas
- `src/components/` — Intro, Reader, Book, Page, Leaf, Pager, ProgressBar, IconButton
- `src/hooks/` — usePageTurn (estado + animação), useKeyboardNav, useSwipe, useMediaQuery
- `src/styles/` — base, intro, reader, book
- `public/pages/page-1..6.webp` — as páginas (versões web das imagens originais)
