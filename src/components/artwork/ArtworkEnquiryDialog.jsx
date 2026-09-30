import { useEffect, useId, useRef, useState } from 'react';
import { MOTION_DURATIONS } from '../../motion/motionConfig';

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
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [prepared, setPrepared] = useState(false);
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

  const chooseFile = (event) => {
    const selected = event.target.files?.[0] || null;
    if (!selected) { setFile(null); setFileError(''); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 10 * 1024 * 1024) {
      event.target.value = '';
      setFile(null);
      setFileError('Choose a JPG, PNG, or WebP image up to 10 MB.');
      return;
    }
    setFile(selected);
    setFileError('');
  };

  return <dialog className={`marble-contact-dialog${closing ? ' is-closing' : ''}`} ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const box = dialog.current.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  }} aria-labelledby={`${formId}-title`}>
    <button className="marble-dialog-close" type="button" onClick={close} autoFocus>CLOSE ×</button>
    {prepared ? <div className="marble-enquiry-prepared" role="status">
      <p className="marble-eyebrow">{artworkId}</p>
      <h2 id={`${formId}-title`}>Enquiry prepared.</h2>
      <p>This proof keeps your information on this device. Secure website delivery will be connected before enquiries go live.</p>
      <button type="button" onClick={close}>RETURN TO ARTWORK</button>
    </div> : <form onSubmit={(event) => { event.preventDefault(); setPrepared(true); }}>
      <p className="marble-eyebrow">ARTWORK ENQUIRY</p>
      <h2 id={`${formId}-title`}>Begin a conversation.</h2>
      <p>Ask about acquisition, framing, delivery, viewing, or previewing the work in your space.</p>

      <div className="marble-enquiry-grid">
        <label>ARTWORK<input value={artworkId} readOnly /></label>
        <label>NAME<input name="name" autoComplete="name" required /></label>
        <label>EMAIL<input name="email" type="email" autoComplete="email" required /></label>
        <label>CITY / COUNTRY<input name="location" autoComplete="country-name" required /></label>
        <label className="marble-enquiry-wide">COMPANY / STUDIO <span>(optional)</span><input name="company" autoComplete="organization" /></label>
        <label className="marble-enquiry-wide">I AM ENQUIRING ABOUT<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{TOPICS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="marble-enquiry-wide">MESSAGE<textarea name="message" rows="4" maxLength="2000" required /></label>
        <label className="marble-enquiry-wide marble-upload">UPLOAD YOUR SPACE <span>(optional)</span><input name="space" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} aria-describedby={`${formId}-upload-note`} />
          <small id={`${formId}-upload-note`}>{fileError || (file ? `${file.name} selected — held locally for this proof.` : 'JPG, PNG, or WebP · maximum 10 MB · not uploaded in this proof')}</small>
        </label>
      </div>

      <fieldset><legend>PREFERRED CONTACT</legend><label><input type="radio" name="contact" value="email" defaultChecked /> EMAIL</label><label><input type="radio" name="contact" value="whatsapp" /> WHATSAPP</label></fieldset>
      <button className="marble-enquiry-submit" type="submit">SEND ENQUIRY</button>
      <p className="marble-contact-note">No payment is taken here. Enquiry delivery and secure file upload will be connected before launch.</p>
    </form>}
  </dialog>;
}

