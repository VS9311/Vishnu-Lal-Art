import assert from 'node:assert/strict';
import { onRequestPost, validateArtworkEnquiry } from '../functions/api/artwork-enquiry.js';

const input = { name: 'Collector', email: 'collector@example.com', phone: '', location: '', company: '', topic: 'Framing', message: '', contact: 'email', artworkIds: ['THUNDU-075'], requestId: '12345678-1234-4234-8234-123456789012' };
assert.equal(validateArtworkEnquiry(input).country, '');
assert.throws(() => validateArtworkEnquiry({ ...input, email: '' }), /email/);
assert.throws(() => validateArtworkEnquiry({ ...input, contact: 'whatsapp' }), /WhatsApp/);
assert.throws(() => validateArtworkEnquiry({ ...input, contact: 'whatsapp', phone: 'abcdefg' }), /WhatsApp/);
const phoneOnly = { ...input, contact: 'whatsapp', email: '', phone: '+91 9188437736' };
assert.equal(validateArtworkEnquiry(phoneOnly).email, '');
const originalFetch = globalThis.fetch;
const messages = [];
const env = { RESEND_API_KEY: 'fake-key', PURCHASE_FROM_EMAIL: 'Studio <studio@example.com>' };
const send = data => onRequestPost({ request: new Request('https://example.com/api/artwork-enquiry', { method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' }, body: JSON.stringify(data) }), env });
try {
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('api.sanity.io')) return Response.json({ result: [{ artworkId: 'THUNDU-075', status: 'soldOut', priceUsd: 3900 }] });
    messages.push(JSON.parse(options.body));
    assert.ok(options.headers['Idempotency-Key'].startsWith('enquiry-'));
    return Response.json({ id: 'mock-id' });
  };
  assert.equal((await (await send(input)).json()).confirmationSent, true);
  assert.deepEqual(messages[0].to, ['studio@vishnulalartist.com']);
  assert.deepEqual(messages[1].to, [input.email]);
  assert.match(messages[0].text, /Preferred contact: email/);
  assert.ok(!messages[0].html.includes('DELIVERY DETAILS'));
  assert.match(messages[1].html, /Thank you for your interest/);
  assert.equal((await (await send(phoneOnly)).json()).confirmationSent, null);
  assert.equal(messages.length, 3);
  globalThis.fetch = async () => Response.json({ error: 'Unavailable' }, { status: 503 });
  assert.equal((await send(input)).status, 502);
} finally { globalThis.fetch = originalFetch; }
console.log('Enquiry contact requirements, optional fields, sold artwork enquiries, studio and collector emails, and failures passed. No emails sent.');
