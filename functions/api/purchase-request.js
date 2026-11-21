const STUDIO_EMAIL = 'studio@vishnulalartist.com';
const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export function buildPurchaseEmail(data, artworks, audience = 'studio') {
  const collector = audience === 'collector';
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const price = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const total = price(artworks.reduce((sum, work) => sum + Number(work.priceUsd), 0));
  const reference = `VL-${data.requestId.slice(0, 8).toUpperCase()}`;
  const note = 'The studio will confirm availability, delivery charges and acquisition terms before payment. This enquiry does not reserve an artwork or confirm an order.';
  const title = collector ? 'Thank you for your interest.' : data.enquiry ? 'Artwork enquiry' : 'Artwork acquisition enquiry';
  const introduction = collector
    ? 'Thank you for your interest in the work of Vishnu Lal. We have received your artwork enquiry, and the studio will be in touch using the contact details you provided.'
    : data.enquiry ? `${data.name} has sent an enquiry about the following artwork.` : `${data.name} has expressed interest in acquiring the following original artwork${artworks.length === 1 ? '' : 's'}.`;
  const detailsHeading = collector ? 'YOUR DETAILS' : 'COLLECTOR DETAILS';
  const notesHeading = collector ? 'YOUR NOTE' : 'COLLECTOR’S NOTE';
  const text = [
    'VISHNU LAL STUDIO', title,
    ...(collector ? [`Dear ${data.name},`] : []), introduction,
    detailsHeading, `Name: ${data.name}`, ...(data.email ? [`Email: ${data.email}`] : []), ...(data.phone ? [`Phone: ${data.phone}`] : []),
    'SELECTED ARTWORKS', ...artworks.map((work) => `${work.artworkId}${work.seriesTitle ? ` · ${work.seriesTitle}` : ''}: ${price(work.priceUsd)} USD`),
    ...(data.enquiry ? ['ENQUIRY DETAILS', `Topic: ${data.topic}`, `Preferred contact: ${data.contact}`, ...(data.company ? [`Company / studio: ${data.company}`] : []), ...(data.country ? [`City / country: ${data.country}`] : [])] : [`Artwork total: ${total} USD`, 'DELIVERY DETAILS', `Country: ${data.country}`, data.address]),
    ...(data.notes ? [notesHeading, data.notes] : []),
    ...(collector ? ['If you have any questions in the meantime, simply reply to this email.', 'Warm regards,\nVishnu Lal Studio'] : []),
    note, ...(data.enquiry ? [] : ['Website policies acknowledged by the enquirer.']), `Reference: ${reference}`, 'Vishnu Lal Studio · studio@vishnulalartist.com · www.vishnulalartist.com',
  ].join('\n\n');
  const heading = (title) => `<h2 style="margin:30px 0 12px;font:600 11px Arial,sans-serif;letter-spacing:2px;color:#72695c">${title}</h2>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eeeae3;color:#34312c"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#faf8f3"><tr><td style="padding:32px 24px;font:16px/1.65 Georgia,serif">
    <p style="margin:0 0 26px;font:14px Georgia,serif;letter-spacing:3px">VISHNU LAL STUDIO</p>
    <h1 style="margin:0 0 16px;font:400 30px/1.2 Georgia,serif">${title}</h1>
    ${collector ? `<p>Dear ${escape(data.name)},</p>` : ''}<p>${escape(introduction)}</p>
    ${heading(detailsHeading)}<p>${escape(data.name)}${data.email ? `<br>${escape(data.email)}` : ''}${data.phone ? `<br>${escape(data.phone)}` : ''}</p>
    ${heading('SELECTED ARTWORKS')}<table width="100%" cellpadding="0" cellspacing="0" style="font:15px/1.5 Georgia,serif">${artworks.map((work) => `<tr><td style="padding:14px 0;border-top:1px solid #d8d0c4"><a href="https://www.vishnulalartist.com/artwork/${encodeURIComponent(work.artworkId)}" style="color:#34312c">${escape(work.artworkId)}</a>${work.seriesTitle ? `<br><span style="font-size:13px;color:#72695c">${escape(work.seriesTitle)}</span>` : ''}</td><td style="padding:14px 0 14px 12px;text-align:right;border-top:1px solid #d8d0c4">${price(work.priceUsd)} USD</td></tr>`).join('')}<tr><td style="padding-top:16px;border-top:1px solid #d8d0c4">Artwork total</td><td style="padding-top:16px;text-align:right;border-top:1px solid #d8d0c4"><strong>${total} USD</strong></td></tr></table>
    ${data.enquiry ? `${heading('ENQUIRY DETAILS')}<p>Topic: ${escape(data.topic)}<br>Preferred contact: ${escape(data.contact)}${data.company ? `<br>Company / studio: ${escape(data.company)}` : ''}${data.country ? `<br>City / country: ${escape(data.country)}` : ''}</p>` : `${heading('DELIVERY DETAILS')}<p>${escape(data.country)}<br>${escape(data.address).replace(/\n/g, '<br>')}</p>`}
    ${data.notes ? `${heading(notesHeading)}<p>${escape(data.notes).replace(/\n/g, '<br>')}</p>` : ''}
    ${collector ? '<p style="margin-top:28px">If you have any questions in the meantime, simply reply to this email.</p><p>Warm regards,<br>Vishnu Lal Studio</p>' : ''}
    <p style="margin-top:30px;padding-top:20px;border-top:1px solid #d8d0c4;font:12px/1.65 Arial,sans-serif;color:#72695c">${note}<br><br>${data.enquiry ? '' : 'Website policies acknowledged by the enquirer.<br>'}Reference: ${reference}</p>
    <p style="font:12px/1.65 Arial,sans-serif;color:#72695c">Vishnu Lal Studio<br><a style="color:inherit" href="mailto:studio@vishnulalartist.com">studio@vishnulalartist.com</a><br><a style="color:inherit" href="https://www.vishnulalartist.com">www.vishnulalartist.com</a></p>
    </td></tr></table></td></tr></table></body></html>`;
  return { subject: collector ? 'Your artwork enquiry | Vishnu Lal Studio' : data.enquiry ? 'Artwork enquiry | Vishnu Lal Studio' : 'Artwork acquisition enquiry | Vishnu Lal Studio', text, html };
}

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

