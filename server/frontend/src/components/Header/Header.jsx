import React, { useEffect, useState } from 'react';

const links = [
  ['/', 'Home'],
  ['/dealers', 'Dealerships'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const Header = () => {
  const [session, setSession] = useState({ authenticated: false, userName: '' });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/djangoapp/session')
      .then((response) => response.json())
      .then((result) => {
        if (active) setSession(result);
      })
      .catch(() => {
        if (active) setSession({ authenticated: false, userName: '' });
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const logout = async (event) => {
    event.preventDefault();
    const response = await fetch('/djangoapp/logout');
    if (!response.ok) return;
    setSession({ authenticated: false, userName: '' });
    window.location.assign('/');
  };

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
          {session.authenticated ? (
            <>
              <span className="muted" aria-label={`Signed in as ${session.userName}`}>{session.userName}</span>
              <a className="button button-secondary" href="/djangoapp/logout" onClick={logout}>Log out</a>
            </>
          ) : (
            <>
              <a href="/login">Log in</a>
              <a className="button button-primary" href="/register">Join free</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
