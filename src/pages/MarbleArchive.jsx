import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useLocation, useNavigationType, useParams } from 'react-router-dom';
import { getAllSeries, getArtworkSummary, getSeriesArtworks, getSeriesData, getSeriesNavigation, isPublicArtwork } from '../lib/artwork';
import ResponsiveArtworkImage from '../components/artwork/ResponsiveArtworkImage';
import CatalogueRecord from '../components/artwork/CatalogueRecord';
import FormalObservation from '../components/artwork/FormalObservation';
import CuratorialObservation from '../components/artwork/CuratorialObservation';
import { selectReliefProof } from '../components/landscape/reliefLayout';
import DesktopMarblePassage from '../components/landscape/DesktopMarblePassage';
import MobileMarbleHomepage from '../components/landscape/MobileMarbleHomepage';
import './LandscapeHomepage.css';
import './MarbleArchive.css';

const subscribe = (callback) => { const query = window.matchMedia('(max-width: 800px)'); query.addEventListener('change', callback); return () => query.removeEventListener('change', callback); };
const mobileSnapshot = () => window.matchMedia('(max-width: 800px)').matches;

function MarbleNavigation({ seriesId }) {
  return <nav className="marble-navigation" aria-label="Marble archive">
    <Link className="marble-brand" to="/homepage-2"><strong>VISHNU LAL</strong><span>THE ARCHIVE</span></Link>
    <Link className="marble-home-link" to="/homepage-2">MARBLE HOMEPAGE</Link>
    {getAllSeries().map((series) => <Link className="marble-series-link" aria-current={series.id === seriesId ? 'page' : undefined} key={series.id} to={`/homepage-2/${series.id}`}>
      <span>{series.label}</span><strong lang="ml">{series.malayalamName}</strong><span>{series.romanizedName}</span><small>{getSeriesArtworks(series.id).length} WORKS</small>
    </Link>)}
    <Link className="marble-entrance" to="/">RETURN TO ENTRANCE</Link>
  </nav>;
}

export function MarbleSeriesPage({ seriesId }) {
  const mobile = useSyncExternalStore(subscribe, mobileSnapshot, () => false);
  const location = useLocation();
  const navigationType = useNavigationType();
  const series = getSeriesData(seriesId);
  const artworks = getSeriesArtworks(seriesId);
  if (mobile) return <MobileMarbleHomepage key={seriesId} artworkIds={artworks.map((work) => work.id)} collectionId={seriesId} />;
  return <DesktopMarblePassage
    key={seriesId}
    series={{ ...series, totalWorks: artworks.length }}
    artworks={selectReliefProof(artworks, seriesId)}
    restoreArtworkId={location.state?.artworkId}
    restoreFromHistory={navigationType === 'POP'}
  />;
}

function AcquisitionDialog({ artwork, intent, onClose }) {
  const dialog = useRef(null);
  const [note, setNote] = useState('');
  useEffect(() => { const element = dialog.current; element.showModal(); return () => element.close(); }, []);
  const close = () => { dialog.current.close(); onClose(); };
  const subject = `${intent === 'purchase' ? 'Purchase request' : 'Artwork inquiry'} — ${artwork.id}`;
  const message = `Hello, I am interested in ${artwork.id} (${getSeriesData(artwork.seriesId).label}) in the Vishnu Lal Archive.\n\n${intent === 'purchase' ? 'I would like to purchase this work. Please confirm its availability, price, and purchase arrangements.' : 'Could you share more details about this work?'}${note.trim() ? `\n\n${note.trim()}` : ''}\n\nArtwork: ${window.location.origin}/homepage-2/artwork/${artwork.id}`;
  return <dialog className="marble-contact-dialog" ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) { const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); } }} aria-labelledby="marble-contact-title">
    <button className="marble-dialog-close" type="button" onClick={close} autoFocus>CLOSE ×</button>
    <p className="marble-eyebrow">{artwork.id}</p><h2 id="marble-contact-title">{intent === 'purchase' ? 'Make it part of your collection.' : 'A conversation about the work.'}</h2>
    <p>Choose a contact below. Your message opens in your email or WhatsApp app; nothing is sent until you send it there.</p>
    <label htmlFor="marble-contact-note">ADD A NOTE <span>(optional)</span></label>
    <textarea id="marble-contact-note" rows="3" maxLength={1200} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Your question, location, or delivery requirements…" />
    <div className="marble-contact-options"><h3>EMAIL</h3>{['vsdev.design@gmail.com', 'vishnulalm3@gmail.com'].map((email) => <a key={email} href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}>{email}<span aria-hidden="true">↗</span></a>)}
      <h3>WHATSAPP</h3>{[['918111829311', '+91 81118 29311'], ['919188437736', '+91 91884 37736']].map(([number, label]) => <a key={number} href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span></a>)}
    </div><p className="marble-contact-note">Availability, pricing, delivery and payment are confirmed personally. This is a request, not a completed purchase.</p>
  </dialog>;
}

