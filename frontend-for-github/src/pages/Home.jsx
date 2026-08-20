import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PGCard from '../components/PGCard';

const Home = () => {
  const [search, setSearch] = useState('');
  const [genderType, setGenderType] = useState('all');
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await api.get('/pgs', { params: { limit: 6, sortBy: 'rating' } });
        setFeatured(data.pgs);
      } catch (err) {
        console.error(err);
      }
    };
    loadFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genderType !== 'all') params.set('gender', genderType);
    navigate(`/pgs?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect PG in Bangalore</h1>
          <p>Verified Boys & Girls PG accommodations across Koramangala, HSR Layout, Indiranagar & more</p>

          <form className="hero-search" onSubmit={handleSearch}>
            <select value={genderType} onChange={(e) => setGenderType(e.target.value)}>
              <option value="all">Any Gender</option>
              <option value="boys">Boys PG</option>
              <option value="girls">Girls PG</option>
              <option value="unisex">Unisex</option>
            </select>
            <input
              type="text"
              placeholder="Search by locality, e.g. Koramangala"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Search PGs
            </button>
          </form>

          <div className="hero-stats">
            <div>
              <strong>500+</strong>
              <span>PG Listings</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Localities</span>
            </div>
            <div>
              <strong>10k+</strong>
              <span>Happy Tenants</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-categories">
        <div
          className="category-card boys"
          onClick={() => navigate('/pgs?gender=boys')}
        >
          <h3>Boys PG</h3>
          <p>Find verified PGs exclusively for boys</p>
        </div>
        <div
          className="category-card girls"
          onClick={() => navigate('/pgs?gender=girls')}
        >
          <h3>Girls PG</h3>
          <p>Safe & secure PGs exclusively for girls</p>
        </div>
        <div
          className="category-card unisex"
          onClick={() => navigate('/pgs?gender=unisex')}
        >
          <h3>Unisex PG</h3>
          <p>Co-ed accommodations with separate floors</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-section">
          <h2>Top Rated PGs</h2>
          <div className="pg-grid">
            {featured.map((pg) => (
              <PGCard key={pg._id} pg={pg} />
            ))}
          </div>
        </section>
      )}

      <section className="cta-owner">
        <h2>Own a PG in Bangalore?</h2>
        <p>List your property and reach thousands of tenants looking for PG accommodation.</p>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          List Your PG
        </button>
      </section>
    </div>
  );
};

export default Home;
