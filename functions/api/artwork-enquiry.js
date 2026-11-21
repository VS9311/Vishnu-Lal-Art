import { deliverRequest, validatePurchaseRequest } from './purchase-request.js';

export function validateArtworkEnquiry(input) {
  if (!input || !['email', 'whatsapp'].includes(input.contact)) throw new Error('Choose a contact method.');
  const fields = {};
  for (const [key, max] of [['location', 160], ['company', 160], ['topic', 160], ['message', 2000]]) {
    if (typeof input[key] !== 'string' || input[key].trim().length > max) throw new Error(`Invalid ${key}.`);
    fields[key] = input[key].trim();
  }
  if (input.contact === 'email' && !input.email?.trim()) throw new Error('Provide your email address.');
  if (input.contact === 'whatsapp' && (typeof input.phone !== 'string' || input.phone.replace(/\D/g, '').length < 7)) throw new Error('Provide your WhatsApp number, including country code.');
  if (!Array.isArray(input.artworkIds) || input.artworkIds.length !== 1) throw new Error('Choose one artwork.');
  const data = validatePurchaseRequest({
    ...input, country: 'Enquiry', address: 'Enquiry', notes: fields.message, 'policy-consent': 'on',
  });
  return { ...data, enquiry: true, country: fields.location, address: '', company: fields.company, topic: fields.topic, contact: input.contact };
}

export const onRequestPost = context => deliverRequest(context, validateArtworkEnquiry);
export { onRequestGet } from './purchase-request.js';
