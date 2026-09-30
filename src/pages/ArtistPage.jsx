import { useEffect, useMemo, useRef } from 'react';
import ResponsiveArtworkImage from '../components/artwork/ResponsiveArtworkImage';
import { getArtworkSummary } from '../lib/artwork';
import { MotionLink } from '../motion/RouteMotion';
import { artistProfile } from '../data/artistProfile';
import './ArtistPage.css';

function ArtistHeader() {
  return <header className="artist-header">
    <MotionLink className="artist-header-brand" to="/" kind="portal">VISHNU LAL · THE ARCHIVE</MotionLink>
    <nav className="artist-header-nav" aria-label="Artist page navigation">
      <MotionLink to="/" kind="portal">ARCHIVE</MotionLink>
      <a aria-current="page" href="#artist-top">THE ARTIST</a>
      <a href="#artist-access">ACCESS</a>
    </nav>
    <MotionLink className="artist-header-index" to="/" kind="portal">INDEX</MotionLink>
  </header>;
}

function ArtworkImage({ id, className = '', sizes = '100vw', priority = false }) {
  const artwork = getArtworkSummary(id);
  if (!artwork) return null;
  return <ResponsiveArtworkImage artwork={artwork} className={className} sizes={sizes} priority={priority} eager />;
}

function MediaPlaceholder({ label, note, className = '' }) {
  return <div className={`artist-media-placeholder ${className}`} role="img" aria-label={`${label}. ${note}`}>
    <strong>{label}</strong><span>{note}</span>
  </div>;
}

function ArtistSeries({ item, index }) {
  return <article className={`artist-series-card artist-series-card--${index + 1}`} data-reveal>
    <p className="artist-series-count">{item.label} · {String(index + 1).padStart(2, '0')}</p>
    <MotionLink className="artist-artwork artist-series-image" to={`/${item.id}`} kind="portal" aria-label={`Enter ${item.label}, ${item.romanizedName}`}>
      <ArtworkImage id={item.artworkId} sizes="(max-width: 800px) 86vw, 38vw" />
    </MotionLink>
    <div className="artist-series-copy">
      <h3 className="artist-series-title" lang="ml">{item.malayalamName}</h3>
      <p className="artist-series-romanized">{item.romanizedName}</p>
      <p>{item.statement}</p>
      <p className="artist-note">{item.statementStatus}</p>
      <MotionLink className="artist-inline-link" to={`/${item.id}`} kind="portal">ENTER SERIES →</MotionLink>
    </div>
  </article>;
}

