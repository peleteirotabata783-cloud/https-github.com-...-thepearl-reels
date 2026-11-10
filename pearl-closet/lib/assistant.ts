/**
 * "Cérebro" da ajudante.
 *
 * Versão 1: regras locais, 100% offline e seguras para crianças — a ajudante
 * só fala de moda, autoestima e do closet. A interface `reply()` é o ponto de
 * troca para um modelo de IA no futuro (via servidor próprio com moderação;
 * nunca colocar chave de API dentro do app).
 */
import { CATEGORIES, EVENTS, eventOf } from './catalog';
import { generateOutfits } from './stylist';
import type { AppState, ChatMessage } from './types';
import { uid } from './id';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const EVENT_CHIPS = EVENTS.slice(0, 6).map((e) => `${e.emoji} ${e.label}`);

const TIPS = [
  'Quando estiver em dúvida, uma peça neutra (branco, preto, bege ou jeans) combina com qualquer cor! 🤍',
  'Acessórios mudam tudo: o mesmo look fica novo com um laço, uma tiara ou uma bolsinha diferente. 🎀',
  'Cores claras em cima e escuras embaixo deixam o look equilibrado. ✨',
  'Look todo de uma cor só (monocromático) é super tendência! 💗',
  'Para dias frios, use camadas: blusa + casaquinho, assim dá para tirar se esquentar. 🧥',
  'O melhor acessório de todos é o seu sorriso! 😊',
  'Estampa + peça lisa é a combinação mais fácil de acertar. 🌸',
];

const JOKES = [
  'Por que a calça foi ao médico? Porque estava com muitos bolsos... digo, problemas no zíper! 😂',
  'O que o sapato disse para a meia? "Você me completa!" 🧦👟',
  'Por que o casaco é tão educado? Porque ele sempre te acolhe! 🧥💕',
  'Qual é a roupa favorita do fantasma? O lençol de festa! 👻',
];

const SUPPORT_WORDS = ['triste', 'chateada', 'chorando', 'sozinha', 'ninguem gosta', 'feia'];
const SAFETY_WORDS = ['bullying', 'machuc', 'me bate', 'medo', 'ameaca', 'segredo', 'desconhecid', 'pessoa estranha'];

