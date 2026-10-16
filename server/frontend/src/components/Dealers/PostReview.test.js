import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostReview from './PostReview';
import { AuthProvider } from '../../auth/AuthContext';

const renderForm = () => render(
  <MemoryRouter initialEntries={['/postreview/1']}>
    <AuthProvider>
      <Routes>
        <Route path="/postreview/:id" element={<PostReview />} />
        <Route path="/dealer/:id" element={<div>Dealer detail</div>} />
      </Routes>
    </AuthProvider>
  </MemoryRouter>,
);

describe('PostReview', () => {
  beforeEach(() => {
    document.cookie = 'csrftoken=test-token';
    global.fetch = jest.fn((url) => {
      if (url === '/djangoapp/dealer/1') return Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 200, dealer: [{ full_name: 'Alpha Motors' }] }) });
      if (url === '/djangoapp/get_cars') return Promise.resolve({ ok: true, json: () => Promise.resolve({ CarModels: [{ CarMake: 'Acura', CarModel: 'Integra', year: 2024 }] }) });
      if (url === '/djangoapp/session') return Promise.resolve({ ok: true, json: () => Promise.resolve({ authenticated: true }) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 200 }) });
    });
  });

  test('rejects incomplete reviews before posting', async () => {
    renderForm();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/djangoapp/dealer/1'));
    await screen.findByRole('button', { name: /publish review/i });
    fireEvent.click(screen.getByRole('button', { name: /publish review/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Review, make, model, and year are required.');
    expect(global.fetch).not.toHaveBeenCalledWith('/djangoapp/add_review', expect.anything());
  });

  test('enables dependent vehicle fields and posts the required payload', async () => {
    renderForm();
    await screen.findByRole('button', { name: /publish review/i });
    fireEvent.change(screen.getByLabelText(/your review/i), { target: { value: 'Helpful and clear.' } });
    fireEvent.change(screen.getByLabelText(/^make$/i), { target: { value: 'Acura' } });
    fireEvent.change(screen.getByLabelText(/^model$/i), { target: { value: 'Integra' } });
    fireEvent.change(screen.getByLabelText(/^year$/i), { target: { value: '2024' } });
    fireEvent.click(screen.getByRole('button', { name: /publish review/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/djangoapp/add_review', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        dealership: '1',
        review: 'Helpful and clear.',
        purchase: false,
        purchase_date: '',
        car_make: 'Acura',
        car_model: 'Integra',
        car_year: '2024',
      }),
    })));
  });
});