export default function ArtistPage() {
  const page = useRef(null);
  const sourceCount = artistProfile.sources.length;
  const profile = useMemo(() => artistProfile, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const root = page.current;
    if (!root) return undefined;
    const elements = [...root.querySelectorAll('[data-reveal]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main ref={page} id="main-content" className="artist-page">
    <ArtistHeader />

    <section id="artist-top" className="artist-hero" aria-labelledby="artist-title">
      <div className="artist-hero-copy" data-reveal>
        <p className="artist-kicker">THE ARTIST · 01</p>
        <h1 id="artist-title" className="artist-display">{profile.identity.name}</h1>
        <p className="artist-eyebrow">{profile.identity.role} · {profile.identity.location}</p>
        <p className="artist-intro">{profile.identity.introduction}</p>
      </div>
      <div className="artist-hero-portrait" data-reveal>
        <MediaPlaceholder label={profile.portrait.label} note={profile.portrait.note} />
        <span className="artist-hero-caption">Editorial media reserved for authentic photography</span>
      </div>
      <a className="artist-scroll-cue" href="#outside-system"><span>SCROLL TO READ</span><i aria-hidden="true" /></a>
    </section>

    <section id="outside-system" className="artist-journey" aria-labelledby="journey-title">
      <header className="artist-section-heading" data-reveal>
        <p className="artist-section-index">THE JOURNEY · 02</p>
        <div><h2 id="journey-title" className="artist-section-title">Outside<br />the system.</h2><p className="artist-body">An independent practice, developed through experiment and return.</p></div>
      </header>
      <div className="artist-journey-list">
        {profile.journey.map((block, index) => <article key={block.number} className={`artist-journey-block artist-journey-block--${index + 1}`} data-reveal>
          <div className="artist-journey-copy">
            <p className="artist-eyebrow">{block.number} · {block.eyebrow}</p><h3 className="artist-journey-title">{block.title}</h3>
            {block.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {block.artworkId && <figure className="artist-journey-visual">
            <div className="artist-artwork"><ArtworkImage id={block.artworkId} sizes="(max-width: 800px) 86vw, 46vw" /></div>
            <figcaption className="artist-note">{block.artworkLabel}</figcaption>
          </figure>}
          {block.editorialHold && <MediaPlaceholder className="artist-journey-placeholder" label="ARCHIVE SOURCE" note={block.editorialHold} />}
        </article>)}
      </div>
    </section>

    <section className="artist-seeing" aria-labelledby="seeing-title">
      <div className="artist-seeing-visual" data-reveal>
        <div className="artist-artwork"><ArtworkImage id={profile.wayOfSeeing.artworkId} sizes="(max-width: 800px) 100vw, 58vw" /></div>
        <span className="artist-note">ARCHIVE DETAIL · {profile.wayOfSeeing.artworkId}</span>
      </div>
      <div className="artist-seeing-copy" data-reveal>
        <p className="artist-kicker">{profile.wayOfSeeing.eyebrow} · 03</p>
        <h2 id="seeing-title" className="artist-quote">{profile.wayOfSeeing.title}</h2>
        <p className="artist-body">{profile.wayOfSeeing.body}</p>
        <p className="artist-note">{profile.wayOfSeeing.statement} · {profile.wayOfSeeing.status}</p>
      </div>
    </section>

    <section className="artist-film" aria-labelledby="film-title">
      <header className="artist-film-heading" data-reveal><p className="artist-section-index">THE VOICE · 04</p><h2 id="film-title" className="artist-section-title">{profile.film.eyebrow}</h2></header>
      <div className="artist-film-frame" data-reveal role="status" aria-label="Film awaiting editorial approval">
        <div className="artist-film-copy"><h3 className="artist-film-title">{profile.film.title}</h3><p>{profile.film.description}<br />FILM 01 · NOT YET PUBLISHED</p></div>
      </div>
    </section>

    <section className="artist-practice" aria-labelledby="practice-title">
      <header className="artist-section-heading" data-reveal>
        <p className="artist-section-index">{profile.practice.eyebrow} · 05</p>
        <div><h2 id="practice-title" className="artist-section-title">{profile.practice.title}</h2><p className="artist-body">{profile.practice.introduction}</p></div>
      </header>
      <div className="artist-practice-grid">
        {profile.practice.items.map((item) => <figure key={item.artworkId} className={`artist-practice-item artist-practice-item--${item.layout}`} data-reveal>
          <div className="artist-artwork"><ArtworkImage id={item.artworkId} className={item.layout === 'detail' ? 'artist-artwork-detail' : ''} sizes="(max-width: 800px) 92vw, 58vw" /></div>
          <figcaption><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></figcaption>
        </figure>)}
      </div>
      <p className="artist-note" data-reveal>{profile.practice.photographyNote}</p>
    </section>

    <section className="artist-series" aria-labelledby="work-title">
      <header className="artist-section-heading" data-reveal><p className="artist-section-index">THE WORK · 06</p><h2 id="work-title" className="artist-section-title">Two bodies.<br />One evolving archive.</h2></header>
      <div className="artist-series-grid">{profile.series.map((item, index) => <ArtistSeries key={item.id} item={item} index={index} />)}</div>
    </section>

    {profile.press.length > 0 && <section className="artist-press" aria-label="Writing and conversations" />}

    <section id="artist-access" className="artist-access" aria-labelledby="access-title">
      <div data-reveal><p className="artist-kicker">PRIVATE ACCESS · 07</p><h2 id="access-title" className="artist-access-title">{profile.access.title}</h2><p className="artist-access-copy">{profile.access.description}</p></div>
      <div className="artist-access-actions" data-reveal>
        <a className="artist-access-link" href={`mailto:${profile.access.email}?cc=${profile.access.cc}&subject=Vishnu%20Lal%20Archive%20Enquiry`}>BEGIN A CONVERSATION →</a>
        <MotionLink className="artist-access-link" to="/" kind="portal">RETURN TO THE ARCHIVE →</MotionLink>
        <p className="artist-source-note">{sourceCount} VERIFIED ARCHIVE SOURCES INFORM THIS DRAFT</p>
      </div>
    </section>
  </main>;
}

