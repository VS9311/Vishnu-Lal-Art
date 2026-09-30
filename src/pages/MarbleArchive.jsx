import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigationType, useParams } from 'react-router-dom';
import { getAllSeries, getArtworkSummary, getSeriesArtworks, getSeriesData, getSeriesNavigation, isPublicArtwork } from '../lib/artwork';
import CatalogueRecord from '../components/artwork/CatalogueRecord';
import FormalObservation from '../components/artwork/FormalObservation';
import CuratorialObservation from '../components/artwork/CuratorialObservation';
import ArtworkMediaGallery from '../components/artwork/ArtworkMediaGallery';
import ArtworkEnquiryDialog from '../components/artwork/ArtworkEnquiryDialog';
import { buildArtworkMedia, getArtworkMediaSequence } from '../components/artwork/artworkMedia';
import { useCart } from '../components/cart/cartContextState';
import DesktopMarblePassage from '../components/landscape/DesktopMarblePassage';
import MobileMarbleHomepage from '../components/landscape/MobileMarbleHomepage';
import { formatCataloguePrice, getCataloguePrice } from '../lib/cataloguePricing';
import { MotionLink } from '../motion/RouteMotion';
import './LandscapeHomepage.css';
import './MarbleArchive.css';

const subscribe = (callback) => { const query = window.matchMedia('(max-width: 800px)'); query.addEventListener('change', callback); return () => query.removeEventListener('change', callback); };
const mobileSnapshot = () => window.matchMedia('(max-width: 800px)').matches;

function MarbleNavigation({ seriesId }) {
  return <nav className="marble-navigation" aria-label="Marble archive">
    <MotionLink className="marble-brand" to="/" kind="portal"><strong>VISHNU LAL</strong><span>THE ARCHIVE</span></MotionLink>
    <MotionLink className="marble-home-link" to="/" kind="portal">MARBLE HOMEPAGE</MotionLink>
    <MotionLink className="marble-home-link" to="/artist" kind="portal">THE ARTIST</MotionLink>
    {getAllSeries().map((series) => <MotionLink className="marble-series-link" aria-current={series.id === seriesId ? 'page' : undefined} key={series.id} to={`/${series.id}`} kind="portal">
      <span>{series.label}</span><strong lang="ml">{series.malayalamName}</strong><span>{series.romanizedName}</span><small>{getSeriesArtworks(series.id).length} WORKS</small>
    </MotionLink>)}
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
    artworks={artworks}
    restoreArtworkId={location.state?.artworkId}
    restoreFromHistory={navigationType === 'POP'}
  />;
}

function availabilityLabel(status) {
  return {
    AVAILABLE: 'Available',
    ACQUIRED: 'Acquired',
    NOT_CURRENTLY_AVAILABLE: 'Not currently available',
  }[status] || null;
}

function ArtworkSpecifications({ record }) {
  const catalogue = record?.catalogue || {};
  const framed = record?.framed ?? catalogue.framed;
  const shippingOptions = [
    (record?.canShipRolled ?? catalogue.canShipRolled) === true ? 'Can ship rolled' : null,
    (record?.canShipFlat ?? catalogue.canShipFlat) === true ? 'Can ship flat' : null,
    (record?.canShipFramed ?? catalogue.canShipFramed) === true ? 'Can ship framed' : null,
    record?.shippingNotes ?? catalogue.shippingNotes,
  ].filter(Boolean).join(' · ');
  const values = [
    ['Medium', record?.medium ?? catalogue.medium],
    ['Support', record?.support ?? catalogue.support],
    ['Dimensions', record?.dimensions ?? catalogue.dimensions],
    ['Presentation', record?.presentation ?? catalogue.presentation ?? (typeof framed === 'boolean' ? (framed ? 'Framed' : 'Unframed') : null)],
    ['Shipping', shippingOptions],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (!values.length) return null;
  return <dl className="marble-specifications">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{String(value)}</dd></div>)}</dl>;
}

export function MarbleArtworkPage() {
  const { id } = useParams();
  // Remount the record on navigation so no previous work's data or inquiry survives.
  return <MarbleArtworkRecord key={id} id={id} />;
}

