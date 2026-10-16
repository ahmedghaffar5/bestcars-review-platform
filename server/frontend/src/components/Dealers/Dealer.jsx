import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer';

const sentimentName = (value) => ['positive', 'negative', 'neutral'].includes(value) ? value : 'neutral';

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [dealerError, setDealerError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setDealerError('');
    setReviewError('');
    const [dealerResponse, reviewsResponse, sessionResponse] = await Promise.all([
      fetch(`/djangoapp/dealer/${id}`),
      fetch(`/djangoapp/reviews/dealer/${id}`),
      fetch('/djangoapp/session'),
    ]);
    const dealerResult = await dealerResponse.json();
    if (!dealerResponse.ok || dealerResult.status !== 200 || !dealerResult.dealer?.length) throw new Error(dealerResult.message || 'Dealer not found.');
    setDealer(dealerResult.dealer[0]);
    const reviewsResult = await reviewsResponse.json();
    if (!reviewsResponse.ok || reviewsResult.status !== 200) setReviewError(reviewsResult.message || 'Reviews are temporarily unavailable.');
    else setReviews(Array.isArray(reviewsResult.reviews) ? reviewsResult.reviews : []);
    const sessionResult = await sessionResponse.json();
    setIsLoggedIn(sessionResult.authenticated === true);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load().catch((error) => {
      setDealerError(error.message);
      setLoading(false);
    });
  }, [load]);

  return (
    <div className="site-shell">
      <Header />
      <main className="site-container page-main">
        {loading && <p className="status" role="status">Loading dealer details...</p>}
        {dealerError && <div className="alert" role="alert">{dealerError} <button className="button button-secondary" type="button" onClick={load}>Retry</button></div>}
        {!loading && dealer && (
          <>
            <div className="detail-hero">
              <div>
                <a className="muted" href="/dealers">← Back to dealerships</a>
                <span className="eyebrow" style={{ display: 'block', marginTop: '1.5rem' }}>Dealer profile</span>
                <h1>{dealer.full_name}</h1>
                <p className="muted">{[dealer.city, dealer.address, dealer.zip, dealer.state].filter(Boolean).join(' · ')}</p>
              </div>
              <a className="button button-primary" href={isLoggedIn ? `/postreview/${id}` : `/login?next=/postreview/${id}`}>{isLoggedIn ? 'Write a review' : 'Sign in to review'}</a>
            </div>
            <section className="page-section" aria-labelledby="reviews-heading">
              <div className="page-heading">
                <div><span className="eyebrow">Community notes</span><h2 id="reviews-heading">Reviews, without the noise.</h2></div>
                {!reviewError && <span className="muted">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>}
              </div>
              {reviewError && <div className="alert" role="alert">{reviewError}</div>}
              {!reviewError && reviews.length === 0 && <p className="status">No reviews yet. Be the first to share a useful experience.</p>}
              {!reviewError && reviews.length > 0 && (
                <div className="review-list">
                  {reviews.map((review) => {
                    const sentiment = sentimentName(review.sentiment);
                    return (
                      <article className="card review-card" key={review.id}>
                        <span className={`sentiment sentiment-${sentiment}`}><span aria-hidden="true">◆</span>{sentiment} sentiment</span>
                        <blockquote>{review.review}</blockquote>
                        <div className="review-meta">
                          <span>{review.name || 'Community reviewer'}</span>
                          {(review.car_make || review.car_model || review.car_year) && <span>{[review.car_make, review.car_model, review.car_year].filter(Boolean).join(' · ')}</span>}
                          {review.purchase && <span>Purchase experience</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dealer;