export function reply(input: string, state: AppState): ChatMessage {
  const t = norm(input);
  const { assistant, profile, items, favorites } = state;
  const girl = profile.name || 'amiga';
  const msg = (text: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
    id: uid(),
    from: 'assistant',
    text,
    createdAt: Date.now(),
    ...extra,
  });

  // 1) Segurança e bem-estar vêm sempre primeiro
  if (SAFETY_WORDS.some((w) => t.includes(w))) {
    return msg(
      `${girl}, obrigada por me contar. 💗 Isso é importante: fale agora com seus pais, responsáveis ou um adulto de confiança. Eles podem te ajudar de verdade. Você não está sozinha!`,
    );
  }
  if (SUPPORT_WORDS.some((w) => t.includes(w))) {
    return msg(
      `Ah, ${girl}, sinto muito que você esteja se sentindo assim. 🫂 Você é especial do jeitinho que é! Que tal conversar com alguém da sua família? E se quiser, eu monto um look bem alegre para animar seu dia.`,
      { chips: ['🌼 Monta um look alegre', '💡 Me dá uma dica'] },
    );
  }

  // 2) Evento → montar looks
  const ev =
    EVENTS.find((e) => t.includes(norm(e.label))) ?? EVENTS.find((e) => e.keywords.some((k) => t.includes(k)));
  const wantsLook = /look|roupa|vestir|combina|usar|montar|monta|alegre/.test(t);
  if (ev || /alegre/.test(t)) {
    const eventKey = ev?.key ?? 'shopping';
    const res = generateOutfits(items, eventKey, { count: 2, seed: Date.now() });
    if (!res.ok) {
      return msg(`${res.missing} Toque em "Closet" e adicione suas roupas que eu faço a mágica! ✨`);
    }
    const e = eventOf(eventKey);
    return msg(
      pick([
        `Uhuul, ${e.label.toLowerCase()}! ${e.emoji} Separei essas ideias para você:`,
        `Já sei! Para ${e.label.toLowerCase()} eu escolheria estes looks ${e.emoji}`,
        `Olha só o que eu montei com as suas roupas, ${girl}:`,
      ]),
      { outfits: res.outfits, chips: ['🔁 Outra ideia para ' + e.label, '💡 Me dá uma dica'] },
    );
  }
  if (wantsLook) {
    return msg(`Claro, ${girl}! Para onde você vai? 💃`, { chips: EVENT_CHIPS });
  }

  // 3) Conversa geral
  if (/^(oi|ola|oie|eai|e ai|hey|bom dia|boa tarde|boa noite)\b/.test(t)) {
    return msg(
      `Oi, ${girl}! ${assistant.avatar} Que bom te ver! Quer que eu monte um look ou prefere uma dica de moda?`,
      { chips: ['👗 Monta um look', '💡 Me dá uma dica', '😂 Conta uma piada'] },
    );
  }
  if (/quem e voce|seu nome|como voce chama/.test(t)) {
    return msg(
      `Eu sou a ${assistant.name}, sua ajudante de moda! ${assistant.avatar} Eu conheço todas as roupas do seu closet e adoro montar looks para você.`,
    );
  }
  if (/quantas|meu closet|minhas roupas|guarda.?roupa/.test(t)) {
    if (!items.length) return msg('Seu closet ainda está vazio! Vamos adicionar sua primeira peça? 👚');
    const parts = CATEGORIES.map((c) => ({ c, n: items.filter((i) => i.category === c.key).length }))
      .filter((x) => x.n)
      .map((x) => `${x.c.emoji} ${x.n} ${x.c.label.toLowerCase()}`);
    return msg(`Você tem ${items.length} peças: ${parts.join(', ')}. Que closet lindo! 💖`);
  }
  if (/favorit/.test(t)) {
    return msg(
      favorites.length
        ? `Você tem ${favorites.length} look${favorites.length > 1 ? 's' : ''} favorito${favorites.length > 1 ? 's' : ''}! Veja na aba Favoritos ⭐`
        : 'Você ainda não favoritou nenhum look. Quando gostar de um, é só tocar no coração! 💗',
    );
  }
  if (/dica|ajuda|conselho/.test(t)) return msg(pick(TIPS), { chips: ['💡 Outra dica', '👗 Monta um look'] });
  if (/piada|engracad|rir/.test(t)) return msg(pick(JOKES), { chips: ['😂 Mais uma', '👗 Monta um look'] });
  if (/obrigad|valeu|amei|adorei|lind/.test(t))
    return msg(pick([`De nada, ${girl}! 💕`, 'Fico feliz que gostou! ✨', 'Você vai arrasar! 👑']));
  if (/tchau|ate mais|boa noite/.test(t)) return msg(`Tchauzinho, ${girl}! Até a próxima! 👋💖`);
  if (/mais uma|outra/.test(t)) return msg(pick([...JOKES, ...TIPS]));

  return msg(
    `Hmm, ainda estou aprendendo essa! 🤔 Mas posso te ajudar a escolher uma roupa, dar dicas ou contar uma piada.`,
    { chips: ['👗 Monta um look', '💡 Me dá uma dica', '🧺 Meu closet'] },
  );
}

export function welcomeMessage(state: AppState): ChatMessage {
  return {
    id: uid(),
    from: 'assistant',
    text: `Oi, ${state.profile.name || 'amiga'}! Eu sou a ${state.assistant.name} ${state.assistant.avatar}. Me conta: para onde você vai hoje?`,
    chips: EVENT_CHIPS,
    createdAt: Date.now(),
  };
}
