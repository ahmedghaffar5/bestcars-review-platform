import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer';

const PAGE_SIZE = 9;

const Dealers = () => {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [search, setSearch] = useState(query.get('q') || '');
  const [selectedState, setSelectedState] = useState(query.get('state') || 'All');
  const [sort, setSort] = useState(query.get('sort') || 'name');
  const [page, setPage] = useState(Number(query.get('page')) || 1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDealers = useCallback(async (state = 'All') => {
    setLoading(true);
    setError('');
    const endpoint = state === 'All' ? '/djangoapp/get_dealers' : `/djangoapp/get_dealers/${encodeURIComponent(state)}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      if (!response.ok || result.status !== 200) throw new Error(result.message || 'Unable to load dealerships');
      const allDealers = Array.isArray(result.dealers) ? result.dealers : [];
      setDealersList(allDealers);
      if (state === 'All') setStates([...new Set(allDealers.map((dealer) => dealer.state).filter(Boolean))].sort());
    } catch (requestError) {
      setError(requestError.message);
      setDealersList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDealers(selectedState);
    fetch('/djangoapp/session')
      .then((response) => response.json())
      .then((result) => setIsLoggedIn(result.authenticated === true))
      .catch(() => setIsLoggedIn(false));
  }, [getDealers, selectedState]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (selectedState !== 'All') params.set('state', selectedState);
    if (sort !== 'name') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
  }, [search, selectedState, sort, page]);

  const filteredDealers = dealersList
    .filter((dealer) => `${dealer.full_name} ${dealer.city} ${dealer.address}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => sort === 'city'
      ? `${a.city}, ${a.full_name}`.localeCompare(`${b.city}, ${b.full_name}`)
      : a.full_name.localeCompare(b.full_name));
  const pageCount = Math.max(1, Math.ceil(filteredDealers.length / PAGE_SIZE));
  const visibleDealers = filteredDealers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setSearch('');
    setSelectedState('All');
    setSort('name');
    setPage(1);
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="site-container page-main">
        <div className="page-heading">
          <div>
            <span className="eyebrow">The directory</span>
            <h1>Find a better starting point.</h1>
            <p>Browse the sample Best Cars directory, then read the experiences that matter before you visit.</p>
          </div>
          {!loading && <span className="muted">{filteredDealers.length} dealerships</span>}
        </div>
        <section className="card" style={{ padding: '1rem' }} aria-label="Directory filters">
          <div className="filters">
            <div className="form-field">
              <label htmlFor="dealer-search">Search by name or city</label>
              <input id="dealer-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="e.g. Chicago or Motors" />
            </div>
            <div className="form-field">
              <label htmlFor="state">State</label>
              <select id="state" value={selectedState} onChange={(event) => { setSelectedState(event.target.value); setPage(1); }}>
                <option value="All">All states</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="sort">Sort</label>
              <select id="sort" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <option value="name">Name</option>
                <option value="city">City</option>
              </select>
            </div>
          </div>
          <button className="button button-secondary" type="button" onClick={reset}>Reset filters</button>
        </section>
        {loading && <p className="status" role="status">Loading dealerships...</p>}
        {error && <div className="alert" role="alert">{error} <button className="button button-secondary" type="button" onClick={() => getDealers(selectedState)}>Retry</button></div>}
        {!loading && !error && visibleDealers.length === 0 && <p className="status">No dealerships match those filters. Try a broader search.</p>}
        {!loading && !error && visibleDealers.length > 0 && (
          <>
            <div className="dealer-grid" aria-live="polite">
              {visibleDealers.map((dealer) => (
                <article className="card dealer-card" key={dealer.id}>
                  <span className="eyebrow">{dealer.state || 'United States'}</span>
                  <h2>{dealer.full_name}</h2>
                  <div className="dealer-meta">
                    <span>{dealer.city}</span>
                    <span>{dealer.address}</span>
                    <span>{dealer.zip}</span>
                  </div>
                  <a className="button button-secondary" href={`/dealer/${dealer.id}`}>View details</a>
                  {isLoggedIn ? <a className="muted" href={`/postreview/${dealer.id}`} style={{ marginTop: '.7rem', fontSize: '.9rem' }}>Write a review</a> : <a className="muted" href="/login" style={{ marginTop: '.7rem', fontSize: '.9rem' }}>Sign in to review</a>}
                </article>
              ))}
            </div>
            <div className="pagination">
              <span>Page {page} of {pageCount}</span>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button className="button button-secondary" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button>
                <button className="button button-secondary" type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dealers;
