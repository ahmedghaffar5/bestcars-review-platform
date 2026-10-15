import React, { useCallback, useEffect, useState } from 'react';
import './Dealers.css';
import '../assets/style.css';
import Header from '../Header/Header';
import reviewIcon from '../assets/reviewicon.png';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDealers = useCallback(async (state = 'All') => {
    setLoading(true);
    setError('');
    const endpoint = state === 'All'
      ? '/djangoapp/get_dealers'
      : `/djangoapp/get_dealers/${encodeURIComponent(state)}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      if (!response.ok || result.status !== 200) {
        throw new Error(result.message || 'Unable to load dealerships');
      }
      const allDealers = Array.isArray(result.dealers) ? result.dealers : [];
      setDealersList(allDealers);
      if (state === 'All') {
        setStates([...new Set(allDealers.map((dealer) => dealer.state))]);
      }
    } catch (requestError) {
      setError(requestError.message);
      setDealersList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSession = useCallback(async () => {
    try {
      const response = await fetch('/djangoapp/session');
      const result = await response.json();
      setIsLoggedIn(result.authenticated === true);
    } catch (requestError) {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    getDealers();
    getSession();
  }, [getDealers, getSession]);

  const filterDealers = (state) => {
    setSelectedState(state);
    getDealers(state);
  };

  return (
    <div>
      <Header />
      <main className="dealers_page">
        <h1>Dealerships</h1>
        {loading && <p role="status">Loading dealerships...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && dealersList.length === 0 && (
          <p>No dealerships found for this state.</p>
        )}
        {!loading && !error && dealersList.length > 0 && (
          <div className="table-responsive">
            <table className="table">
              <caption>Best Cars dealerships</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Dealer Name</th>
                  <th scope="col">City</th>
                  <th scope="col">Address</th>
                  <th scope="col">Zip</th>
                  <th scope="col">
                    <label htmlFor="state">State</label>
                    <select
                      name="state"
                      id="state"
                      value={selectedState}
                      onChange={(event) => filterDealers(event.target.value)}
                    >
                      <option value="All">All States</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </th>
                  {isLoggedIn && <th scope="col">Review Dealer</th>}
                </tr>
              </thead>
              <tbody>
                {dealersList.map((dealer) => (
                  <tr key={dealer.id}>
                    <td>{dealer.id}</td>
                    <td>
                      <a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a>
                    </td>
                    <td>{dealer.city}</td>
                    <td>{dealer.address}</td>
                    <td>{dealer.zip}</td>
                    <td>{dealer.state}</td>
                    {isLoggedIn && (
                      <td>
                        <a href={`/postreview/${dealer.id}`}>
                          <img
                            src={reviewIcon}
                            className="review_icon"
                            alt="Review this dealer"
                          />
                        </a>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dealers;
