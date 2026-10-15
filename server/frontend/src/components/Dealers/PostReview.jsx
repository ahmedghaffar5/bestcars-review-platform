import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dealers.css';
import '../assets/style.css';
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState('');
  const [purchase, setPurchase] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [carModels, setCarModels] = useState([]);
  const [error, setError] = useState('');

  const getDealer = useCallback(async () => {
    const response = await fetch(`/djangoapp/dealer/${id}`);
    const result = await response.json();
    if (!response.ok || result.status !== 200 || !result.dealer?.length) {
      throw new Error(result.message || 'Unable to load dealer');
    }
    setDealer(result.dealer[0]);
  }, [id]);

  const getCars = useCallback(async () => {
    const response = await fetch('/djangoapp/get_cars');
    const result = await response.json();
    if (!response.ok || !Array.isArray(result.CarModels)) {
      throw new Error('Unable to load car models');
    }
    setCarModels(result.CarModels);
  }, []);

  const checkSession = useCallback(async () => {
    const response = await fetch('/djangoapp/session');
    const result = await response.json();
    if (!result.authenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    Promise.all([getDealer(), getCars(), checkSession()])
      .catch((requestError) => setError(requestError.message));
  }, [getDealer, getCars, checkSession]);

  const makes = [...new Set(carModels.map((car) => car.CarMake))];
  const models = carModels
    .filter((car) => car.CarMake === make)
    .map((car) => car.CarModel);
  const years = carModels
    .filter((car) => car.CarMake === make && car.CarModel === model)
    .map((car) => car.year);

  const getCsrfToken = () => (
    document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('csrftoken='))
      ?.split('=')[1]
  );

  const postReview = async (event) => {
    event.preventDefault();
    setError('');
    if (!review.trim() || !make || !model || !year) {
      setError('Review, make, model, and year are required.');
      return;
    }
    try {
      await fetch('/djangoapp/csrf');
      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          dealership: id,
          review: review.trim(),
          purchase,
          purchase_date: purchase ? date : '',
          car_make: make,
          car_model: model,
          car_year: year,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== 200) {
        throw new Error(result.message || 'Unable to post review');
      }
      navigate(`/dealer/${id}`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ margin: '5%' }}>
        <h1 style={{ color: 'darkblue' }}>{dealer.full_name}</h1>
        {error && <p role="alert">{error}</p>}
        <form onSubmit={postReview}>
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            cols="50"
            rows="7"
            required
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />
          <div className="input_field">
            <label htmlFor="purchase">Did you purchase this car?</label>
            <input
              id="purchase"
              type="checkbox"
              checked={purchase}
              onChange={(event) => {
                setPurchase(event.target.checked);
                if (!event.target.checked) setDate('');
              }}
            />
          </div>
          <div className="input_field">
            <label htmlFor="purchase-date">Purchase Date</label>
            <input
              id="purchase-date"
              type="date"
              value={date}
              disabled={!purchase}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="input_field">
            <label htmlFor="car-make">Car Make</label>
            <select
              id="car-make"
              required
              value={make}
              onChange={(event) => {
                setMake(event.target.value);
                setModel('');
                setYear('');
              }}
            >
              <option value="">Choose Car Make</option>
              {makes.map((carMake) => (
                <option key={carMake} value={carMake}>{carMake}</option>
              ))}
            </select>
          </div>
          <div className="input_field">
            <label htmlFor="car-model">Car Model</label>
            <select
              id="car-model"
              required
              value={model}
              disabled={!make}
              onChange={(event) => {
                setModel(event.target.value);
                setYear('');
              }}
            >
              <option value="">Choose Car Model</option>
              {models.map((carModel) => (
                <option key={carModel} value={carModel}>{carModel}</option>
              ))}
            </select>
          </div>
          <div className="input_field">
            <label htmlFor="car-year">Car Year</label>
            <select
              id="car-year"
              required
              value={year}
              disabled={!model}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">Choose Car Year</option>
              {years.map((carYear) => (
                <option key={carYear} value={carYear}>{carYear}</option>
              ))}
            </select>
          </div>
          <button className="postreview" type="submit">Post Review</button>
        </form>
      </main>
    </div>
  );
};

export default PostReview;
