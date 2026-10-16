import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const links = [
  ['/', 'Home'],
  ['/dealers', 'Dealerships'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const Header = () => {
  const { status, authenticated, userName, logout, refreshSession } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const currentPath = window.location.pathname;
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand" href="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true"><span>◆</span></span>
          <span>Best Cars</span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="sr-only">Toggle navigation</span>{menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-navigation" className="nav-links" data-open={menuOpen} aria-label="Primary navigation">
          {links.map(([href, label]) => (
            <a key={href} href={href} aria-current={currentPath === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          {status === 'loading' || status === 'logout-pending' ? (
            <span className="muted" role="status">{status === 'logout-pending' ? 'Signing out…' : 'Checking session…'}</span>
          ) : status === 'error' ? (
            <button className="button button-secondary" type="button" onClick={() => refreshSession().catch(() => {})}>Retry session</button>
          ) : authenticated ? (
            <>
              <span className="muted" aria-label={`Signed in as ${userName}`}>{userName}</span>
              <button className="button button-secondary" type="button" onClick={logout} disabled={status === 'logout-pending'}>Log out</button>
            </>
          ) : (
            <>
              <a href="/login">Log in</a>
              <a className="button button-primary" href="/register">Join free</a>
            </>
          )}
        </div>
      </div>
      {status === 'error' && <div className="site-container session-error" role="alert">Session status is unavailable. Please retry before using account actions.</div>}
    </header>
  );
};

export default Header;
