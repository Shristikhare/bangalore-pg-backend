const AMENITY_OPTIONS = [
  'wifi', 'ac', 'food', 'laundry', 'housekeeping', 'parking',
  'power_backup', 'cctv', 'geyser', 'fridge', 'tv', 'gym',
];

const FilterSidebar = ({ filters, setFilters, localities, onApply, onReset }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters((prev) => {
      const current = prev.amenities ? prev.amenities.split(',') : [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated.join(',') };
    });
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Gender</label>
        <div className="filter-radio-group">
          {['all', 'boys', 'girls', 'unisex'].map((g) => (
            <label key={g} className="radio-label">
              <input
                type="radio"
                name="genderType"
                checked={(filters.genderType || 'all') === g}
                onChange={() => handleChange('genderType', g)}
              />
              {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Locality</label>
        <select
          value={filters.locality || ''}
          onChange={(e) => handleChange('locality', e.target.value)}
        >
          <option value="">All Localities</option>
          {localities.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range (₹/month)</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={filters.foodIncluded === 'true'}
            onChange={(e) => handleChange('foodIncluded', e.target.checked ? 'true' : '')}
          />
          {' '}Food Included
        </label>
      </div>

      <div className="filter-group">
        <label>Amenities</label>
        <div className="amenity-checkboxes">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.amenities || '').split(',').includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a.replace(/_/g, ' ')}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn btn-primary" onClick={onApply}>
          Apply Filters
        </button>
        <button className="btn btn-outline" onClick={onReset}>
          Reset
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
