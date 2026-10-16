import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dealers from './Dealers';

const dealers = [
  { id: 1, full_name: 'Alpha Motors', city: 'Austin', address: '1 Main St', zip: '78701', state: 'Texas' },
  { id: 2, full_name: 'Bravo Cars', city: 'Denver', address: '2 Main St', zip: '80202', state: 'Colorado' },
];

describe('Dealers directory', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/dealers');
    global.fetch = jest.fn((url) => {
      if (url === '/djangoapp/session') {
        return Promise.resolve({ json: () => Promise.resolve({ authenticated: false }) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200, dealers }),
      });
    });
  });

  test('filters by search text and synchronizes the query string', async () => {
    render(<Dealers />);
    expect(await screen.findByText('Alpha Motors')).toBeInTheDocument();
    expect(screen.getByText('Bravo Cars')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search by name or city/i), { target: { value: 'Denver' } });

    await waitFor(() => expect(screen.queryByText('Alpha Motors')).not.toBeInTheDocument());
    expect(screen.getByText('Bravo Cars')).toBeInTheDocument();
    expect(window.location.search).toBe('?q=Denver');
  });

  test('requests the selected state and resets filters', async () => {
    render(<Dealers />);
    await screen.findByText('Alpha Motors');
    fireEvent.change(screen.getByLabelText(/^state$/i), { target: { value: 'Colorado' } });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/djangoapp/get_dealers/Colorado'));
    fireEvent.click(screen.getByRole('button', { name: /reset filters/i }));
    expect(screen.getByLabelText(/search by name or city/i)).toHaveValue('');
    expect(screen.getByLabelText(/^state$/i)).toHaveValue('All');
  });
});
