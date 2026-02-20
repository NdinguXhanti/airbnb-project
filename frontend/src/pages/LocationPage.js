import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { fetchListings } from '../utils/listingService';
import './LocationPage.css';

const LocationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cityParam = queryParams.get('city');
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(cityParam || '');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    guests: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const params = {};
      if (search) params.location = search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.guests) params.guests = filters.guests;

      const response = await fetchListings(params);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchListings();
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', bedrooms: '', guests: '' });
    setSearch('');
    setLoading(true);
    fetchListings();
  };

  const formatPrice = (price) => {
    return `R ${price.toLocaleString()}`;
  };

  return (
    <div className="location-page">
      <div className="container">
        <div className="page-header">
          <h1>Places to stay</h1>
          <p>Discover amazing accommodations around the world</p>
        </div>

        <div className="search-filters">
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
              <FaFilter /> Filters
            </button>
          </form>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Min Price (R)</label>
                  <input 
                    type="number" 
                    name="minPrice" 
                    value={filters.minPrice} 
                    onChange={handleFilterChange} 
                    placeholder="0" 
                    min="0" 
                  />
                </div>
                <div className="filter-group">
                  <label>Max Price (R)</label>
                  <input 
                    type="number" 
                    name="maxPrice" 
                    value={filters.maxPrice} 
                    onChange={handleFilterChange} 
                    placeholder="10000" 
                    min="0" 
                  />
                </div>
                <div className="filter-group">
                  <label>Bedrooms</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                    <option value="">Any</option>
                    {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}+ bedrooms</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Guests</label>
                  <select name="guests" value={filters.guests} onChange={handleFilterChange}>
                    <option value="">Any</option>
                    {[1,2,3,4,5,6,8].map(num => <option key={num} value={num}>{num}+ guests</option>)}
                  </select>
                </div>
              </div>
              <div className="filter-actions">
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSearch}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="results-header">
          <h2>{listings.length} properties found</h2>
          <p>Explore our selection of accommodations</p>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <h3>No properties found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <Link to={`/location/${listing.id}`} key={listing.id} className="listing-card">
                <div className="listing-image">
                  <img src={listing.image} alt={listing.title} />
                  <div className="listing-price">{formatPrice(listing.price)}<small>/night</small></div>
                </div>
                <div className="listing-content">
                  <div className="listing-header">
                    <h3>{listing.title}</h3>
                    <div className="listing-rating">
                      <FaStar size={14} color="#FF385C" />
                      <span>{listing.rating}</span>
                    </div>
                  </div>
                  <p className="listing-location">
                    <FaMapMarkerAlt size={12} />
                    {listing.city}, {listing.country}
                  </p>
                  <p className="listing-description">{listing.description.substring(0, 80)}...</p>
                  <div className="listing-details">
                    <span>{listing.bedrooms} bd</span>
                    <span>•</span>
                    <span>{listing.bathrooms} ba</span>
                    <span>•</span>
                    <span>{listing.guests} guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;