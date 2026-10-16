import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header mobile navigation', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ authenticated: false, userName: '' }),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('opens and closes the navigation with the toggle and Escape', async () => {
    render(<Header />);
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
});
