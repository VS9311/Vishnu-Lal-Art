const STUDIO_EMAIL = 'studio@vishnulalartist.com';
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export function validatePurchaseRequest(input) {
  if (!input || typeof input !== 'object') throw new Error('Invalid request.');
  const text = (key, max, required = false) => {
    if (typeof input[key] !== 'string') throw new Error(`Invalid ${key}.`);
    const value = input[key].trim();
    if (value.length > max || (required && !value)) throw new Error(`Invalid ${key}.`);
    return value;
  };
  const data = {
    name: text('name', 160, true), email: text('email', 254), phone: text('phone', 80),
    country: text('country', 160, true), address: text('address', 2000, true), notes: text('notes', 3000),
  };
  if (!data.email && !data.phone) throw new Error('Provide an email address or phone number.');
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Invalid email.');
  if (input['policy-consent'] !== 'on') throw new Error('Policy acknowledgement is required.');
  if (typeof input.requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(input.requestId)) throw new Error('Invalid request ID.');
  if (!Array.isArray(input.artworkIds) || !input.artworkIds.length || input.artworkIds.length > 30
    || input.artworkIds.some((id) => typeof id !== 'string' || !id.trim() || id.length > 100 || /[\r\n]/.test(id))) throw new Error('Invalid artwork selection.');
  return { ...data, requestId: input.requestId, artworkIds: [...new Set(input.artworkIds)] };
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'JSON required.' }, 415);
  let input;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Empty request.' }, 400);
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 20000) { await reader.cancel(); return json({ error: 'Request too large.' }, 413); }
      chunks.push(value);
    }
    input = JSON.parse(await new Blob(chunks).text());
  } catch { return json({ error: 'Invalid request.' }, 400); }
  if (input?.website) return json({ error: 'Unable to submit request.' }, 400);
  let data;
  try { data = validatePurchaseRequest(input); } catch (error) { return json({ error: error.message }, 400); }
  if (!env.RESEND_API_KEY || !env.PURCHASE_FROM_EMAIL) return json({ error: 'Email delivery is not configured.' }, 503);
  try {
    // Read prices from the published catalogue, never from the browser's request.
    const query = '*[_type == "artwork" && !(_id in path("drafts.**")) && artworkId in $ids]{artworkId,priceUsd,status}';
    const project = env.SANITY_PROJECT_ID || '2gtua40d';
    const dataset = env.SANITY_DATASET || 'staging';
    const url = new URL(`https://${project}.api.sanity.io/v2026-11-07/data/query/${dataset}`);
    url.searchParams.set('query', query);
    url.searchParams.set('$ids', JSON.stringify(data.artworkIds));
    const catalogueResponse = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!catalogueResponse.ok) throw new Error('catalogue');
    const catalogue = (await catalogueResponse.json()).result;
    if (!Array.isArray(catalogue)) throw new Error('catalogue');
    const artworks = data.artworkIds.map((id) => catalogue.find((work) => work.artworkId === id));
    if (artworks.some((work) => !work || work.status !== 'published' || !(Number(work.priceUsd) > 0))) return json({ error: 'Artwork availability has changed. Please refresh your cart.' }, 409);
    const price = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    const hostname = new URL(request.url).hostname;
    const preview = hostname.endsWith('.pages.dev') && hostname !== 'vishnu-lal-art.pages.dev';
    const text = [
      ...(preview ? ['TEST PREVIEW REQUEST — for delivery verification only. Do not process as an order.'] : []),
      `Purchase request ${data.requestId}`, `Name: ${data.name}`, `Email: ${data.email || 'Not provided'}`,
      `Phone: ${data.phone || 'Not provided'}`, `Country: ${data.country}`, `Delivery address:\n${data.address}`,
      'Selected artworks:', ...artworks.map((work) => `${work.artworkId}: ${price(work.priceUsd)} USD`),
      `Artwork total: ${price(artworks.reduce((sum, work) => sum + Number(work.priceUsd), 0))} USD`,
      `Notes: ${data.notes || 'None'}`, 'Customer acknowledged the website policies.',
      'This is a purchase enquiry, not a paid or accepted order. Confirm availability, shipping and terms before requesting payment.',
    ].join('\n\n');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `purchase-${data.requestId}` },
      body: JSON.stringify({ from: env.PURCHASE_FROM_EMAIL, to: [STUDIO_EMAIL], ...(data.email ? { reply_to: data.email } : {}), subject: `${preview ? '[TEST] ' : ''}Artwork purchase request — ${data.requestId}`, text }),
    });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error('delivery');
    return json({ sent: true, requestId: data.requestId });
  } catch {
    console.error(JSON.stringify({ event: 'purchase_request_failed', requestId: data.requestId }));
    return json({ error: 'Unable to deliver your request. Please try again.' }, 502);
  }
}

export function onRequestGet() { return json({ error: 'Method not allowed.' }, 405); }
