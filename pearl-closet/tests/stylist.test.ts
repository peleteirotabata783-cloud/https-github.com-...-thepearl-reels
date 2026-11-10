import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateOutfits, harmony } from '../lib/stylist';
import type { ClothingItem } from '../lib/types';

let n = 0;
const item = (p: Partial<ClothingItem> & Pick<ClothingItem, 'category' | 'color' | 'styles'>): ClothingItem => ({
  id: `i${++n}`, name: p.category + n, createdAt: 0, ...p,
});

const closet = [
  item({ name: 'Blusa de laço', category: 'top', color: 'rosa', styles: ['casual', 'escola'] }),
  item({ name: 'Blusa brilho', category: 'top', color: 'prata', styles: ['festa'] }),
  item({ name: 'Jeans', category: 'bottom', color: 'jeans', styles: ['casual', 'escola'] }),
  item({ name: 'Saia tule', category: 'bottom', color: 'lilas', styles: ['festa', 'elegante'] }),
  item({ name: 'Vestido', category: 'dress', color: 'estampado', styles: ['festa', 'elegante'] }),
  item({ name: 'Moletom', category: 'outerwear', color: 'cinza', styles: ['casual', 'conforto'], warm: true }),
  item({ name: 'Tênis', category: 'shoes', color: 'branco', styles: ['casual', 'escola', 'esportivo'] }),
  item({ name: 'Sapatilha', category: 'shoes', color: 'rosaclaro', styles: ['festa', 'elegante'] }),
  item({ name: 'Tiara', category: 'accessory', color: 'branco', styles: ['festa', 'elegante'] }),
];
const byId = (id: string) => closet.find((i) => i.id === id)!;

test('harmonia: neutros combinam, pares clássicos pontuam alto, choques são negativos', () => {
  assert.ok(harmony('preto', 'rosa') >= 2);
  assert.equal(harmony('rosa', 'marinho'), 3);
  assert.ok(harmony('verde', 'vermelho') < 0);
});

test('closet vazio explica o que falta', () => {
  const r = generateOutfits([], 'escola');
  assert.equal(r.ok, false);
});

for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
  test(`festa (seed ${seed}): sem moletom e com peças de festa`, () => {
    const r = generateOutfits(closet, 'aniversario', { seed });
    assert.ok(r.ok);
    for (const o of r.outfits) {
      const names = o.itemIds.map((id) => byId(id).name);
      assert.ok(!names.includes('Moletom'), names.join(','));
      assert.equal(new Set(o.itemIds).size, o.itemIds.length, 'sem peças repetidas');
    }
    const first = r.outfits[0].itemIds.map(byId);
    assert.ok(first.some((p) => p.styles.includes('festa')), 'o melhor look é de festa');
  });
  test(`escola (seed ${seed}): sem tiara nem sapatilha de festa`, () => {
    const r = generateOutfits(closet, 'escola', { seed });
    assert.ok(r.ok);
    const names = r.outfits[0].itemIds.map((id) => byId(id).name);
    assert.ok(!names.includes('Tiara') && !names.includes('Sapatilha'), names.join(','));
  });
}

test('dia frio inclui casaco quentinho', () => {
  const r = generateOutfits(closet, 'frio');
  assert.ok(r.ok && r.outfits[0].itemIds.map(byId).some((p) => p.warm));
});

test('looks têm ids estáveis (para favoritar) e explicação', () => {
  const r = generateOutfits(closet, 'shopping', { seed: 3 });
  assert.ok(r.ok);
  for (const o of r.outfits) {
    assert.equal(o.id, [...o.itemIds].sort().join('+'));
    assert.ok(o.reason.length > 20);
  }
});
