import { useEffect, useRef, useSyncExternalStore } from 'react';
import { MotionLink } from '../motion/RouteMotion';
import { artistProfile as profile } from '../data/artistProfile';
import './ArtistPage.css';

const subscribeMobileArtist = (callback) => {
  const query = window.matchMedia('(max-width: 760px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const mobileArtistSnapshot = () => window.matchMedia('(max-width: 760px)').matches;

function ArtistStudioFilm({ mobile = false }) {
  return <section id="artist-film" className={`artist-film${mobile ? ' artist-film--opening' : ''}`} aria-labelledby="film-title">
    <header data-reveal={mobile ? undefined : true}><div><p className="artist-label">A STUDIO FILM</p><h2 id="film-title">In his own words.</h2></div><p className="artist-film-note">A moment with Vishnu Lal and his practice.</p></header>
    <div className="artist-film-frame"><iframe src={profile.film} title="Vishnu Lal — artist studio film" loading={mobile ? 'eager' : 'lazy'} allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
  </section>;
}

function ArtistPhoto({ name, alt, priority = false }) {
  return <img src={`/artist/${name}-1600.webp`}
    srcSet={`/artist/${name}-800.webp 800w, /artist/${name}-1600.webp 1600w`}
    sizes="(max-width: 760px) 92vw, 46vw" width="1600" height={name === 'portrait' ? '2400' : '1067'}
    alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />;
}

export default function ArtistPage() {
  const page = useRef(null);
  const mobile = useSyncExternalStore(subscribeMobileArtist, mobileArtistSnapshot, () => false);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  useEffect(() => {
    const elements = [...page.current.querySelectorAll('[data-reveal]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.06 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [mobile]);

  return <main ref={page} id="main-content" className="artist-page">
    <header className="artist-header">
      <MotionLink className="artist-brand" to="/" kind="portal">VISHNU LAL</MotionLink>
      <nav aria-label="Artist page navigation"><a href="#artist-statement">STATEMENT</a><a href="#artist-film">FILM</a><MotionLink to="/" kind="portal">RETURN TO HOME ↗</MotionLink></nav>
    </header>
    <section id="artist-top" className="artist-hero" aria-labelledby="artist-title">
      <div className="artist-hero-copy">
        <p className="artist-label">THE ARTIST / KERALA, INDIA</p>
        <h1 id="artist-title">Vishnu Lal<span aria-hidden="true">.</span></h1>
        {mobile && <ArtistStudioFilm mobile />}
        <p className="artist-intro">{profile.introduction}</p>
        <p className="artist-mentor">{profile.mentorship}</p>
        <a className="artist-text-link" href="#artist-statement">ON THE PRACTICE ↓</a>
      </div>
      <figure className="artist-portrait"><ArtistPhoto name="portrait" alt="Vishnu Lal seated in his studio, looking towards the light." priority /><figcaption>VISHNU LAL · IN THE STUDIO</figcaption></figure>
    </section>
    <section id="artist-statement" className="artist-statement" aria-labelledby="statement-title">
      <div className="artist-statement-heading" data-reveal><p className="artist-label">ARTIST STATEMENT</p><h2 id="statement-title">The hand moves<br />before the mind names.</h2></div>
      <div className="artist-statement-grid">{profile.statement.map((paragraph) => <section key={paragraph.title} className="artist-statement-part" data-reveal><h3>{paragraph.title}</h3><p>{paragraph.body}</p></section>)}</div>
    </section>
    <section className="artist-studio" aria-label="Inside the studio" data-reveal>
      <figure><ArtistPhoto name="studio" alt="Vishnu Lal considering a large drawing on the wall of his studio." /></figure>
      <div className="artist-studio-copy"><p className="artist-label">PERCEPTION / THE SEEN &amp; THE UNKNOWN</p><blockquote>“What we see is never the entirety of what exists.”</blockquote><p className="artist-studio-caption">Interpretation belongs to the viewer.</p></div>
    </section>
    {!mobile && <ArtistStudioFilm />}
    <footer id="artist-access" className="artist-footer">
      <div><p className="artist-label">THE STUDIO</p><p>For acquisitions, exhibitions and conversations about the work.</p><a className="artist-contact" href={`mailto:${profile.email}`}>{profile.email} ↗</a></div>
      <MotionLink className="artist-text-link" to="/" kind="portal">EXPLORE THE WORKS →</MotionLink>
    </footer>
  </main>;
}
