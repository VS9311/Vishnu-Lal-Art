import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ArchiveHeader.css';

export default function ArchiveHeader() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isChamberRoute = /^\/archive\/series-(i|ii)$/.test(pathname);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={`archive-header${isChamberRoute ? ' archive-header--chamber' : ''}`}>
        <Link to="/" className="wordmark" aria-label="Vishnu Lal Home">
          Vishnu Lal
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <Link
            to="/archive"
            className={pathname === '/archive' ? 'nav-link active' : 'nav-link'}
          >
            ARCHIVE
          </Link>
          <span className="nav-separator" aria-hidden="true">/</span>
          <Link
            to="/archive/series-i"
            className={pathname === '/archive/series-i' ? 'nav-link active series-link' : 'nav-link series-link'}
          >
            അനാമം <span className="sub-label">· SERIES I</span>
          </Link>
          <span className="nav-separator" aria-hidden="true">·</span>
          <Link
            to="/archive/series-ii"
            className={pathname === '/archive/series-ii' ? 'nav-link active series-link' : 'nav-link series-link'}
          >
            അന്തരാളം <span className="sub-label">· SERIES II</span>
          </Link>
        </nav>

        {/* Mobile Index Button */}
        <button
          type="button"
          className="mobile-index-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-index-drawer"
          aria-label={mobileMenuOpen ? 'Close Archive Index' : 'Open Archive Index'}
        >
          {mobileMenuOpen ? 'CLOSE' : 'INDEX'}
        </button>
      </header>

      {/* Mobile Index Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-index-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            id="mobile-index-drawer"
            className="mobile-index-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Archive Index"
          >
            <div className="drawer-section">
              <span className="drawer-section-title">THE ARCHIVE</span>
              <ul className="drawer-links-list">
                <li>
                  <Link
                    to="/archive"
                    className={pathname === '/archive' ? 'drawer-link active' : 'drawer-link'}
                  >
                    All Series Overview
                  </Link>
                </li>
                <li>
                  <Link
                    to="/archive/series-i"
                    className={pathname === '/archive/series-i' ? 'drawer-link active' : 'drawer-link'}
                  >
                    <span className="drawer-malayalam">അനാമം</span>
                    <span className="drawer-series-meta">Series I · 16 works</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/archive/series-ii"
                    className={pathname === '/archive/series-ii' ? 'drawer-link active' : 'drawer-link'}
                  >
                    <span className="drawer-malayalam">അന്തരാളം</span>
                    <span className="drawer-series-meta">Series II · 12 works</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="drawer-section">
              <span className="drawer-section-title">ENCOUNTER</span>
              <ul className="drawer-links-list">
                <li>
                  <Link
                    to="/"
                    className={pathname === '/' ? 'drawer-link active' : 'drawer-link'}
                  >
                    Home Encounter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

