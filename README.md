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

## Animação dos botões

`app/components/ButtonFx.tsx` é um port da animação "Botão Like Burnout" (protótipo de motion): ao passar o mouse, focar pelo teclado ou tocar, a seta do botão cede lugar a uma roda que afunda, gira no lugar deixando um risco dourado e solta fumaça, treme, dá um tranco e para; depois a seta volta. É desenhada num canvas que só existe durante a animação. Os tempos das cenas ficam em `CUE` no topo do arquivo.

## Abertura (painel dá a partida)

`app/components/Intro.tsx` é um port da animação "painel-start" (protótipo de motion), comprimida de 7,2 s para ~2 s: o painel se desenha, os ponteiros varrem ao máximo e voltam, as luzes de alerta acendem, aparece "Pronto para partir" e tudo se dissolve no site.

- Só na 1ª visita da sessão; `?intro` na URL força (para testar). Não aparece com movimento reduzido nem economia de dados.
- Clique, toque ou qualquer tecla pulam. Se o JS falhar, um fallback em CSS tira a tela em ~6 s.
- Desempenho: desenhada num `<canvas>` (sem React por quadro), com resolução que desce em degraus se o aparelho estiver lento e com o relógio pausando (em vez de pular quadros) quando a página engasga. A animação só começa depois que o navegador termina de "ligar" o site (a tela fica escura e parada por um instante em aparelhos lentos). O vídeo do topo só começa quando ela termina.
- Velocidade: constante `K` no topo do arquivo (1 = velocidade do protótipo; 0,45 ≈ 2 s). Cores: objeto `C`.
- Os ícones (`intro-icons.ts`) são do [Phosphor](https://phosphoricons.com) (MIT).

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
