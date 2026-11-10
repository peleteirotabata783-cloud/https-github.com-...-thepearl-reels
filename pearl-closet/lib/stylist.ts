/**
 * Motor de combinações ("stylist").
 *
 * Roda 100% no aparelho: nenhuma foto ou peça sai do celular.
 * Pontua cada combinação por (1) adequação ao evento e (2) harmonia de cores,
 * e devolve as melhores, variadas entre si.
 */
import { categoryOf, colorOf, eventOf, type EventDef } from './catalog';
import type { CategoryKey, ClothingItem, Outfit } from './types';

const GOOD_PAIRS: [string, string][] = [
  ['rosa', 'marinho'],
  ['rosaclaro', 'lilas'],
  ['rosaclaro', 'menta'],
  ['rosaclaro', 'azulclaro'],
  ['lilas', 'menta'],
  ['azul', 'amarelo'],
  ['marinho', 'amarelo'],
  ['marinho', 'vermelho'],
  ['laranja', 'azul'],
  ['roxo', 'amarelo'],
  ['verde', 'rosaclaro'],
  ['rosa', 'lilas'],
  ['azulclaro', 'amarelo'],
];

const CLASHES: [string, string][] = [
  ['verde', 'vermelho'],
  ['laranja', 'roxo'],
  ['estampado', 'estampado'],
  ['vermelho', 'roxo'],
];

const pairIn = (list: [string, string][], a: string, b: string) =>
  list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/** Harmonia entre duas cores, de -2 (não combina) a 3 (combina muito). */
export function harmony(a: string, b: string): number {
  if (pairIn(CLASHES, a, b)) return -2;
  if (pairIn(GOOD_PAIRS, a, b)) return 3;
  const fa = colorOf(a).family;
  const fb = colorOf(b).family;
  if (fa === 'neutro' || fb === 'neutro') return 2;
  if (fa === 'metal' || fb === 'metal') return 2;
  if (a === b) return 1.5;
  if (fa === 'estampa' || fb === 'estampa') return 0;
  if (fa === fb) return 1;
  return 0;
}

export function harmonyPhrase(a: string, b: string): string {
  const ca = colorOf(a);
  const cb = colorOf(b);
  if (pairIn(GOOD_PAIRS, a, b)) return `${ca.label} com ${cb.label.toLowerCase()} é uma dupla linda`;
  if (ca.family === 'estampa' || cb.family === 'estampa')
    return 'a estampa brilha e a outra peça deixa tudo equilibrado';
  if (ca.family === 'neutro' && cb.family === 'neutro') return 'tons neutros deixam o look chique e fácil';
  if (ca.family === 'neutro' || cb.family === 'neutro')
    return `o ${(ca.family === 'neutro' ? ca : cb).label.toLowerCase()} combina com tudo e destaca a outra cor`;
  if (a === b) return `look todo em ${ca.label.toLowerCase()} é super tendência`;
  if (ca.family === cb.family) return 'as cores são da mesma família e ficam harmoniosas';
  return 'uma combinação ousada e cheia de personalidade';
}

function styleScore(item: ClothingItem, ev: EventDef): number {
  let s = 0;
  ev.styles.forEach((st, i) => {
    if (item.styles.includes(st)) s += i === 0 ? 4 : 2;
  });
  if (ev.cold && item.warm) s += 3;
  if (ev.key === 'praia' && item.warm) s -= 4;
  if (!ev.cold && item.warm && item.category === 'outerwear') s -= 3;
  // peça que não tem nada a ver com a ocasião perde muitos pontos
  if (!item.styles.some((st) => ev.styles.includes(st))) s -= 5;
  return s;
}

const byCat = (items: ClothingItem[], c: CategoryKey) => items.filter((i) => i.category === c);

export const outfitId = (ids: string[]) => [...ids].sort().join('+');

export type GenerateResult =
  | { ok: true; outfits: Outfit[] }
  | { ok: false; missing: string };

