const MINIMUM_PRICE_USD = 2000;
const PRICE_STEP_USD = 50;
const PRICE_POINT_COUNT = 21;
const priceOverrides = new Map();

export function setCataloguePriceOverrides(entries) {
  priceOverrides.clear();
  entries.forEach(([artworkId, amount]) => {
    if (artworkId && Number.isFinite(Number(amount)) && Number(amount) > 0) priceOverrides.set(artworkId, Number(amount));
  });
}

export function getCataloguePrice(artworkId) {
  if (priceOverrides.has(artworkId)) return priceOverrides.get(artworkId);
  let hash = 17;
  for (const character of artworkId) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
  return MINIMUM_PRICE_USD + ((hash % PRICE_POINT_COUNT) * PRICE_STEP_USD);
}

export function formatCataloguePrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
