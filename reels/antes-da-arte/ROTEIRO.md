# O que acontece antes da arte pronta
**Semana 1 / Quarta · Publicação 02 · Reels 9:16 · 31 s**

Vídeo pronto: `antes-da-arte-pronta.mp4` (1080×1920, 30 fps, narração masculina em PT-BR + legendas sincronizadas).

---

## O que mudou em relação ao roteiro original

| Original | Versão melhorada | Por quê |
|---|---|---|
| Abre com “Antes de chegar nessa arte, eu preciso entender algumas coisas.” | Abre com **“Essa arte parece simples. Mas ela começou muito antes de eu abrir o arquivo.”** | Gancho com contraste e curiosidade nos 2 primeiros segundos. É isso que segura o scroll. |
| Perguntas soltas no meio do texto | **3 perguntas numeradas** (Mensagem · Público · Prioridade), cada uma com uma resposta real | Número concreto ajuda a reter e a salvar. As respostas mostram o método aplicado, não só a teoria. |
| “Essas respostas orientam a composição…” | Uma etapa nova: **organizar o texto e definir a hierarquia**, mostrada na tela | É o passo que quase ninguém mostra, e o que mais diferencia um designer. |
| Fecha com “É assim que começo os projetos por aqui.” | Frase de impacto: **“Design bom não começa no visual. Começa na mensagem.”** + CTA de salvar | Fecha com uma frase que dá para citar e pede uma ação que o algoritmo valoriza (salvamentos). |

---

## Roteiro (narração + tela)

| Tempo | Narração | Na tela |
|---|---|---|
| 0–2 s | Essa arte parece simples. | **Capa:** arte final + título “O que acontece *antes* da arte pronta.” |
| 2–4 s | Mas ela começou muito antes de eu abrir o arquivo. | “Rewind”: a arte se desmonta peça por peça até sobrar a prancheta vazia com o cursor piscando. |
| 4–8 s | Antes de desenhar qualquer coisa, eu respondo três perguntas. | Tipografia grande, com um **3** enorme em destaque. |
| 8–12 s | O que precisa ser comunicado? Para quem? E o que a pessoa precisa ver primeiro? | 3 cartões de briefing entram um a um, e a resposta de cada um é digitada. |
| 12–16 s | Com essas respostas, eu organizo o texto e defino a hierarquia. | Textos soltos e bagunçados se reorganizam e ganham tamanhos e números de 1 a 5. |
| 16–20 s | E aí elas guiam tudo: a composição, as cores e os destaques. | Construção da arte: grid → layout em cinza → cores → destaque na data. |
| 20–24 s | Design bom não começa no visual. Começa na mensagem. | Frase de impacto com “no visual” riscado e “mensagem” sublinhado. |
| 24–31 s | É assim que eu começo cada projeto por aqui. Salva esse vídeo pro seu próximo projeto. | A arte final volta, com o botão “Salva pro seu próximo projeto”. |

---

## Legenda pronta (post)

> Essa arte parece simples, mas a parte mais importante aconteceu antes de eu abrir o arquivo.
>
> Antes de desenhar, eu respondo 3 perguntas:
> 1️⃣ O que precisa ser comunicado?
> 2️⃣ Para quem?
> 3️⃣ O que a pessoa precisa ver primeiro?
>
> Nesse projeto, o objetivo era **[inserir o objetivo real da peça]**. Com isso definido, organizei o texto, montei a hierarquia e só depois escolhi composição, cores e destaques.
>
> Design bom não começa no visual. Começa na mensagem.
>
> 📌 Salva pra usar no seu próximo projeto.
>
> #designgrafico #processocriativo #briefing #designer #identidadevisual

---

## Observações
- A peça mostrada (“Mãos no barro”, oficina de cerâmica) é **fictícia**, feita para demonstrar o processo. Para usar um projeto real, troque os textos do pôster em `video.html` (classes `.p-*`) e as respostas dos cartões (cena S4).
- Para renderizar de novo: `node render.js` (precisa de Playwright e ffmpeg).
- A voz é “Elvis” (ElevenLabs, PT-BR), modelo multilingual v2. O arquivo é `voz.mp3`, e `words.json` traz o tempo de cada palavra para sincronizar as legendas.
- Sugestão: coloque uma trilha instrumental baixinha (em torno de −24 dB) no próprio app do Instagram.
