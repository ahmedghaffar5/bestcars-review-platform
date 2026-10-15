import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Dealers.css';
import '../assets/style.css';
import positiveIcon from '../assets/positive.png';
import neutralIcon from '../assets/neutral.png';
import negativeIcon from '../assets/negative.png';
import reviewIcon from '../assets/reviewbutton.png';
import Header from '../Header/Header';

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDealer = useCallback(async () => {
    const response = await fetch(`/djangoapp/dealer/${id}`);
    const result = await response.json();
    if (!response.ok || result.status !== 200 || !result.dealer?.length) {
      throw new Error(result.message || 'Unable to load dealer');
    }
    setDealer(result.dealer[0]);
  }, [id]);

  const getReviews = useCallback(async () => {
    const response = await fetch(`/djangoapp/reviews/dealer/${id}`);
    const result = await response.json();
    if (!response.ok || result.status !== 200) {
      throw new Error(result.message || 'Unable to load reviews');
    }
    setReviews(Array.isArray(result.reviews) ? result.reviews : []);
  }, [id]);

  const getSession = useCallback(async () => {
    const response = await fetch('/djangoapp/session');
    const result = await response.json();
    setIsLoggedIn(result.authenticated === true);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDealer(), getReviews(), getSession()])
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [getDealer, getReviews, getSession]);

  const sentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return positiveIcon;
    if (sentiment === 'negative') return negativeIcon;
    return neutralIcon;
  };

  return (
    <div style={{ margin: '20px' }}>
      <Header />
      {loading && <p role="status">Loading dealer...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <>
          <h1 style={{ color: 'grey' }}>{dealer.full_name}</h1>
          {isLoggedIn && (
            <a href={`/postreview/${id}`}>
              <img
                src={reviewIcon}
                style={{ width: '10%', marginLeft: '10px' }}
                alt="Post a review"
              />
            </a>
          )}
          <h4 style={{ color: 'grey' }}>
            {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
          <div className="reviews_panel">
            {reviews.length === 0 && <p>No reviews yet.</p>}
            {reviews.map((review) => (
              <article className="review_panel" key={review.id}>
                <img
                  src={sentimentIcon(review.sentiment)}
                  className="emotion_icon"
                  alt={`${review.sentiment || 'neutral'} sentiment`}
                />
                <div className="review">{review.review}</div>
                <div className="reviewer">
                  {review.name} {review.car_make} {review.car_model} {review.car_year}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dealer;
