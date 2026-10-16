import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer';
import { useAuth } from '../../auth/AuthContext';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status: authStatus } = useAuth();
  const [dealer, setDealer] = useState({});
  const [carModels, setCarModels] = useState([]);
  const [review, setReview] = useState('');
  const [purchase, setPurchase] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (authStatus === 'loading') return;
    if (authStatus === 'error') {
      setError('Session status is unavailable. Retry from the navigation before submitting a review.');
      setLoading(false);
      return;
    }
    if (authStatus === 'anonymous') {
      navigate(`/login?next=/postreview/${id}`);
      return;
    }
    const [dealerResponse, carsResponse] = await Promise.all([
      fetch(`/djangoapp/dealer/${id}`), fetch('/djangoapp/get_cars'),
    ]);
    const dealerResult = await dealerResponse.json();
    const carsResult = await carsResponse.json();
    if (!dealerResponse.ok || dealerResult.status !== 200 || !dealerResult.dealer?.length) throw new Error('Unable to load dealer.');
    if (!carsResponse.ok || !Array.isArray(carsResult.CarModels)) throw new Error('Unable to load vehicle options.');
    setDealer(dealerResult.dealer[0]);
    setCarModels(carsResult.CarModels);
    setLoading(false);
  }, [authStatus, id, navigate]);

  useEffect(() => { load().catch((requestError) => { setError(requestError.message); setLoading(false); }); }, [load]);

  const makes = [...new Set(carModels.map((car) => car.CarMake))];
  const models = carModels.filter((car) => car.CarMake === make).map((car) => car.CarModel);
  const years = carModels.filter((car) => car.CarMake === make && car.CarModel === model).map((car) => car.year);
  const getCsrfToken = () => document.cookie.split('; ').find((cookie) => cookie.startsWith('csrftoken='))?.split('=')[1];

  const postReview = async (event) => {
    event.preventDefault();
    setError('');
    if (!review.trim() || !make || !model || !year) {
      setError('Review, make, model, and year are required.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/djangoapp/csrf');
      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
        body: JSON.stringify({ dealership: id, review: review.trim(), purchase, purchase_date: purchase ? date : '', car_make: make, car_model: model, car_year: year }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== 200) throw new Error(result.message || 'Unable to post review.');
      navigate(`/dealer/${id}`);
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="site-container page-main">
        <a className="muted" href={`/dealer/${id}`}>← Back to {dealer.full_name || 'dealer'}</a>
        <div className="page-heading" style={{ marginTop: '1.5rem' }}><div><span className="eyebrow">Share an experience</span><h1>Make your review useful.</h1><p>Specific, honest notes help the next driver make a clearer decision.</p></div></div>
        {loading && <p className="status" role="status">Preparing the review form...</p>}
        {!loading && (
          <form className="card review-form" onSubmit={postReview} noValidate>
            {error && <div className="alert" role="alert">{error}</div>}
            <div className="form-field"><label htmlFor="review">Your review</label><textarea id="review" value={review} onChange={(event) => setReview(event.target.value)} required aria-describedby="review-help" /><span id="review-help" className="muted">Sentiment labels are automated text analysis, not star ratings or moderation.</span></div>
            <label className="check-row"><input type="checkbox" checked={purchase} onChange={(event) => { setPurchase(event.target.checked); if (!event.target.checked) setDate(''); }} /> I purchased a vehicle here</label>
            <div className="form-field"><label htmlFor="purchase-date">Purchase date <span className="muted">(optional)</span></label><input id="purchase-date" type="date" value={date} disabled={!purchase} onChange={(event) => setDate(event.target.value)} /></div>
            <div className="form-grid">
              <div className="form-field"><label htmlFor="car-make">Make</label><select id="car-make" value={make} onChange={(event) => { setMake(event.target.value); setModel(''); setYear(''); }} required><option value="">Choose make</option>{makes.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
              <div className="form-field"><label htmlFor="car-model">Model</label><select id="car-model" value={model} onChange={(event) => { setModel(event.target.value); setYear(''); }} disabled={!make} required><option value="">Choose model</option>{[...new Set(models)].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            </div>
            <div className="form-field"><label htmlFor="car-year">Year</label><select id="car-year" value={year} onChange={(event) => setYear(event.target.value)} disabled={!model} required><option value="">Choose year</option>{[...new Set(years)].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Publishing…' : 'Publish review'}</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostReview;