function MarbleArtworkRecord({ id }) {
  const artwork = getArtworkSummary(id);
  const mobile = useSyncExternalStore(subscribe, mobileSnapshot, () => false);
  const location = useLocation();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(false);
  const [intent, setIntent] = useState(null);
  const inquiryTrigger = useRef(null);
  const { addArtwork, includesArtwork, openCart } = useCart();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!isPublicArtwork(id)) return;
    let cancelled = false;
    import(`../data/artworks/${id}.json`).then((module) => { if (!cancelled) setRecord(module.default); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [id]);
  if (!artwork || !isPublicArtwork(id)) return <main id="main-content" className="landscape-homepage marble-archive marble-missing"><h1>Work not available</h1><MotionLink to="/" kind="portal">Return to the marble homepage</MotionLink></main>;
  const series = getSeriesData(artwork.seriesId);
  const navigation = getSeriesNavigation(id);
  const fromHome = location.state?.fromLandscape;
  const media = buildArtworkMedia(artwork);
  const mediaItems = getArtworkMediaSequence(media, mobile);
  const status = record?.availability || record?.acquisitionStatus;
  const statusLabel = availabilityLabel(status);
  const price = getCataloguePrice(artwork.id);
  const formattedPrice = formatCataloguePrice(price);
  const unavailable = ['ACQUIRED', 'NOT_CURRENTLY_AVAILABLE'].includes(status);
  const inCart = includesArtwork(artwork.id);
  const primaryLabel = unavailable ? 'ENQUIRE' : inCart ? 'VIEW CART' : 'ADD TO CART';
  return <main id="main-content" className="landscape-homepage marble-archive marble-record">
    <MarbleNavigation seriesId={series.id} />
    <div className="marble-record-layout">
      <div className="marble-record-visual"><ArtworkMediaGallery artwork={artwork} items={mediaItems} mobile={mobile} /></div>
      <article className="marble-record-copy">
        <MotionLink className="marble-back-link" to={fromHome ? '/' : `/${series.id}`} kind="portal" state={fromHome ? { restoreLandscape: true } : { artworkId: id }}>← {fromHome ? 'BACK TO HOMEPAGE' : `BACK TO ${series.label.toUpperCase()}`}</MotionLink>
        <p className="marble-eyebrow">{series.label} · {navigation.currentIndex} / {navigation.totalWorks}</p><h1>{id}</h1>
        <p className="marble-record-series"><span lang="ml">{series.malayalamName}</span> / {series.romanizedName}</p>
        <div className="marble-commerce-summary">
          {!unavailable && <div><span>PRICE</span><strong>{formattedPrice}</strong></div>}
          {statusLabel && <div><span>AVAILABILITY</span><strong>{statusLabel}</strong></div>}
        </div>
        <ArtworkSpecifications record={record} />
        <div className="marble-acquisition"><button onClick={(event) => {
          if (unavailable) { inquiryTrigger.current = event.currentTarget; setIntent('Other'); return; }
          if (!inCart) addArtwork(artwork.id);
          openCart();
        }}>{primaryLabel}</button>{primaryLabel !== 'ENQUIRE' && <button onClick={(event) => { inquiryTrigger.current = event.currentTarget; setIntent('Other'); }}>ENQUIRE</button>}</div>
        {!record && !error && <p role="status">Loading catalogue record…</p>}
        {error && <p role="alert">The catalogue record could not be loaded. Please refresh to try again.</p>}
        {record && <div className="marble-public-record"><CatalogueRecord metadata={record.catalogue} />
          {record.formalObservation && <details><summary>FORMAL OBSERVATION</summary><FormalObservation data={record.formalObservation} /></details>}
          {record.curatorialObservation && <details><summary>CURATORIAL OBSERVATION</summary><CuratorialObservation data={record.curatorialObservation} /></details>}
        </div>}
        <nav className="marble-record-pagination" aria-label="More works in this series">{navigation.prevId ? <MotionLink to={`/artwork/${navigation.prevId}`} kind="record" direction={-1}>← PREVIOUS</MotionLink> : <span>FIRST WORK</span>}<MotionLink to={`/${series.id}`} kind="portal" state={{ artworkId: id }}>ALL {navigation.totalWorks} WORKS</MotionLink>{navigation.nextId ? <MotionLink to={`/artwork/${navigation.nextId}`} kind="record" direction={1}>NEXT →</MotionLink> : <span>LAST WORK</span>}</nav>
      </article>
    </div>
    {intent && <ArtworkEnquiryDialog artworkId={artwork.id} initialTopic={intent} onClose={() => { setIntent(null); inquiryTrigger.current?.focus(); }} />}
  </main>;
}
