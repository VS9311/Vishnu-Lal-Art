import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { formatCataloguePrice, getCataloguePrice } from '../src/lib/cataloguePricing.js';

const index = JSON.parse(await readFile(new URL('../src/data/artworks-index.json', import.meta.url), 'utf8'));
const prices = index.publicArtworkIds.map((id) => getCataloguePrice(id));

assert.equal(prices.length, 29, 'Every public artwork must receive a catalogue price.');
assert.ok(prices.every((price) => price >= 2000 && price <= 3000), 'Catalogue prices must remain between $2,000 and $3,000.');
assert.ok(prices.every((price) => price % 50 === 0), 'Catalogue prices must use clean $50 increments.');
assert.equal(getCataloguePrice('VL-A-001'), getCataloguePrice('VL-A-001'), 'Catalogue prices must remain stable between visits.');
assert.match(formatCataloguePrice(2500), /^\$2,500$/, 'Catalogue prices must be formatted in USD.');

console.log('Catalogue pricing checks passed.');
