import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AuthContext = createContext(null);
const SESSION_ENDPOINT = '/djangoapp/session';

const getCsrfToken = () => document.cookie
  .split('; ')
  .find((cookie) => cookie.startsWith('csrftoken='))
  ?.split('=')[1];

export const isSafeNextPath = (value) => {
  if (!value || typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  try {
    const target = new URL(value, window.location.origin);
    return target.origin === window.location.origin ? `${target.pathname}${target.search}${target.hash}` : '/';
  } catch {
    return '/';
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState({ status: 'loading', authenticated: false, userName: '', error: '' });
  const requestRef = useRef(null);
  const requestGeneration = useRef(0);
  const logoutGeneration = useRef(0);
  const logoutInFlight = useRef(false);
  const mounted = useRef(true);

  const resolveSession = useCallback(async () => {
    if (requestRef.current) return requestRef.current;
    const generation = ++requestGeneration.current;
    const request = fetch(SESSION_ENDPOINT, { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session status is unavailable.');
        let result;
        try {
          result = await response.json();
        } catch {
          throw new Error('Session status returned invalid data.');
        }
        if (result.authenticated !== true && result.authenticated !== false) throw new Error('Session status returned invalid data.');
        if (mounted.current && generation === requestGeneration.current && generation > logoutGeneration.current) {
          setSession(result.authenticated
            ? { status: 'authenticated', authenticated: true, userName: result.userName || '', error: '' }
            : { status: 'anonymous', authenticated: false, userName: '', error: '' });
        }
        return result;
      })
      .catch((error) => {
        if (mounted.current && generation === requestGeneration.current && generation > logoutGeneration.current) {
          setSession({ status: 'error', authenticated: false, userName: '', error: error.message });
        }
        throw error;
      })
      .finally(() => {
        if (requestRef.current === request) requestRef.current = null;
      });
    requestRef.current = request;
    return request;
  }, []);

  useEffect(() => {
    mounted.current = true;
    resolveSession().catch(() => {});
    return () => { mounted.current = false; };
  }, [resolveSession]);

  const refreshSession = useCallback(() => resolveSession(), [resolveSession]);

  const setAuthenticated = useCallback((userName) => {
    logoutGeneration.current = 0;
    requestGeneration.current += 1;
    setSession({ status: 'authenticated', authenticated: true, userName: userName || '', error: '' });
  }, []);

  const logout = useCallback(async () => {
    if (logoutInFlight.current) return false;
    logoutInFlight.current = true;
    const generation = ++logoutGeneration.current;
    requestGeneration.current += 1;
    requestRef.current = null;
    setSession((current) => ({ ...current, status: 'logout-pending', error: '' }));
    try {
      await fetch('/djangoapp/csrf', { credentials: 'same-origin' });
      const response = await fetch('/djangoapp/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRFToken': getCsrfToken() || '' },
      });
      if (!response.ok) throw new Error('Unable to sign out. Please try again.');
      const result = await response.json();
      if (!result || result.userName !== '') throw new Error('Sign-out response was invalid.');
      if (mounted.current && generation === logoutGeneration.current) {
        setSession({ status: 'anonymous', authenticated: false, userName: '', error: '' });
        window.location.replace('/');
      }
      logoutInFlight.current = false;
      return true;
    } catch (error) {
      if (mounted.current && generation === logoutGeneration.current) {
        setSession((current) => ({ ...current, status: 'authenticated', error: error.message }));
        refreshSession().catch(() => {});
      }
      logoutInFlight.current = false;
      return false;
    }
  }, [refreshSession]);

  const value = useMemo(() => ({
    ...session,
    isResolved: ['authenticated', 'anonymous', 'error'].includes(session.status),
    refreshSession,
    setAuthenticated,
    logout,
  }), [session, refreshSession, setAuthenticated, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
