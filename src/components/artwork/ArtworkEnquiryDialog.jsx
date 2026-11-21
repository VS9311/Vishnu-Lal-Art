import { useEffect, useId, useRef, useState } from 'react';
import { MOTION_DURATIONS } from '../../motion/motionConfig';
import { formatArtworkDisplayId } from '../../lib/artworkDisplay';

const TOPICS = [
  'Purchasing this work',
  'Price',
  'Framing',
  'International delivery',
  'Trade / interior design',
  'Viewing / exhibition',
  'Preview in my space',
  'Other',
];

export default function ArtworkEnquiryDialog({ artworkId, initialTopic = 'Other', onClose }) {
  const dialog = useRef(null);
  const formId = useId();
  const [topic, setTopic] = useState(initialTopic);
  const [contact, setContact] = useState('email');
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const submission = useRef(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(0);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    element.showModal();
    return () => {
      window.clearTimeout(closeTimer.current);
      document.documentElement.style.overflow = previousOverflow;
      element.close();
    };
  }, []);

  const close = () => {
    if (closing) return;
    setClosing(true);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : MOTION_DURATIONS.panel;
    closeTimer.current = window.setTimeout(() => {
      dialog.current?.close();
      onClose();
    }, duration);
  };

  const prepareWhatsapp = values => {
    const message = `Hello Vishnu Lal Studio, I’m ${values.name}. I would like to enquire about ${formatArtworkDisplayId(artworkId)}. Topic: ${values.topic}.${values.message ? `\n\n${values.message}` : ''}\n\nhttps://www.vishnulalartist.com/artwork/${encodeURIComponent(artworkId)}`;
    return `https://wa.me/919188437736?text=${encodeURIComponent(message)}`;
  };

  const submit = async event => {
    event.preventDefault();
    if (sending) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = Object.fromEntries(['name', 'email', 'phone', 'location', 'company', 'topic', 'message', 'contact', 'website'].map(key => [key, values[key] || '']));
    payload.artworkIds = [artworkId];
    const chatUrl = payload.contact === 'whatsapp' ? prepareWhatsapp(payload) : '';
    setWhatsappUrl(chatUrl);
    const fingerprint = JSON.stringify(payload);
    if (submission.current?.fingerprint !== fingerprint) submission.current = { fingerprint, id: crypto.randomUUID() };
    setSending(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/artwork-enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requestId: submission.current.id }),
      });
      const result = await response.json().catch(() => null);
      if (!result) throw new Error('The enquiry service is unavailable. Please try again, or contact studio@vishnulalartist.com.');
      if (!response.ok || !result.sent) throw new Error(result.error || 'Unable to send your enquiry. Please try again.');
      setSent({ ...result, payload });
    } catch (error) {
      setSubmitError(error instanceof TypeError ? 'Unable to reach the studio. Please check your connection and try again.' : error.message || 'Unable to send your enquiry. Please try again.');
    } finally { setSending(false); }
  };

  return <dialog className={`marble-contact-dialog${closing ? ' is-closing' : ''}`} ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const box = dialog.current.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  }} aria-labelledby={`${formId}-title`}>
    <button className="marble-dialog-close" type="button" onClick={close} autoFocus>CLOSE ×</button>
    {sent ? <div className="marble-enquiry-prepared" role="status">
      <p className="marble-eyebrow">{formatArtworkDisplayId(artworkId)}</p>
      <h2 id={`${formId}-title`}>Enquiry sent.</h2>
      <p>Your enquiry has reached Vishnu Lal Studio. We will be in touch using your preferred contact method.</p>
      {sent.confirmationSent === true && <p>A confirmation email is on its way to you.</p>}
      {sent.confirmationSent === false && <p>Your enquiry reached the studio, but the confirmation email could not be sent.</p>}
      {sent.payload.contact === 'whatsapp' && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">CONTINUE ON WHATSAPP</a>}
      <button type="button" onClick={close}>RETURN TO ARTWORK</button>
    </div> : <form onSubmit={submit}>
      <p className="marble-eyebrow">ARTWORK ENQUIRY</p>
      <h2 id={`${formId}-title`}>Begin a conversation.</h2>
      <p>Ask about acquisition, framing, delivery, viewing, or previewing the work in your space.</p>

      <div className="marble-enquiry-grid">
        <label>ARTWORK<input value={formatArtworkDisplayId(artworkId)} readOnly /></label>
        <label>NAME<input name="name" autoComplete="name" maxLength="160" required /></label>
        <label>EMAIL<input name="email" type="email" autoComplete="email" maxLength="254" required={contact === 'email'} /></label>
        <label>PHONE / WHATSAPP<input name="phone" type="tel" autoComplete="tel" maxLength="80" placeholder="Include country code" required={contact === 'whatsapp'} /></label>
        <label>CITY / COUNTRY<input name="location" autoComplete="country-name" maxLength="160" /></label>
        <label className="marble-enquiry-wide">COMPANY / STUDIO <span>(optional)</span><input name="company" autoComplete="organization" /></label>
        <label className="marble-enquiry-wide">I AM ENQUIRING ABOUT<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{TOPICS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="marble-enquiry-wide">MESSAGE<textarea name="message" rows="4" maxLength="2000" /></label>
        <p className="marble-enquiry-wide marble-contact-note">You can share a photo of your space when the studio replies.</p>
      </div>

      <fieldset><legend>PREFERRED CONTACT</legend><label><input type="radio" name="contact" value="email" checked={contact === 'email'} onChange={() => { setContact('email'); setWhatsappUrl(''); setSubmitError(''); }} /> EMAIL</label><label><input type="radio" name="contact" value="whatsapp" checked={contact === 'whatsapp'} onChange={() => { setContact('whatsapp'); setWhatsappUrl(''); setSubmitError(''); }} /> WHATSAPP</label></fieldset>
      <label hidden aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label>
      {submitError && <p role="alert">{submitError}</p>}
      {submitError && whatsappUrl && contact === 'whatsapp' && <p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">CONTINUE ON WHATSAPP</a><br />Your message is ready. Open WhatsApp and press send to contact the studio.</p>}
      <button className="marble-enquiry-submit" type="submit" disabled={sending}>{sending ? 'SENDING…' : 'SEND ENQUIRY'}</button>
      <p className="marble-contact-note">Your details will be used to respond to this enquiry.</p>
    </form>}
  </dialog>;
}

