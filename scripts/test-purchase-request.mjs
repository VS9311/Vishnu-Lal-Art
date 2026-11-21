import assert from 'node:assert/strict';
import { buildPurchaseEmail, onRequestPost, validatePurchaseRequest } from '../functions/api/purchase-request.js';

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
  const sentMessages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url).startsWith('https://2gtua40d.api.sanity.io/')) return Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'published' }] });
    assert.equal(url, 'https://api.resend.com/emails');
    email = JSON.parse(options.body);
    sentMessages.push(email);
    assert.equal(options.headers['Idempotency-Key'], `purchase-${base.requestId}${email.subject.startsWith('Your artwork') ? '-collector' : ''}`);
    return Response.json({ id: 'fake-message-id' });
  };
  assert.deepEqual(await (await onRequestPost({ request: request(), env })).json(), { sent: true, confirmationSent: true, requestId: base.requestId });
  assert.equal(sentMessages.length, 2);
  const collectorEmail = sentMessages[1];
  assert.deepEqual(collectorEmail.to, [base.email]);
  assert.equal(collectorEmail.reply_to, 'studio@vishnulalartist.com');
  assert.equal(collectorEmail.subject, 'Your artwork enquiry | Vishnu Lal Studio');
  assert.match(collectorEmail.text, /Dear Test Collector/);
  assert.match(collectorEmail.html, /Thank you for your interest/);
  assert.match(collectorEmail.text, /does not reserve an artwork or confirm an order/);
  email = sentMessages[0];
  assert.deepEqual(email.to, ['studio@vishnulalartist.com']);
  assert.equal(email.reply_to, base.email);
  assert.match(email.text, /THUNDU-075: \$3,900 USD/);
  assert.equal(email.subject, 'Artwork acquisition enquiry | Vishnu Lal Studio');
  assert.ok(!email.subject.includes(base.requestId));
  assert.ok(!email.text.includes('COLLECTOR’S NOTE'));
  assert.match(email.html, /SELECTED ARTWORKS/);
  const escapedMessage = buildPurchaseEmail({ ...base, name: '<script>bad</script>', notes: '<img src=x onerror=alert(1)>', address: 'Line one\nLine two' }, [{ artworkId: 'THUNDU-075', seriesTitle: 'Aalolam', priceUsd: 3900 }]);
  assert.ok(!escapedMessage.html.includes('<script>'));
  assert.ok(!escapedMessage.html.includes('<img'));
  assert.match(escapedMessage.html, /&lt;script&gt;/);
  assert.match(escapedMessage.html, /Line one<br>Line two/);
  assert.ok(!escapedMessage.text.includes('Preview submission'));
  assert.ok(!escapedMessage.html.includes('testing only'));
  assert.ok(!buildPurchaseEmail(base, [{ artworkId: 'THUNDU-075', priceUsd: 3900 }]).text.includes('Preview submission'));
  const phoneResponse = await onRequestPost({ request: request({ ...base, email: '', phone: '+91 0000000000' }), env });
  assert.equal((await phoneResponse.json()).confirmationSent, null);
  assert.equal(sentMessages.length, 3);
  assert.equal(email.reply_to, undefined);
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('api.sanity.io')) return Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'published' }] });
    return JSON.parse(options.body).subject.startsWith('Your artwork') ? Response.json({ error: 'Unavailable' }, { status: 503 }) : Response.json({ id: 'studio-message' });
  };
  const partial = await onRequestPost({ request: request(), env });
  assert.equal(partial.status, 200);
  assert.deepEqual(await partial.json(), { sent: true, confirmationSent: false, requestId: base.requestId });
  globalThis.fetch = async () => Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'soldOut' }] });
  assert.equal((await onRequestPost({ request: request(), env })).status, 409);
  globalThis.fetch = async (url) => String(url).includes('api.sanity.io')
    ? Response.json({ result: [{ artworkId: 'THUNDU-075', priceUsd: 3900, status: 'published' }] })
    : Response.json({ error: 'Unavailable' }, { status: 503 });
  assert.equal((await onRequestPost({ request: request(), env })).status, 502);
} finally { globalThis.fetch = originalFetch; }
console.log('Purchase-request validation, fixed recipient, authoritative prices, retry key and failure handling passed. No emails sent.');
