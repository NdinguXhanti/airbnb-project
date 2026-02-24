import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import API from '../utils/api';
import { listings as mockListings } from '../data/Listings';
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
    if (cityParam) {
      setSearch(cityParam);
    }
  }, [cityParam]);

  useEffect(() => {
    fetchListings();
  }, [search, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('location', search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.guests) params.append('guests', filters.guests);

      const response = await API.get(`/accommodations?${params.toString()}`);
      
      if (response.data && response.data.length > 0) {
        setListings(response.data);
      } else {
        filterMockData();
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      filterMockData();
    } finally {
      setLoading(false);
    }
  };

  const filterMockData = () => {
    let filtered = [...mockListings];
    
    if (search) {
      filtered = filtered.filter(listing => 
        listing.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= parseInt(filters.maxPrice));
    }
    
    if (filters.bedrooms) {
      filtered = filtered.filter(listing => listing.bedrooms >= parseInt(filters.bedrooms));
    }
    
    if (filters.guests) {
      filtered = filtered.filter(listing => listing.guests >= parseInt(filters.guests));
    }
    
    setListings(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', bedrooms: '', guests: '' });
    setSearch('');
  };

  const formatPrice = (price) => {
    if (!price) return 'R 0';
    return `R ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="location-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

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
              </div>
            </div>
          )}
        </div>

        <div className="results-header">
          <h2>{listings.length} properties found {search && `in ${search}`}</h2>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">
            <h3>No properties found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => {
              const listingId = listing._id || listing.id;
              const listingImage = listing.images?.[0] || listing.image || 'https://source.unsplash.com/random/400x300?hotel';
              const listingCity = listing.city || listing.location || '';
              const listingCountry = listing.country || '';
              const listingGuests = listing.guests || listing.maxGuests || 2;
              
              return (
                <Link to={`/location/${listingId}`} key={listingId} className="listing-card">
                  <div className="listing-image">
                    <img src={listingImage} alt={listing.title} />
                    <div className="listing-price">{formatPrice(listing.price)}<small>/night</small></div>
                  </div>
                  <div className="listing-content">
                    <div className="listing-header">
                      <h3>{listing.title}</h3>
                      <div className="listing-rating">
                        <FaStar size={14} color="#FF385C" />
                        <span>{listing.rating || 4.5}</span>
                      </div>
                    </div>
                    <p className="listing-location">
                      <FaMapMarkerAlt size={12} />
                      {listingCity}{listingCountry ? `, ${listingCountry}` : ''}
                    </p>
                    <p className="listing-description">{listing.description}</p>
                    <div className="listing-details">
                      <span>{listing.bedrooms} bedrooms</span>
                      <span>•</span>
                      <span>{listing.bathrooms} bathrooms</span>
                      <span>•</span>
                      <span>{listingGuests} guests</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;