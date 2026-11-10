import assert from 'node:assert/strict';
import { test } from 'node:test';
import { reply } from '../lib/assistant';
import type { AppState } from '../lib/types';

const state: AppState = {
  version: 1, onboarded: true, profile: { name: 'Sofia' },
  theme: { palette: 'perola', font: 'delicada' },
  assistant: { name: 'Lulu', avatar: '🐱', voice: 'doce', autoSpeak: false },
  items: [
    { id: 'a', name: 'Blusa', category: 'top', color: 'rosa', styles: ['escola', 'casual'], createdAt: 0 },
    { id: 'b', name: 'Jeans', category: 'bottom', color: 'jeans', styles: ['escola', 'casual'], createdAt: 0 },
  ],
  favorites: [], chat: [],
};

test('sinais de risco sempre orientam a falar com um adulto de confiança', () => {
  for (const msg of ['estão fazendo bullying comigo', 'tenho medo', 'um desconhecido falou comigo', 'me machucaram']) {
    assert.match(reply(msg, state).text, /adulto de confiança/, msg);
  }
});

test('tristeza recebe acolhimento', () => {
  assert.match(reply('to triste hoje', state).text, /especial/);
});

test('pedido com ocasião devolve looks', () => {
  const r = reply('o que eu visto pra escola?', state);
  assert.ok(r.outfits && r.outfits.length > 0);
});

test('"festa do pijama" não vira festa de aniversário', () => {
  const r = reply('vou numa festa do pijama', state);
  assert.match(r.text, /pijama/i);
});

test('pedido de look sem ocasião pergunta para onde vai', () => {
  const r = reply('me ajuda a montar um look', state);
  assert.ok(r.chips && r.chips.length >= 3);
});

test('usa o nome da menina e da ajudante', () => {
  assert.match(reply('oi', state).text, /Sofia/);
  assert.match(reply('qual seu nome?', state).text, /Lulu/);
});
