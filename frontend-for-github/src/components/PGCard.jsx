import { Link } from 'react-router-dom';

const genderLabel = {
  boys: 'Boys PG',
  girls: 'Girls PG',
  unisex: 'Unisex PG',
};

const genderColor = {
  boys: '#2563eb',
  girls: '#db2777',
  unisex: '#7c3aed',
};

const PGCard = ({ pg }) => {
  const image = pg.images && pg.images.length > 0 ? pg.images[0] : null;

  return (
    <Link to={`/pgs/${pg._id}`} className="pg-card">
      <div className="pg-card-image">
        {image ? (
          <img src={image} alt={pg.name} />
        ) : (
          <div className="pg-card-placeholder">🏢</div>
        )}
        <span
          className="pg-gender-badge"
          style={{ backgroundColor: genderColor[pg.genderType] }}
        >
          {genderLabel[pg.genderType]}
        </span>
        {pg.isVerified && <span className="pg-verified-badge">✓ Verified</span>}
      </div>

      <div className="pg-card-body">
        <h3>{pg.name}</h3>
        <p className="pg-locality">📍 {pg.locality}, Bangalore</p>

        <div className="pg-price-row">
          <span className="pg-price">₹{pg.priceMonthly?.toLocaleString('en-IN')}/mo</span>
          {pg.avgRating > 0 && (
            <span className="pg-rating">⭐ {pg.avgRating.toFixed(1)} ({pg.numReviews})</span>
          )}
        </div>

        <div className="pg-amenities-row">
          {pg.amenities?.slice(0, 4).map((a) => (
            <span key={a} className="amenity-chip">
              {a.replace(/_/g, ' ')}
            </span>
          ))}
          {pg.amenities?.length > 4 && <span className="amenity-chip">+{pg.amenities.length - 4} more</span>}
        </div>

        <div className="pg-card-footer">
          <span className="beds-available">
            {pg.availableBeds > 0 ? `${pg.availableBeds} beds available` : 'Currently full'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
