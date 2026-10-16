import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Header from './Header';
import { AuthProvider } from '../../auth/AuthContext';

describe('Header mobile navigation', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ authenticated: false, userName: '' }),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('opens and closes the navigation with the toggle and Escape', async () => {
    render(<AuthProvider><Header /></AuthProvider>);
    await screen.findByRole('link', { name: /log in/i });
    const toggle = screen.getByRole('button', { name: /toggle navigation/i });
    const navigation = screen.getByRole('navigation', { name: /primary/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(navigation).toHaveAttribute('data-open', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(navigation).toHaveAttribute('data-open', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(navigation).toHaveAttribute('data-open', 'false');
  });

  test('reserves the account space without exposing anonymous controls while loading', async () => {
    let resolveSession;
    global.fetch = jest.fn(() => new Promise((resolve) => {
      resolveSession = () => resolve({
        ok: true,
        json: () => Promise.resolve({ authenticated: true, userName: 'driver' }),
      });
    }));
    render(<AuthProvider><Header /></AuthProvider>);

    expect(screen.getByTestId('auth-loading-placeholder')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('sr-only');
    expect(screen.getByRole('status')).toHaveTextContent('Checking session…');
    expect(screen.queryByRole('link', { name: /log in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /join free/i })).not.toBeInTheDocument();

    resolveSession();
    await waitFor(() => expect(screen.getByLabelText('Signed in as driver')).toBeInTheDocument());
    expect(screen.queryByTestId('auth-loading-placeholder')).not.toBeInTheDocument();
  });
});
