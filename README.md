# Legit Media

Landing page da Legit Media, estúdio de filme e fotografia automotiva de Felipe Xavier.
Recriada a partir do handoff de design (v5) em Next.js (App Router), sem dependências de UI.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Onde mexer

- `app/config.ts`: @ do Instagram (todos os CTAs abrem o Direct), links das redes, projetos e especialidades.
- `app/page.tsx`: textos e estrutura das seções.
- `app/globals.css`: tokens de cor, tipografia e layout.
- `public/assets/`: imagens em WebP e o vídeo do hero (`hero.*` 1080p e `hero-720.*` para celular, em WebM e MP4, mais o `hero-poster.webp`).

## Responsivo e acessível

Testado de 320px a 2560px (celular, tablet, celular deitado, monitor grande), com axe-core sem violações.

- **Teclado:** link "Pular para o conteúdo", foco visível, painéis de projeto e especialidades navegáveis (Tab abre, Enter amplia), "Modo foto" com foco preso, Esc fecha e o foco volta ao painel; menu do celular fecha com Esc.
- **Toque:** hover só onde existe mouse. No tablet, o 1º toque abre o painel e o 2º amplia; efeitos dos botões usam foco e toque pressionado.
- **Movimento reduzido e economia de dados:** sem animações, vídeos parados (só a foto) e pilares viram lista.
- **Texto:** tamanhos em `rem` (respeitam a configuração de letra do navegador); botões quebram linha em vez de cortar.
- **Telas com notch:** `viewport-fit=cover` e áreas seguras.

## Pendências

- Confirmar o @ do Instagram e os links de YouTube e Vimeo em `app/config.ts`.
- Trocar as imagens (prints do Instagram, baixa resolução) pelas originais em 1600–2400px.
- Depoimentos ou marcas de clientes, e imagem de compartilhamento (OG).
