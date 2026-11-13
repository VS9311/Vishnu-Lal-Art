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
import MobileMarbleHomepage, { MobileMarbleEmptySeries } from '../components/landscape/MobileMarbleHomepage';
import MobileArchiveHeader from '../components/landscape/MobileArchiveHeader';
import { formatCataloguePrice, getCataloguePrice } from '../lib/cataloguePricing';
import { formatArtworkDisplayId } from '../lib/artworkDisplay';
import { MotionLink } from '../motion/RouteMotion';
import './LandscapeHomepage.css';
import './MarbleArchive.css';

const subscribe = (callback) => { const query = window.matchMedia('(max-width: 800px)'); query.addEventListener('change', callback); return () => query.removeEventListener('change', callback); };
const mobileSnapshot = () => window.matchMedia('(max-width: 800px)').matches;

function MarbleNavigation({ seriesId }) {
  return <nav className="marble-navigation" aria-label="Marble archive">
    <MotionLink className="marble-brand" to="/" kind="portal"><strong>VISHNU LAL</strong></MotionLink>
    <MotionLink className="marble-home-link" to="/" kind="portal">HOME</MotionLink>
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
  if (!series) return <main id="main-content" className="landscape-homepage marble-archive marble-missing"><h1>Series not available</h1><MotionLink to="/" kind="portal">Return to home</MotionLink></main>;
  if (mobile && !artworks.length) return <MobileMarbleEmptySeries series={series} />;
  if (mobile) return <MobileMarbleHomepage key={seriesId} artworkIds={artworks.map((work) => work.id)} collectionId={seriesId} />;
  return <DesktopMarblePassage
    key={seriesId}
    series={{ ...series, totalWorks: artworks.length }}
    artworks={artworks}
    restoreArtworkId={location.state?.artworkId}
    restoreFromHistory={navigationType === 'POP'}
  />;
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
  const [record, setRecord] = useState(() => artwork?.source === 'sanity' ? {} : null);
  const [error, setError] = useState(false);
  const [intent, setIntent] = useState(null);
  const inquiryTrigger = useRef(null);
  const { addArtwork, includesArtwork, openCart } = useCart();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!isPublicArtwork(id)) return;
    if (artwork?.source === 'sanity') { setRecord({}); setError(false); return; }
    let cancelled = false;
    import(`../data/artworks/${id}.json`).then((module) => { if (!cancelled) setRecord(module.default); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [artwork?.source, id]);
  if (!artwork || !isPublicArtwork(id)) return <main id="main-content" className="landscape-homepage marble-archive marble-missing"><h1>Work not available</h1><MotionLink to="/" kind="portal">Return to home</MotionLink></main>;
  const series = getSeriesData(artwork.seriesId);
  const navigation = getSeriesNavigation(id);
  const fromHome = location.state?.fromLandscape;
  const media = buildArtworkMedia(artwork);
  const mediaItems = getArtworkMediaSequence(media, mobile);
  const status = artwork.source === 'sanity' ? artwork.status : record?.availability || record?.acquisitionStatus;
  const price = artwork.priceUsd || getCataloguePrice(artwork.id);
  const formattedPrice = formatCataloguePrice(price);
  const unavailable = artwork.status === 'soldOut' || ['ACQUIRED', 'NOT_CURRENTLY_AVAILABLE'].includes(status);
  const inCart = includesArtwork(artwork.id);
  const primaryLabel = unavailable ? 'ENQUIRE' : inCart ? 'VIEW CART' : 'ADD TO CART';
  return <main id="main-content" className="landscape-homepage marble-archive marble-record">
    {mobile ? <MobileArchiveHeader /> : <MarbleNavigation seriesId={series.id} />}
    <div className="marble-record-layout">
      <div className="marble-record-visual"><ArtworkMediaGallery artwork={artwork} items={mediaItems} mobile={mobile} /></div>
      <article className="marble-record-copy">
        <MotionLink className="marble-back-link" to={fromHome ? '/' : `/${series.id}`} kind="focus" state={fromHome ? { restoreLandscape: true } : { artworkId: id }}>← {fromHome ? 'BACK TO HOME' : `BACK TO ${series.label.toUpperCase()}`}</MotionLink>
        <p className="marble-eyebrow">{series.label} · {navigation.currentIndex} / {navigation.totalWorks}</p>
        <h1 className="marble-record-series-title"><span lang="ml">{series.malayalamName}</span><span>{series.romanizedName}</span></h1>
        <p className="marble-record-series marble-record-artwork-id" lang={id.toUpperCase().startsWith('THUNDU-') ? 'ml' : undefined}>{formatArtworkDisplayId(id)}</p>
        <div className="marble-commerce-summary">
          {!unavailable && <div><span>PRICE</span><strong className="marble-price">{formattedPrice}</strong></div>}
          {unavailable && <div className="marble-commerce-status"><strong>SOLD OUT</strong></div>}
        </div>
        <ArtworkSpecifications record={record} />
        <div className="marble-acquisition"><button onClick={(event) => {
          if (unavailable) { inquiryTrigger.current = event.currentTarget; setIntent('Other'); return; }
          if (!inCart) addArtwork(artwork.id);
          openCart();
        }}>{primaryLabel}</button>{primaryLabel !== 'ENQUIRE' && <button onClick={(event) => { inquiryTrigger.current = event.currentTarget; setIntent('Other'); }}>ENQUIRE</button>}</div>
        {mobile && series.summary && <section className="marble-record-series-summary" aria-labelledby="record-series-summary-title">
          <h2 id="record-series-summary-title" className="marble-eyebrow">ABOUT THE SERIES</h2>
          <p>{series.summary}</p>
        </section>}
        {!record && artwork.source !== 'sanity' && !error && <p role="status">Loading catalogue record…</p>}
        {error && <p role="alert">The catalogue record could not be loaded. Please refresh to try again.</p>}
        {record && <div className="marble-public-record"><CatalogueRecord metadata={record.catalogue} />
          {record.formalObservation && <details><summary>FORMAL OBSERVATION</summary><FormalObservation data={record.formalObservation} /></details>}
          {record.curatorialObservation && <details><summary>CURATORIAL OBSERVATION</summary><CuratorialObservation data={record.curatorialObservation} /></details>}
        </div>}
        <nav className="marble-record-pagination" aria-label="More works in this series">{navigation.prevId ? <MotionLink to={`/artwork/${navigation.prevId}`} kind="record" direction={-1}>← PREVIOUS</MotionLink> : <span>FIRST WORK</span>}<MotionLink to={`/${series.id}`} kind="focus" state={{ artworkId: id }}>ALL {navigation.totalWorks} WORKS</MotionLink>{navigation.nextId ? <MotionLink to={`/artwork/${navigation.nextId}`} kind="record" direction={1}>NEXT →</MotionLink> : <span>LAST WORK</span>}</nav>
      </article>
    </div>
    {intent && <ArtworkEnquiryDialog artworkId={artwork.id} initialTopic={intent} onClose={() => { setIntent(null); inquiryTrigger.current?.focus(); }} />}
  </main>;
}
