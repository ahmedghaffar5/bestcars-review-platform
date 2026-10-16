import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer';
import { isSafeNextPath, useAuth } from '../../auth/AuthContext';

const safeNext = () => {
  const next = new URLSearchParams(window.location.search).get('next');
  return isSafeNextPath(next);
};

const Login = () => {
  const { setAuthenticated } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const response = await fetch('/djangoapp/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userName, password }) });
      const result = await response.json();
      if (!response.ok || result.status !== 'Authenticated') throw new Error(result.message || 'Those credentials could not be authenticated.');
      setAuthenticated(result.userName);
      window.location.assign(safeNext());
    } catch (requestError) {
      setError(requestError.message);
      setPending(false);
    }
  };

  return (
    <div className="site-shell"><Header /><main className="site-container page-main"><div className="auth-layout card"><aside className="auth-aside"><span className="eyebrow">Welcome back</span><h1>Good decisions start with good context.</h1><p className="muted">Sign in to share what you learned and keep the directory useful for the next driver.</p></aside><form className="auth-form" onSubmit={login}><h2>Log in</h2><p className="muted">Use your Best Cars account.</p>{error && <div className="alert" role="alert">{error}</div>}<div className="form-field"><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" required value={userName} onChange={(event) => setUserName(event.target.value)} /></div><div className="form-field password-row"><label htmlFor="password">Password</label><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div><button className="button button-primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Log in'}</button><p className="muted">New here? <a href="/register">Create an account</a></p></form></div></main><Footer /></div>
  );
};

export default Login;