export function generateOutfits(
  items: ClothingItem[],
  eventKey: string,
  opts: { count?: number; seed?: number } = {},
): GenerateResult {
  const ev = eventOf(eventKey);
  const count = opts.count ?? 3;
  let seed = opts.seed ?? 1;
  const rand = () => {
    // PRNG determinístico (mulberry32) para "outra ideia" variar sem ser caótico
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const tops = byCat(items, 'top');
  const bottoms = byCat(items, 'bottom');
  const dresses = byCat(items, 'dress');

  type Base = { pieces: ClothingItem[]; score: number };
  const bases: Base[] = [];

  for (const t of tops)
    for (const b of bottoms)
      bases.push({
        pieces: [t, b],
        score: styleScore(t, ev) + styleScore(b, ev) + harmony(t.color, b.color) * 1.5,
      });
  for (const d of dresses) bases.push({ pieces: [d], score: styleScore(d, ev) * 2 + 2 });

  if (bases.length === 0) {
    return {
      ok: false,
      missing:
        'Preciso de pelo menos uma blusa e uma calça/saia, ou um vestido, no seu closet para montar um look.',
    };
  }

  const addBest = (base: ClothingItem[], cat: CategoryKey) => {
    // só entram peças que combinam com a ocasião
    const opts2 = byCat(items, cat).filter((o) => styleScore(o, ev) > 0);
    if (!opts2.length) return { piece: undefined as ClothingItem | undefined, score: 0 };
    let best: ClothingItem | undefined;
    let bestScore = -Infinity;
    for (const o of opts2) {
      const h = base.reduce((acc, p) => acc + harmony(p.color, o.color), 0) / base.length;
      const sc = styleScore(o, ev) + h + rand() * 1.5;
      if (sc > bestScore) {
        bestScore = sc;
        best = o;
      }
    }
    return { piece: best, score: bestScore };
  };

  const scored = bases
    .map((b) => ({ ...b, score: b.score + rand() * 3 }))
    .sort((a, b) => b.score - a.score);

  const result: Outfit[] = [];
  const usage = new Map<string, number>();

  for (const base of scored) {
    if (result.length >= count) break;
    // diversidade: evita repetir a mesma peça principal muitas vezes
    if (base.pieces.some((p) => (usage.get(p.id) ?? 0) >= 1) && scored.length > count * 2) continue;

    const pieces = [...base.pieces];
    const shoes = addBest(pieces, 'shoes').piece;
    if (shoes) pieces.push(shoes);
    if (!ev.noOuterwear) {
      const coat = addBest(pieces, 'outerwear');
      const fits = coat.piece && (ev.cold || coat.piece.styles.includes(ev.styles[0]));
      if (coat.piece && fits) pieces.push(coat.piece);
    }
    const acc = addBest(pieces, 'accessory');
    if (acc.piece) pieces.push(acc.piece);
    const bag = addBest(pieces, 'bag');
    if (bag.piece && ev.key !== 'esporte' && ev.key !== 'pijama') pieces.push(bag.piece);

    const id = outfitId(pieces.map((p) => p.id));
    if (result.some((r) => r.id === id)) continue;
    base.pieces.forEach((p) => usage.set(p.id, (usage.get(p.id) ?? 0) + 1));

    result.push({
      id,
      itemIds: pieces.map((p) => p.id),
      eventKey: ev.key,
      reason: buildReason(pieces, ev),
      createdAt: Date.now(),
    });
  }

  return { ok: true, outfits: result };
}

function buildReason(pieces: ClothingItem[], ev: EventDef): string {
  const [a, b] = pieces;
  const twoPiece = b?.category === 'bottom';
  const main = twoPiece
    ? `${cap(a.name)} + ${b.name.toLowerCase()}: ${harmonyPhrase(a.color, b.color)}.`
    : `${cap(a.name)}: um vestido resolve o look inteiro!`;
  const extras = pieces.slice(twoPiece ? 2 : 1);
  const extraTxt = extras.length
    ? ` Finalize com ${extras.map((p) => `${categoryOf(p.category).emoji} ${p.name.toLowerCase()}`).join(', ')}.`
    : '';
  const tail = ev.cold ? ' Quentinho e estiloso!' : ` Perfeito para ${ev.label.toLowerCase()} ${ev.emoji}`;
  return main + extraTxt + tail;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
