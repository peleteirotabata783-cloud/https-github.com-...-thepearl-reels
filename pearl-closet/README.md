# Pearl Closet 👗✨

App da **The Pearl** para meninas: um closet mágico onde ela guarda as próprias roupas,
personaliza o app com a cara dela e conversa com uma ajudante de moda que monta looks
para cada ocasião.

> Nome provisório. Antes de ir para a App Store, confirmar a marca e registrar o nome.

## O que já funciona (MVP)

| Recurso | Detalhes |
|---|---|
| **Boas-vindas** | Nome da menina → cor e letra do app → criação da ajudante |
| **Personalização total** | 6 paletas de cor (incluindo um modo escuro "Noite Glam") e 5 estilos de letra, que mudam o app inteiro na hora |
| **Ajudante** | Ela escolhe nome, carinha (12 avatares) e voz (Doce, Animada, Calma, Divertida), com prévia de áudio |
| **Closet** | Adiciona peças com foto (câmera/galeria) ou só pela cor; tipo, cor, estilos e se é quentinha; edita e apaga |
| **Looks** | 9 ocasiões (escola, aniversário, shopping, praia, casamento, jantar, dia frio, esporte, festa do pijama). O motor combina as peças por ocasião e harmonia de cores e explica o porquê |
| **Favoritos** | Coração em qualquer look, com a lista em uma aba própria |
| **Chat** | Conversa com a ajudante, que monta looks dentro do chat, dá dicas, conta piadas, lê as respostas em voz alta e sugere respostas rápidas |
| **Privacidade** | Tudo fica salvo **só no aparelho**. Nada vai para a internet. Botão para apagar todos os dados |
| **Segurança infantil** | Se a menina fala de bullying, medo ou desconhecidos, a ajudante sempre orienta a procurar um adulto de confiança (coberto por testes) |

## Tecnologia

- **Expo SDK 58 + React Native + TypeScript** — um código só para iOS, Android e web.
- **Expo Router** para navegação (`app/`).
- Lógica em `lib/`: `stylist.ts` (motor de looks), `assistant.ts` (cérebro do chat),
  `store.tsx` (estado + persistência), `themes.ts`, `catalog.ts`, `voice.ts`.
- Componentes visuais em `components/`.

## Rodar

```bash
cd pearl-closet
npm install
npx expo start        # abre no celular com o app Expo Go (QR code)
npm run build:web     # versão web em dist/
npm test              # testes do motor de looks e da ajudante
npm run typecheck
```

## Caminho até a App Store

1. **Conta Apple Developer** (US$ 99/ano) no nome da The Pearl.
2. `npx eas-cli@latest build -p ios` → `eas submit` (a build é feita na nuvem, sem precisar de Mac).
3. **Categoria Kids (Apple)** — se o público for menor de 13 anos:
   - sem anúncios de terceiros e sem analytics que identifiquem a criança;
   - *parental gate* (portão para os pais) antes de links externos e compras;
   - política de privacidade publicada (no site da The Pearl).
4. **LGPD / COPPA**: o MVP já não coleta dados pessoais (tudo é local). Manter assim
   ou exigir consentimento dos pais antes de qualquer recurso em nuvem.
5. Ícone, splash e capturas de tela da loja (próximo passo de design).

## Próximas fases (roadmap)

- **Voz premium (ElevenLabs)** e **chat com IA de verdade (Claude)**, sempre por meio de
  um **servidor próprio** com moderação e filtros para crianças. Nunca colocar chaves de
  API dentro do app.
- Remover o fundo das fotos das roupas automaticamente.
- Clima do dia → sugestão automática de look.
- Calendário de eventos ("sábado tem aniversário da Ana").
- Assinatura premium (temas exclusivos, mais vozes, closet ilimitado) via App Store.
- Área dos pais.
