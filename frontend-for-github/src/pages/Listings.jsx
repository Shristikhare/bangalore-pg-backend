import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import PGCard from '../components/PGCard';
import FilterSidebar from '../components/FilterSidebar';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [pgs, setPgs] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');

  const [filters, setFilters] = useState({
    genderType: searchParams.get('gender') || 'all',
    locality: searchParams.get('locality') || '',
    minPrice: '',
    maxPrice: '',
    amenities: '',
    foodIncluded: '',
    search: searchParams.get('search') || '',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    api.get('/pgs/localities').then(({ data }) => setLocalities(data)).catch(() => {});
  }, []);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...appliedFilters, page, limit: 9, sortBy };
      Object.keys(params).forEach((k) => (params[k] === '' || params[k] === 'all') && delete params[k]);

      const { data } = await api.get('/pgs', { params });
      setPgs(data.pgs);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, sortBy]);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  const handleApply = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const cleared = {
      genderType: 'all',
      locality: '',
      minPrice: '',
      maxPrice: '',
      amenities: '',
      foodIncluded: '',
      search: '',
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setPage(1);
  };

  return (
    <div className="listings-page">
      <div className="listings-header">
        <h1>PG Listings in Bangalore</h1>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="">Sort: Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="listings-body">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          localities={localities}
          onApply={handleApply}
          onReset={handleReset}
        />

        <div className="listings-results">
          {loading ? (
            <div className="loading-state">Loading PGs...</div>
          ) : pgs.length === 0 ? (
            <div className="empty-state">
              <p>No PGs found matching your filters.</p>
              <button className="btn btn-outline" onClick={handleReset}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="results-count">{pgs.length} PGs found</p>
              <div className="pg-grid">
                {pgs.map((pg) => (
                  <PGCard key={pg._id} pg={pg} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
