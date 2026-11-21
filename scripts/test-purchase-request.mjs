import assert from 'node:assert/strict';
import { onRequestPost, validatePurchaseRequest } from '../functions/api/purchase-request.js';

const base = { name: 'Test Collector', email: 'collector@example.com', phone: '', country: 'India', address: 'Test delivery address', notes: '', website: '', 'policy-consent': 'on', artworkIds: ['THUNDU-075'], requestId: '12345678-1234-4234-8234-123456789012' };
assert.equal(validatePurchaseRequest(base).notes, '');
assert.equal(validatePurchaseRequest({ ...base, email: '', phone: '+91 0000000000' }).email, '');
assert.throws(() => validatePurchaseRequest({ ...base, email: '' }), /email address or phone/);
assert.throws(() => validatePurchaseRequest({ ...base, address: '  ' }), /address/);
assert.throws(() => validatePurchaseRequest({ ...base, email: 'invalid' }), /email/);
assert.throws(() => validatePurchaseRequest({ ...base, 'policy-consent': '' }), /Policy/);
const request = (input = base, origin = 'https://example.com') => new Request('https://example.com/api/purchase-request', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
assert.equal((await onRequestPost({ request: request(base, 'https://other.example'), env: {} })).status, 403);
assert.equal((await onRequestPost({ request: request(), env: {} })).status, 503);
assert.equal((await onRequestPost({ request: request({ ...base, website: 'spam' }), env: {} })).status, 400);

const originalFetch = globalThis.fetch;
const env = { RESEND_API_KEY: 'test-key-not-real', PURCHASE_FROM_EMAIL: 'Test <test@example.com>' };
try {
  let email;
  globalThis.fetch = async (url, options) => {
    if (String(url).startsWith('https://2gtua40d.api.sanity.io/')) return Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'published' }] });
    assert.equal(url, 'https://api.resend.com/emails');
    email = JSON.parse(options.body);
    assert.equal(options.headers['Idempotency-Key'], `purchase-${base.requestId}`);
    return Response.json({ id: 'fake-message-id' });
  };
  assert.deepEqual(await (await onRequestPost({ request: request(), env })).json(), { sent: true, requestId: base.requestId });
  assert.deepEqual(email.to, ['studio@vishnulalartist.com']);
  assert.equal(email.reply_to, base.email);
  assert.match(email.text, /THUNDU-075: \$3,900 USD/);
  assert.match(email.text, /Notes: None/);
  await onRequestPost({ request: request({ ...base, email: '', phone: '+91 0000000000' }), env });
  assert.equal(email.reply_to, undefined);
  globalThis.fetch = async () => Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'soldOut' }] });
  assert.equal((await onRequestPost({ request: request(), env })).status, 409);
  globalThis.fetch = async (url) => String(url).includes('api.sanity.io')
    ? Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'published' }] })
    : Response.json({ error: 'Unavailable' }, { status: 503 });
  assert.equal((await onRequestPost({ request: request(), env })).status, 502);
} finally { globalThis.fetch = originalFetch; }
console.log('Purchase-request validation, fixed recipient, authoritative prices, retry key and failure handling passed. No emails sent.');
