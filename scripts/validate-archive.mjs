import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const artworkIdPattern = /^VL-[A-Z]-\d{3}$/;
const derivativeWidths = [480, 900, 1440, 2400];
const expectedSeriesIIds = Array.from({ length: 16 }, (_, index) => `VL-A-${String(index + 1).padStart(3, '0')}`);
const expectedSeriesIIIds = Array.from({ length: 12 }, (_, index) => `VL-B-${String(index + 1).padStart(3, '0')}`);
const expectedPublicIds = [...expectedSeriesIIds, ...expectedSeriesIIIds];
const acquisitionStatuses = new Set(['AVAILABLE', 'ACQUIRED', 'NOT_CURRENTLY_AVAILABLE', null]);
const forbiddenFieldNames = new Set([
  'fci',
  'formalcomplexityindex',
  'registrar',
  'registrarnote',
  'internal',
  'research',
  'internalnote',
  'internalnotes',
  'workflownote',
  'workflownotes',
  'status',
]);
const allowedPublicRecordFields = new Set(['id', 'catalogue', 'formalObservation', 'curatorialObservation', 'acquisitionStatus']);
const errors = [];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

function fail(message) {
  errors.push(message);
}

function ensureUnique(values, label) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) fail(`${label} contains duplicate value(s): ${[...new Set(duplicates)].join(', ')}`);
}

function getArtworkSeries(id) {
  return indexArtworks.find((artwork) => artwork.id === id)?.seriesId ?? null;
}

function inspectPublicValue(value, path = '') {
  if (typeof value === 'string' && value.trim().toLowerCase() === 'to be assigned') {
    fail(`${path} contains the internal working title “To be assigned”`);
  }

  if (!value || typeof value !== 'object') return;

  for (const [key, nestedValue] of Object.entries(value)) {
    const keyPath = path ? `${path}.${key}` : key;
    if (forbiddenFieldNames.has(key.replace(/[^a-z]/gi, '').toLowerCase())) {
      fail(`${keyPath} is an internal-only field in a public record`);
    }
    inspectPublicValue(nestedValue, keyPath);
  }
}

const index = readJson('src/data/artworks-index.json');
const seriesData = readJson('src/data/series.json');
const seriesIManifest = readJson('src/data/series-i-master-manifest.json');
const sequence = readJson('src/data/homepage-sequence.json');
const knownIds = index.knownArtworkIds ?? [];
const publicIds = index.publicArtworkIds ?? [];
const indexArtworks = index.artworks ?? [];

ensureUnique(knownIds, 'knownArtworkIds');
ensureUnique(publicIds, 'publicArtworkIds');
ensureUnique(indexArtworks.map(({ id }) => id), 'artworks-index artwork IDs');
ensureUnique(seriesData.series.map(({ id }) => id), 'series IDs');

for (const id of expectedPublicIds) {
  if (!knownIds.includes(id)) fail(`Selected public artwork ${id} is missing from knownArtworkIds`);
  if (!publicIds.includes(id)) fail(`Selected public artwork ${id} is missing from publicArtworkIds`);
}

if (knownIds.length !== expectedPublicIds.length) fail(`Expected ${expectedPublicIds.length} known selected works, found ${knownIds.length}`);
if (publicIds.length !== expectedPublicIds.length) fail(`Expected ${expectedPublicIds.length} public selected works, found ${publicIds.length}`);

for (const seriesId of ['series-i', 'series-ii']) {
  if (!seriesData.series.some((series) => series.id === seriesId)) fail(`Missing required series record ${seriesId}`);
}

const manifestEntries = seriesIManifest.artworks ?? [];
ensureUnique(manifestEntries.map(({ id }) => id), 'Series I master manifest IDs');
ensureUnique(manifestEntries.map(({ source }) => source), 'Series I master manifest source files');

if (seriesIManifest.seriesId !== 'series-i') fail('Series I master manifest has an invalid series relation');
if (manifestEntries.length !== expectedSeriesIIds.length) fail(`Series I master manifest must contain exactly ${expectedSeriesIIds.length} mappings`);

for (const [index, entry] of manifestEntries.entries()) {
  const expectedId = expectedSeriesIIds[index];
  const expectedSourceNumber = String(index + 1).padStart(2, '0');
  if (entry.id !== expectedId) fail(`Series I manifest position ${index + 1} must map to ${expectedId}`);
  if (!new RegExp(`^${expectedSourceNumber}\\.(jpe?g)$`, 'i').test(entry.source)) {
    fail(`Series I manifest ${entry.id} must map to numeric source ${expectedSourceNumber}`);
  }
}

const seriesIMasterDirectory = join(root, seriesIManifest.mastersRoot);
const discoveredSeriesIMasters = readdirSync(seriesIMasterDirectory)
  .filter((filename) => /^(?:0[1-9]|1[0-6])\.jpe?g$/i.test(filename));

