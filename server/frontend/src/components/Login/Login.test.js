import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { pathname: '/login', search: '', assign: jest.fn() };
  });

  test('submits the existing username/password contract and redirects after authentication', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'Authenticated', userName: 'driver' }),
    }));
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'driver' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }));

    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/'));
    expect(global.fetch).toHaveBeenCalledWith('/djangoapp/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ userName: 'driver', password: 'secret' }),
    }));
  });

  test('shows an authentication error and preserves entered fields', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' }),
    }));
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'driver' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
    expect(screen.getByLabelText(/username/i)).toHaveValue('driver');
    expect(screen.getByLabelText(/password/i)).toHaveValue('wrong');
  });
});
