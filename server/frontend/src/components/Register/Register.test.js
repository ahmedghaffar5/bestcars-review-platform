import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Register from './Register';
import { AuthProvider } from '../../auth/AuthContext';

describe('Register', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { pathname: '/register', search: '', assign: jest.fn() };
  });

  test('submits all five registration fields and redirects on success', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ userName: 'new-driver' }),
    }));
    render(<AuthProvider><Register /></AuthProvider>);

    const values = {
      username: 'new-driver',
      email: 'driver@example.com',
      'first name': 'New',
      'last name': 'Driver',
      password: 'strong-password',
    };
    Object.entries(values).forEach(([label, value]) => {
      fireEvent.change(screen.getByLabelText(new RegExp(label, 'i')), { target: { value } });
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/'));
    expect(global.fetch).toHaveBeenCalledWith('/djangoapp/register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        userName: 'new-driver',
        firstName: 'New',
        lastName: 'Driver',
        email: 'driver@example.com',
        password: 'strong-password',
      }),
    }));
  });

  test('reports duplicate registration without clearing entered values', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Username already exists' }),
    }));
    render(<AuthProvider><Register /></AuthProvider>);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'taken' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Username already exists')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toHaveValue('taken');
  });
});
