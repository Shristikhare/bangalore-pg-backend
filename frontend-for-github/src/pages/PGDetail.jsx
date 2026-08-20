import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PGDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: user?.name || '', phone: user?.phone || '', message: '', moveInDate: '' });
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/pgs/${id}`);
        setPg(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    try {
      await api.post('/enquiries', { pgId: id, ...enquiryForm });
      setEnquirySuccess(true);
      setShowEnquiry(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enquiry');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    try {
      await api.post(`/pgs/${id}/reviews`, reviewForm);
      const { data } = await api.get(`/pgs/${id}`);
      setPg(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!pg) return <div className="empty-state">PG not found</div>;

  return (
    <div className="pg-detail-page">
      <div className="pg-detail-gallery">
        <div className="main-image">
          {pg.images && pg.images.length > 0 ? (
            <img src={pg.images[activeImage]} alt={pg.name} />
          ) : (
            <div className="pg-card-placeholder large">🏢</div>
          )}
        </div>
        {pg.images && pg.images.length > 1 && (
          <div className="thumbnail-row">
            {pg.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className={idx === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pg-detail-content">
        <div className="pg-detail-main">
          <div className="pg-detail-title-row">
            <div>
              <h1>{pg.name}</h1>
              <p className="pg-locality">📍 {pg.fullAddress}</p>
              {pg.landmark && <p className="pg-landmark">Landmark: {pg.landmark}</p>}
            </div>
            <span className={`gender-tag ${pg.genderType}`}>{pg.genderType.toUpperCase()}</span>
          </div>

          {pg.avgRating > 0 && (
            <div className="rating-summary">
              ⭐ {pg.avgRating.toFixed(1)} · {pg.numReviews} reviews
            </div>
          )}

          <section className="detail-section">
            <h2>About this PG</h2>
            <p>{pg.description}</p>
          </section>

          <section className="detail-section">
            <h2>Room Types & Pricing</h2>
            <div className="room-types-grid">
              {pg.roomTypes?.map((rt, idx) => (
                <div key={idx} className="room-type-card">
                  <h4>{rt.type} sharing</h4>
                  <p className="room-price">₹{rt.price?.toLocaleString('en-IN')}/mo</p>
                  <p className="room-availability">
                    {rt.availableBeds > 0 ? `${rt.availableBeds} beds available` : 'Full'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {pg.amenities?.map((a) => (
                <div key={a} className="amenity-item">
                  ✓ {a.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </section>

          {pg.foodIncluded && (
            <section className="detail-section">
              <h2>Food</h2>
              <p>Food included — {pg.foodType} meals provided</p>
            </section>
          )}

          {pg.rules && pg.rules.length > 0 && (
            <section className="detail-section">
              <h2>House Rules</h2>
              <ul className="rules-list">
                {pg.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="detail-section">
            <h2>Reviews ({pg.numReviews})</h2>
            {pg.reviews && pg.reviews.length > 0 ? (
              <div className="reviews-list">
                {pg.reviews.map((r, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <strong>{r.userName}</strong>
                      <span>⭐ {r.rating}</span>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4>Write a Review</h4>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-outline">
                Submit Review
              </button>
            </form>
          </section>
        </div>

        <aside className="pg-detail-sidebar">
          <div className="price-box">
            <p className="price-label">Starting from</p>
            <p className="price-value">₹{pg.priceMonthly?.toLocaleString('en-IN')}/month</p>
            <p className="deposit-info">Security Deposit: ₹{pg.securityDeposit?.toLocaleString('en-IN')}</p>
            <p className="beds-info">
              {pg.availableBeds > 0 ? `${pg.availableBeds} beds available` : 'Currently Full'}
            </p>

            {enquirySuccess ? (
              <div className="success-message">
                ✓ Enquiry sent! The owner will contact you soon.
              </div>
            ) : (
              <button className="btn btn-primary full-width" onClick={() => setShowEnquiry(!showEnquiry)}>
                Send Enquiry
              </button>
            )}

            <a href={`tel:${pg.contactPhone}`} className="btn btn-outline full-width">
              📞 Call Owner
            </a>

            {showEnquiry && (
              <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
                {error && <p className="error-text">{error}</p>}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={enquiryForm.moveInDate}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, moveInDate: e.target.value })}
                />
                <textarea
                  placeholder="Message (optional)"
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                />
                <button type="submit" className="btn btn-primary full-width">
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PGDetail;
