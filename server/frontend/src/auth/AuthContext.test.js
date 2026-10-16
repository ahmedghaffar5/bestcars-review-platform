import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const Consumer = () => {
  const auth = useAuth();
  return (
    <>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="username">{auth.userName}</span>
      <button type="button" onClick={() => auth.logout()}>Logout</button>
      <button type="button" onClick={() => auth.refreshSession().catch(() => {})}>Refresh</button>
    </>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { origin: 'http://localhost', pathname: '/', search: '', hash: '', replace: jest.fn() };
  });

  test('does not expose anonymous controls while session resolution is pending', async () => {
    let resolveSession;
    global.fetch = jest.fn(() => new Promise((resolve) => {
      resolveSession = () => resolve({ ok: true, json: () => Promise.resolve({ authenticated: true, userName: 'driver' }) });
    }));
    render(<AuthProvider><Consumer /></AuthProvider>);
    expect(screen.getByTestId('status')).toHaveTextContent('loading');
    expect(screen.getByTestId('username')).toHaveTextContent('');
    resolveSession();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('username')).toHaveTextContent('driver');
  });

  test('represents invalid session responses as errors instead of anonymous', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }));
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
  });

  test('deduplicates concurrent session refreshes', async () => {
    let resolveSession;
    global.fetch = jest.fn(() => new Promise((resolve) => {
      resolveSession = () => resolve({ ok: true, json: () => Promise.resolve({ authenticated: false, userName: '' }) });
    }));
    render(<AuthProvider><Consumer /></AuthProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    resolveSession();
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('anonymous'));
  });

  test('posts logout once and ignores a late session response after success', async () => {
    let resolveInitial;
    global.fetch = jest.fn((url, options) => {
      if (url === '/djangoapp/session') {
        return new Promise((resolve) => { resolveInitial = resolve; });
      }
      if (url === '/djangoapp/csrf') return Promise.resolve({ ok: true });
      if (url === '/djangoapp/logout') return Promise.resolve({ ok: true, json: () => Promise.resolve({ userName: '' }) });
      return Promise.reject(new Error('unexpected request'));
    });
    render(<AuthProvider><Consumer /></AuthProvider>);
    resolveInitial({ ok: true, json: () => Promise.resolve({ authenticated: true, userName: 'old-user' }) });
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(window.location.replace).toHaveBeenCalledWith('/'));
    expect(global.fetch.mock.calls.filter(([url]) => url === '/djangoapp/logout')).toHaveLength(1);
  });

  test('keeps authenticated state and exposes an error when logout fails', async () => {
    global.fetch = jest.fn((url) => {
      if (url === '/djangoapp/session') return Promise.resolve({ ok: true, json: () => Promise.resolve({ authenticated: true, userName: 'driver' }) });
      if (url === '/djangoapp/csrf') return Promise.resolve({ ok: true });
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'));
    expect(window.location.replace).not.toHaveBeenCalled();
  });
});
