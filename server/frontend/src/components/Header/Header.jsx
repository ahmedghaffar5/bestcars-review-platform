import React, { useEffect, useState } from 'react';
import '../assets/style.css';
import '../assets/bootstrap.min.css';

const Header = () => {
  const [session, setSession] = useState({ authenticated: false, userName: '' });

  useEffect(() => {
    fetch('/djangoapp/session')
      .then((response) => response.json())
      .then((result) => setSession(result))
      .catch(() => setSession({ authenticated: false, userName: '' }));
  }, []);

  const logout = async (event) => {
    event.preventDefault();
    const response = await fetch('/djangoapp/logout');
    if (!response.ok) {
      return;
    }
    setSession({ authenticated: false, userName: '' });
    window.location.href = '/';
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: 'darkturquoise', height: '1in' }}
    >
      <div className="container-fluid">
        <h2 style={{ paddingRight: '5%' }}>Dealerships</h2>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="/dealers">Dealerships</a></li>
          <li className="nav-item"><a className="nav-link" href="/about">About Us</a></li>
          <li className="nav-item"><a className="nav-link" href="/contact">Contact Us</a></li>
        </ul>
        <div className="loginlink">
          {session.authenticated ? (
            <>
              <span className="username">{session.userName}</span>
              <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <a className="nav_item" href="/login">Login</a>
              <a className="nav_item" href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