export async function deliverRequest({ request, env }, validate = validatePurchaseRequest) {
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
  try { data = validate(input); } catch (error) { return json({ error: error.message }, 400); }
  if (!env.RESEND_API_KEY || !env.PURCHASE_FROM_EMAIL) return json({ error: 'Email delivery is not configured.' }, 503);
  try {
    // Read prices from the published catalogue, never from the browser's request.
    const query = '*[_type == "artwork" && !(_id in path("drafts.**")) && artworkId in $ids]{artworkId,priceUsd,status,"seriesTitle":series->title}';
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
    if (artworks.some((work) => !work || (data.enquiry ? !['published', 'soldOut'].includes(work.status) : work.status !== 'published' || !(Number(work.priceUsd) > 0)))) return json({ error: 'Artwork availability has changed. Please refresh the page.' }, 409);
    const deliveryKey = `${data.enquiry ? 'enquiry' : 'purchase'}-${data.requestId}`;
    const message = buildPurchaseEmail(data, artworks);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': deliveryKey },
      body: JSON.stringify({ from: env.PURCHASE_FROM_EMAIL, to: [STUDIO_EMAIL], ...(data.email ? { reply_to: data.email } : {}), ...message }),
    });
    const result = await response.json();
    if (!response.ok || !result.id) throw new Error('delivery');
    let confirmationSent = null;
    if (data.email) {
      try {
        const confirmation = await fetch('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(10000),
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `${deliveryKey}-collector` },
          body: JSON.stringify({ from: env.PURCHASE_FROM_EMAIL, to: [data.email], reply_to: STUDIO_EMAIL, ...buildPurchaseEmail(data, artworks, 'collector') }),
        });
        const receipt = await confirmation.json();
        confirmationSent = confirmation.ok && Boolean(receipt.id);
      } catch { confirmationSent = false; }
      if (!confirmationSent) console.error(JSON.stringify({ event: 'purchase_confirmation_failed', requestId: data.requestId }));
    }
    return json({ sent: true, confirmationSent, requestId: data.requestId });
  } catch {
    console.error(JSON.stringify({ event: 'purchase_request_failed', requestId: data.requestId }));
    return json({ error: 'Unable to deliver your request. Please try again.' }, 502);
  }
}

export const onRequestPost = context => deliverRequest(context);

export function onRequestGet() { return json({ error: 'Method not allowed.' }, 405); }
