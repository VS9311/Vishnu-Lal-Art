import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllSeries } from '../../lib/artwork';
import { MotionLink } from '../../motion/RouteMotion';
import './MobileArchiveHeader.css';

export default function MobileArchiveHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const location = useLocation();
  const series = getAllSeries();

  useEffect(() => {
    const dismiss = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, [open]);

  const close = () => setOpen(false);
  return <header className="mobile-archive-header">
    <div className="mobile-archive-header-row">
      <button ref={trigger} className="mobile-archive-menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-archive-menu" onClick={() => setOpen(!open)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          {open ? <path d="m5 5 14 14M5 19 19 5" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>
      <MotionLink to="/" kind="portal" className="mobile-archive-identity" onClick={close}><strong>VISHNU LAL</strong></MotionLink>
    </div>
    <nav className="mobile-archive-shortcuts" aria-label="Collections and artist">
      {series.map((item) => <MotionLink key={item.id} to={`/${item.id}`} kind="portal" aria-current={location.pathname === `/${item.id}` ? 'page' : undefined} onClick={close}>{item.label}</MotionLink>)}
      <MotionLink to="/artist" kind="portal" onClick={close}>ARTIST</MotionLink>
    </nav>
    {open && <nav id="mobile-archive-menu" className="mobile-archive-menu" aria-label="Archive menu">
      <MotionLink to="/" kind="portal" onClick={close}>HOME</MotionLink>
      {series.map((item) => <MotionLink className="mobile-archive-series-destination" key={item.id} to={`/${item.id}`} kind="portal" aria-current={location.pathname === `/${item.id}` ? 'page' : undefined} onClick={close}>
        <span>{item.label}</span><strong lang="ml">{item.malayalamName}</strong><span>{item.romanizedName}</span>
      </MotionLink>)}
      <MotionLink to="/artist" kind="portal" onClick={close}>THE ARTIST</MotionLink>
      <div className="mobile-archive-information" aria-label="Studio information and policies">
        <MotionLink to="/contact" kind="portal" onClick={close}>CONTACT / ACCESS</MotionLink>
        <MotionLink to="/privacy" kind="portal" onClick={close}>PRIVACY</MotionLink>
        <MotionLink to="/terms" kind="portal" onClick={close}>TERMS</MotionLink>
        <MotionLink to="/refund-cancellation" kind="portal" onClick={close}>RETURNS</MotionLink>
        <MotionLink to="/shipping-delivery" kind="portal" onClick={close}>SHIPPING</MotionLink>
      </div>
    </nav>}
  </header>;
}
