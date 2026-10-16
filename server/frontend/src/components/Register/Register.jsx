import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer';
import { useAuth } from '../../auth/AuthContext';

const Register = () => {
  const { setAuthenticated } = useAuth();
  const [form, setForm] = useState({ userName: '', firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));

  const register = async (event) => {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      const response = await fetch('/djangoapp/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed.');
      setAuthenticated(result.userName);
      window.location.assign('/');
    } catch (requestError) {
      setError(requestError.message);
      setPending(false);
    }
  };

  return (
    <div className="site-shell"><Header /><main className="site-container page-main"><div className="auth-layout card"><aside className="auth-aside"><span className="eyebrow">Join the directory</span><h1>Leave the next driver a clearer view.</h1><p className="muted">Create a free account to contribute thoughtful dealership reviews.</p></aside><form className="auth-form" onSubmit={register}><h2>Create an account</h2><p className="muted">Five simple fields. No invented subscriptions or sales pitches.</p>{error && <div className="alert" role="alert">{error}</div>}<div className="form-grid"><div className="form-field"><label htmlFor="username">Username</label><input id="username" autoComplete="username" required value={form.userName} onChange={update('userName')} /></div><div className="form-field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} /></div><div className="form-field"><label htmlFor="first-name">First name</label><input id="first-name" autoComplete="given-name" required value={form.firstName} onChange={update('firstName')} /></div><div className="form-field"><label htmlFor="last-name">Last name</label><input id="last-name" autoComplete="family-name" required value={form.lastName} onChange={update('lastName')} /></div></div><div className="form-field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" required value={form.password} onChange={update('password')} /></div><button className="button button-primary" type="submit" disabled={pending}>{pending ? 'Creating account…' : 'Create account'}</button><p className="muted">Already registered? <a href="/login">Log in</a></p></form></div></main><Footer /></div>
  );
};

export default Register;
