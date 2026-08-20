import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statusColor = {
  pending: '#f59e0b',
  contacted: '#3b82f6',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/enquiries/mine')
      .then(({ data }) => setEnquiries(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="my-enquiries-page">
      <h1>My Enquiries</h1>

      {enquiries.length === 0 ? (
        <p className="empty-state">
          You haven't sent any enquiries yet. <Link to="/pgs">Browse PGs</Link>
        </p>
      ) : (
        <div className="enquiry-list">
          {enquiries.map((enq) => (
            <div key={enq._id} className="enquiry-card">
              <div>
                <h3>{enq.pg?.name}</h3>
                <p>📍 {enq.pg?.locality}</p>
                <p>₹{enq.pg?.priceMonthly?.toLocaleString('en-IN')}/mo</p>
                {enq.moveInDate && <p>Move-in: {new Date(enq.moveInDate).toLocaleDateString()}</p>}
              </div>
              <span
                className="status-badge"
                style={{ backgroundColor: statusColor[enq.status] }}
              >
                {enq.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnquiries;