export function MarbleArtworkPage() {
  const { id } = useParams();
  // Remount the record on navigation so no previous work's data or inquiry survives.
  return <MarbleArtworkRecord key={id} id={id} />;
}

function MarbleArtworkRecord({ id }) {
  const artwork = getArtworkSummary(id);
  const location = useLocation();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(false);
  const [intent, setIntent] = useState(null);
  const inquiryTrigger = useRef(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!isPublicArtwork(id)) return;
    let cancelled = false;
    import(`../data/artworks/${id}.json`).then((module) => { if (!cancelled) setRecord(module.default); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [id]);
  if (!artwork || !isPublicArtwork(id)) return <main id="main-content" className="landscape-homepage marble-archive marble-missing"><h1>Work not available</h1><Link to="/homepage-2">Return to the marble homepage</Link></main>;
  const series = getSeriesData(artwork.seriesId);
  const navigation = getSeriesNavigation(id);
  const fromHome = location.state?.fromLandscape;
  const unavailable = ['ACQUIRED', 'NOT_CURRENTLY_AVAILABLE'].includes(record?.acquisitionStatus);
  return <main id="main-content" className="landscape-homepage marble-archive marble-record">
    <MarbleNavigation seriesId={series.id} />
    <div className="marble-record-layout">
      <div className="marble-record-visual"><img className="marble-record-backdrop" src="/homepage-2/mobile-marble-podium-v1.png" alt="" /><div className="marble-record-sheet landscape-artwork-sheet"><ResponsiveArtworkImage artwork={artwork} className="landscape-artwork-image" sizes="(max-width:800px) 70vw, 36vw" priority /></div></div>
      <article className="marble-record-copy">
        <Link className="marble-back-link" to={fromHome ? '/homepage-2' : `/homepage-2/${series.id}`} state={fromHome ? { restoreLandscape: true } : { artworkId: id }}>← {fromHome ? 'BACK TO HOMEPAGE' : `BACK TO ${series.label.toUpperCase()}`}</Link>
        <p className="marble-eyebrow">{series.label} · {navigation.currentIndex} / {navigation.totalWorks}</p><h1>{id}</h1>
        <p className="marble-record-series"><span lang="ml">{series.malayalamName}</span> / {series.romanizedName}</p>
        <div className="marble-acquisition"><button onClick={(event) => { inquiryTrigger.current = event.currentTarget; setIntent('inquiry'); }}>INQUIRE ABOUT THIS WORK ↗</button>{record && !unavailable && <button onClick={(event) => { inquiryTrigger.current = event.currentTarget; setIntent('purchase'); }}>REQUEST TO PURCHASE ↗</button>}</div>
        <p className="marble-availability">{unavailable ? 'This work is not currently available for purchase.' : 'For availability, pricing and acquisition, please contact the archive.'}</p>
        {!record && !error && <p role="status">Loading catalogue record…</p>}
        {error && <p role="alert">The catalogue record could not be loaded. Please refresh to try again.</p>}
        {record && <div className="marble-public-record"><CatalogueRecord metadata={record.catalogue} />
          {!record.catalogue && !record.formalObservation && !record.curatorialObservation && <p>Further catalogue details are available on inquiry.</p>}
          {record.formalObservation && <details><summary>FORMAL OBSERVATION</summary><FormalObservation data={record.formalObservation} /></details>}
          {record.curatorialObservation && <details><summary>CURATORIAL OBSERVATION</summary><CuratorialObservation data={record.curatorialObservation} /></details>}
        </div>}
        <nav className="marble-record-pagination" aria-label="More works in this series">{navigation.prevId ? <Link to={`/homepage-2/artwork/${navigation.prevId}`}>← PREVIOUS</Link> : <span>FIRST WORK</span>}<Link to={`/homepage-2/${series.id}`} state={{ artworkId: id }}>ALL {navigation.totalWorks} WORKS</Link>{navigation.nextId ? <Link to={`/homepage-2/artwork/${navigation.nextId}`}>NEXT →</Link> : <span>LAST WORK</span>}</nav>
      </article>
    </div>
    {intent && <AcquisitionDialog artwork={artwork} intent={intent} onClose={() => { setIntent(null); inquiryTrigger.current?.focus(); }} />}
  </main>;
}
