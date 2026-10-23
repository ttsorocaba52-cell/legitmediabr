# Legit Media

Landing page da Legit Media, estúdio de filme e fotografia automotiva de Felipe Xavier.
Recriada a partir do handoff de design (v5) em Next.js (App Router), sem dependências de UI.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Onde mexer

- `app/config.ts`: @ do Instagram (os CTAs de contato abrem o Direct), WhatsApp (botão "Orçamento"), links das redes, projetos e especialidades.
- `app/page.tsx`: textos e estrutura das seções.
- `app/globals.css`: tokens de cor, tipografia e layout.
- `public/assets/`: imagens em WebP e o vídeo do hero (`hero.*` 1080p e `hero-720.*` para celular, em WebM e MP4, mais o `hero-poster.webp`).

## Animação dos botões

`app/components/ButtonFx.tsx` é um port da animação "Botão Like Burnout" (protótipo de motion): ao passar o mouse, focar pelo teclado ou tocar, a seta do botão cede lugar a uma roda que afunda, gira no lugar deixando um risco dourado e solta fumaça, treme, dá um tranco e para; depois a seta volta. É desenhada num canvas que só existe durante a animação. Os tempos das cenas ficam em `CUE` no topo do arquivo.

## Faixa de vídeo (divisor)

`app/components/VideoBand.tsx`: faixa em largura total entre "Formatos" e "Como funciona" (Chevette no pôr do sol). Decorativa, sem som. Só baixa e toca perto da tela, pausa ao sair, faz um fade no fim do loop e fica só na foto de capa com movimento reduzido ou economia de dados. Arquivos: `public/assets/divisor*` (1920 e 960 de largura, WebM e MP4). Para trocar o vídeo, substitua esses arquivos.

## Responsivo e acessível

Testado de 320px a 2560px (celular, tablet, celular deitado, monitor grande), com axe-core sem violações.

- **Teclado:** link "Pular para o conteúdo", foco visível, painéis de projeto e especialidades navegáveis (Tab abre, Enter amplia), "Modo foto" com foco preso, Esc fecha e o foco volta ao painel; menu do celular fecha com Esc.
- **Toque:** hover só onde existe mouse. No tablet, o 1º toque abre o painel e o 2º amplia; efeitos dos botões usam foco e toque pressionado.
- **Movimento reduzido e economia de dados:** sem animações, vídeos parados (só a foto) e pilares viram lista.
- **Texto:** tamanhos em `rem` (respeitam a configuração de letra do navegador); botões quebram linha em vez de cortar.
- **Telas com notch:** `viewport-fit=cover` e áreas seguras.

## Pendências

- Links do YouTube e do Vimeo em `app/config.ts` (o @ do Instagram já está confirmado: legitmediabr).
- Trocar as imagens (prints do Instagram, baixa resolução) pelas originais em 1600–2400px.
- Depoimentos ou marcas de clientes, e imagem de compartilhamento (OG).
