# v2: versão feita para alcance
**Arquivo:** `antes-da-arte-pronta-v2.mp4` · 25,4 s · 1080×1920 · voz + trilha + efeitos sonoros

## O que mudou do v1 para o v2

| Ponto | v1 | v2 |
|---|---|---|
| **Gancho (0–4 s)** | “Essa arte parece simples.” | “Se você abre o arquivo antes de responder essas 3 perguntas, você **tá começando errado**.” Aparece o carimbo **✕ ERRADO** com a tela tremendo. |
| **Primeiro quadro** | Arte + título | Pergunta direta: *“Você abre o arquivo antes de pensar?”* Funciona como capa e segura o scroll. |
| **Duração** | 31 s | **25 s**, com narração 6% mais rápida. Vídeos mais curtos são revistos mais vezes. |
| **Prova visual** | Só a arte final | **Antes e depois**: um pôster “sem briefing” (tudo grita) que se transforma no pôster “com briefing”. É o formato mais compartilhado em conteúdo de design. |
| **Som** | Só a voz | Trilha lo-fi house que abaixa sozinha quando a voz fala, mais efeitos: clique, carimbo, whoosh nos cortes, digitação e “ding” no destaque. |
| **Final** | CTA simples | Antes e depois lado a lado + **“Salva pro próximo projeto”**. A última palavra é “arquivo” e a primeira do vídeo também é sobre o arquivo, então o vídeo **emenda em loop**. |

## Legenda do post

> Você abre o arquivo antes de pensar? 👀
>
> Antes de qualquer design, eu respondo 3 perguntas:
> 1️⃣ O que precisa ser comunicado?
> 2️⃣ Pra quem?
> 3️⃣ O que a pessoa precisa ver primeiro?
>
> Sem isso, tudo grita e nada comunica. Com isso, a hierarquia aparece sozinha.
>
> Design bom não começa no visual. Começa na mensagem.
>
> 📌 Salva pra lembrar antes do próximo arquivo
> 💬 Qual dessas 3 você mais esquece? Comenta o número.
>
> #designgrafico #designer #briefing #processocriativo #dicasdedesign

A pergunta “comenta o número” é de propósito: responder custa um clique, e cada comentário puxa o vídeo para mais gente.

## Plano de lançamento

1. **Teste antes:** publique primeiro como **Reel de teste** (“Trial Reels”, que mostra o vídeo só para quem não segue). Se ele segurar bem nas primeiras 24 h, publique para todos.
2. **Horário:** de terça a quinta, entre 18h e 21h, quando o público brasileiro mais usa o app.
3. **Primeira hora:** responder **todos** os comentários com uma pergunta de volta. Isso dobra o volume de comentários.
4. **Stories:** compartilhar nos Stories com uma enquete (“Você responde essas 3 perguntas? Sim / Nunca”).
5. **Collab:** marcar outro designer como colaborador, para o vídeo aparecer para as duas audiências.
6. **Série:** se funcionar, transformar em série (“Erro nº 2 de quem cria”…). O padrão gera seguidores, não só visualizações.

## Como medir se deu certo (primeiras 48 h)
- **Retenção nos 3 primeiros segundos acima de 60%**: o gancho funcionou.
- **Taxa de visualização completa acima de 40%**: o vídeo prende até o fim.
- **Salvamentos e compartilhamentos acima de 3% das visualizações**: esse é o sinal mais forte para o algoritmo empurrar o vídeo.

## Arquivos
- `video.html`: animação (cada cena sincronizada pelos tempos das palavras em `words.js`)
- `voz.wav` / `voz-orig.mp3`: narração (Elvis, ElevenLabs), acelerada 1,06×
- `musica.mp3`: trilha gerada no ElevenLabs Music, sem vocais
- `sfx.py`: gera os efeitos sonoros por síntese, sem samples de terceiros
- `render.js`: `node render.js` gera o MP4 final
- `capa-v2.png`: primeiro quadro, para usar como capa