if (discoveredSeriesIMasters.length !== expectedSeriesIIds.length) {
  fail(`Expected exactly ${expectedSeriesIIds.length} numeric Series I masters, found ${discoveredSeriesIMasters.length}`);
}

for (const entry of manifestEntries) {
  if (!existsSync(join(seriesIMasterDirectory, entry.source))) fail(`Series I master is missing for ${entry.id}: ${entry.source}`);
}

for (const source of discoveredSeriesIMasters) {
  if (!manifestEntries.some((entry) => entry.source === source)) fail(`Unmapped numeric Series I master: ${source}`);
}

for (const id of knownIds) {
  if (!artworkIdPattern.test(id)) fail(`Malformed artwork ID: ${id}`);
  if (!indexArtworks.some((artwork) => artwork.id === id)) fail(`Known artwork ${id} has no index record`);
  for (const width of derivativeWidths) {
    const derivative = join(root, 'public', 'artworks', id, `${width}.webp`);
    if (!existsSync(derivative)) fail(`Missing ${width}w WebP derivative for ${id}`);
  }
}

for (const artwork of indexArtworks) {
  if (!knownIds.includes(artwork.id)) fail(`Index artwork ${artwork.id} is not listed in knownArtworkIds`);
  if (!Number.isInteger(artwork.width) || !Number.isInteger(artwork.height)) fail(`Index artwork ${artwork.id} has invalid intrinsic dimensions`);
  if (!seriesData.series.some((series) => series.id === artwork.seriesId)) fail(`Index artwork ${artwork.id} references unknown series ${artwork.seriesId}`);
  if (artwork.id.startsWith('VL-A-') && artwork.seriesId !== 'series-i') fail(`Series I artwork ${artwork.id} has invalid series relation`);
  if (artwork.id.startsWith('VL-B-') && artwork.seriesId !== 'series-ii') fail(`Series II artwork ${artwork.id} has invalid series relation`);
}

for (const seriesId of ['series-i', 'series-ii']) {
  const seriesPublicIds = indexArtworks
    .filter((artwork) => artwork.seriesId === seriesId && publicIds.includes(artwork.id))
    .map((artwork) => artwork.id);

  for (const [index, id] of seriesPublicIds.entries()) {
    const expectedPrevious = index > 0 ? seriesPublicIds[index - 1] : null;
    const expectedNext = index < seriesPublicIds.length - 1 ? seriesPublicIds[index + 1] : null;

    if (expectedPrevious && getArtworkSeries(expectedPrevious) !== seriesId) fail(`Previous artwork for ${id} crosses a series boundary`);
    if (expectedNext && getArtworkSeries(expectedNext) !== seriesId) fail(`Next artwork for ${id} crosses a series boundary`);
  }
}

const publicRecordDirectory = join(root, 'src', 'data', 'artworks');
const publicRecordIds = readdirSync(publicRecordDirectory)
  .filter((filename) => filename.endsWith('.json'))
  .map((filename) => filename.slice(0, -5));

ensureUnique(publicRecordIds, 'public record IDs');

for (const id of publicIds) {
  if (!knownIds.includes(id)) fail(`Public artwork ${id} is not a known artwork`);
  if (!publicRecordIds.includes(id)) fail(`Public artwork ${id} has no public record file`);
}

for (const id of publicRecordIds) {
  const record = readJson(`src/data/artworks/${id}.json`);
  if (!artworkIdPattern.test(id)) fail(`Malformed public record filename: ${id}`);
  if (record.id !== id) fail(`Public record ${id} has mismatched id ${record.id}`);
  if (!publicIds.includes(id)) fail(`Public record ${id} is not listed as public`);
  if (Object.hasOwn(record, 'title')) fail(`Public record ${id} must not contain a title field`);
  if (Object.hasOwn(record, 'acquisitionStatus') && !acquisitionStatuses.has(record.acquisitionStatus)) {
    fail(`Public record ${id} has invalid acquisitionStatus ${record.acquisitionStatus}`);
  }
  for (const key of Object.keys(record)) {
    if (!allowedPublicRecordFields.has(key)) fail(`Public record ${id} contains non-canonical field ${key}`);
  }
  inspectPublicValue(record, `public record ${id}`);
}

for (const step of sequence) {
  const referencedIds = step.artworkId ? [step.artworkId] : step.artworkIds ?? [];
  for (const id of referencedIds) {
    if (!knownIds.includes(id)) fail(`Homepage references nonexistent artwork ${id}`);
    if (!publicIds.includes(id) && !step.allowPending) {
      fail(`Homepage references unpublished artwork ${id} without allowPending`);
    }
  }
}

if (errors.length) {
  console.error('Archive validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Archive validation passed: ${knownIds.length} known works, ${publicIds.length} public record(s), ${derivativeWidths.length} derivatives per work.`);
