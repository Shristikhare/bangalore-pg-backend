import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const OwnerDashboard = () => {
  const [pgs, setPgs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pgRes, enqRes] = await Promise.all([
        api.get('/pgs/owner/mine'),
        api.get('/enquiries/received'),
      ]);
      setPgs(pgRes.data);
      setEnquiries(enqRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await api.delete(`/pgs/${id}`);
      setPgs(pgs.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleStatusChange = async (enqId, status) => {
    try {
      await api.put(`/enquiries/${enqId}/status`, { status });
      setEnquiries(enquiries.map((e) => (e._id === enqId ? { ...e, status } : e)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <Link to="/dashboard/add" className="btn btn-primary">
          + Add New PG
        </Link>
      </div>

      <div className="dashboard-tabs">
        <button className={tab === 'listings' ? 'active' : ''} onClick={() => setTab('listings')}>
          My Listings ({pgs.length})
        </button>
        <button className={tab === 'enquiries' ? 'active' : ''} onClick={() => setTab('enquiries')}>
          Enquiries ({enquiries.length})
        </button>
      </div>

      {tab === 'listings' && (
        <div className="dashboard-table-wrap">
          {pgs.length === 0 ? (
            <p className="empty-state">You haven't listed any PGs yet.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Locality</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Beds</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pgs.map((pg) => (
                  <tr key={pg._id}>
                    <td>{pg.name}</td>
                    <td>{pg.locality}</td>
                    <td>{pg.genderType}</td>
                    <td>₹{pg.priceMonthly.toLocaleString('en-IN')}</td>
                    <td>{pg.availableBeds}/{pg.totalBeds}</td>
                    <td>
                      <span className={`status-badge ${pg.isActive ? 'active' : 'inactive'}`}>
                        {pg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <Link to={`/dashboard/edit/${pg._id}`}>Edit</Link>
                      <button onClick={() => handleDelete(pg._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'enquiries' && (
        <div className="dashboard-table-wrap">
          {enquiries.length === 0 ? (
            <p className="empty-state">No enquiries received yet.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>PG</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td>{enq.pg?.name}</td>
                    <td>{enq.name}</td>
                    <td>{enq.phone}</td>
                    <td>{enq.message || '-'}</td>
                    <td>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
