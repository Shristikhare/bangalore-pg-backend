import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const AMENITY_OPTIONS = [
  'wifi', 'ac', 'food', 'laundry', 'housekeeping', 'parking',
  'power_backup', 'cctv', 'geyser', 'fridge', 'tv', 'gym', 'lift', 'attached_bathroom',
];

const emptyForm = {
  name: '',
  description: '',
  genderType: 'boys',
  locality: '',
  fullAddress: '',
  landmark: '',
  priceMonthly: '',
  securityDeposit: '',
  contactPhone: '',
  totalBeds: '',
  availableBeds: '',
  foodIncluded: false,
  foodType: 'none',
  amenities: [],
  rules: '',
  roomTypes: [{ type: 'single', price: '', availableBeds: '' }],
};

const AddEditPG = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/pgs/${id}`).then(({ data }) => {
        setForm({
          ...data,
          rules: (data.rules || []).join('\n'),
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleRoomTypeChange = (idx, field, value) => {
    const updated = [...form.roomTypes];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, roomTypes: updated });
  };

  const addRoomType = () => {
    setForm({ ...form, roomTypes: [...form.roomTypes, { type: 'single', price: '', availableBeds: '' }] });
  };

  const removeRoomType = (idx) => {
    setForm({ ...form, roomTypes: form.roomTypes.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        priceMonthly: Number(form.priceMonthly),
        securityDeposit: Number(form.securityDeposit),
        totalBeds: Number(form.totalBeds),
        availableBeds: Number(form.availableBeds),
        rules: form.rules.split('\n').filter((r) => r.trim()),
        roomTypes: form.roomTypes.map((rt) => ({
          ...rt,
          price: Number(rt.price),
          availableBeds: Number(rt.availableBeds),
        })),
      };

      if (isEdit) {
        await api.put(`/pgs/${id}`, payload);
      } else {
        await api.post('/pgs', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pg-page">
      <h1>{isEdit ? 'Edit PG Listing' : 'Add New PG Listing'}</h1>

      <form className="pg-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <div className="form-row">
          <div>
            <label>PG Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Gender Type *</label>
            <select name="genderType" value={form.genderType} onChange={handleChange}>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <label>Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Locality *</label>
            <input type="text" name="locality" placeholder="e.g. Koramangala" value={form.locality} onChange={handleChange} required />
          </div>
          <div>
            <label>Landmark</label>
            <input type="text" name="landmark" value={form.landmark} onChange={handleChange} />
          </div>
        </div>

        <label>Full Address *</label>
        <input type="text" name="fullAddress" value={form.fullAddress} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Monthly Price (₹) *</label>
            <input type="number" name="priceMonthly" value={form.priceMonthly} onChange={handleChange} required />
          </div>
          <div>
            <label>Security Deposit (₹) *</label>
            <input type="number" name="securityDeposit" value={form.securityDeposit} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Total Beds *</label>
            <input type="number" name="totalBeds" value={form.totalBeds} onChange={handleChange} required />
          </div>
          <div>
            <label>Available Beds *</label>
            <input type="number" name="availableBeds" value={form.availableBeds} onChange={handleChange} required />
          </div>
        </div>

        <label>Contact Phone *</label>
        <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange} required />

        <label className="checkbox-label">
          <input type="checkbox" name="foodIncluded" checked={form.foodIncluded} onChange={handleChange} />
          {' '}Food Included
        </label>

        {form.foodIncluded && (
          <>
            <label>Food Type</label>
            <select name="foodType" value={form.foodType} onChange={handleChange}>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="both">Both</option>
            </select>
          </>
        )}

        <label>Amenities</label>
        <div className="amenity-checkboxes">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="checkbox-label">
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a.replace(/_/g, ' ')}
            </label>
          ))}
        </div>

        <label>Room Types & Pricing</label>
        {form.roomTypes.map((rt, idx) => (
          <div key={idx} className="room-type-row">
            <select value={rt.type} onChange={(e) => handleRoomTypeChange(idx, 'type', e.target.value)}>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="dormitory">Dormitory</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={rt.price}
              onChange={(e) => handleRoomTypeChange(idx, 'price', e.target.value)}
            />
            <input
              type="number"
              placeholder="Beds available"
              value={rt.availableBeds}
              onChange={(e) => handleRoomTypeChange(idx, 'availableBeds', e.target.value)}
            />
            <button type="button" onClick={() => removeRoomType(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline" onClick={addRoomType}>
          + Add Room Type
        </button>

        <label>House Rules (one per line)</label>
        <textarea
          name="rules"
          value={form.rules}
          onChange={handleChange}
          placeholder={'No smoking\nNo alcohol\nGate closes at 10:30 PM'}
        />

        <button type="submit" className="btn btn-primary full-width" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddEditPG;
