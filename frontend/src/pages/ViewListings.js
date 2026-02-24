import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, FaWifi, FaKitchen, FaCar, FaTv, 
  FaSnowflake, FaEdit, FaTrash, FaPlus,
  FaBed, FaBath, FaUsers, FaMapMarkerAlt,
  FaStar, FaImage
} from 'react-icons/fa';
import API from '../utils/api';
import { listings as mockListings } from '../data/Listings';
import './ViewListings.css';

const ViewListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchHostListings();
  }, []);

  const fetchHostListings = async () => {
    try {
      const response = await API.get('/accommodations');
      
      if (response.data && response.data.length > 0) {
        setListings(response.data);
        setUseMockData(false);
      } else {
        setListings(mockListings || []);
        setUseMockData(true);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(mockListings || []);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        if (useMockData) {
          setListings(listings.filter(listing => listing.id !== id));
          alert('Listing deleted (demo mode)');
        } else {
          await API.delete(`/accommodations/${id}`);
          setListings(listings.filter(listing => listing._id !== id));
          alert('Listing deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'R 0';
    return `R ${price.toLocaleString()}`;
  };

  // Don't render anything while loading
  if (loading) {
    return (
      <div className="host-listings-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Ensure listings is always an array
  const safeListings = listings || [];

  return (
    <div className="host-listings-page">
      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <h1>My Hotel List</h1>
            <p className="user-greeting">
              Welcome back, <strong>{user?.name || 'John Doe'}</strong>
            </p>
          </div>
          
          <Link to="/admin/create-listing" className="btn-create">
            <FaPlus />
            <span>Create New Listing</span>
          </Link>
        </div>

        <div className="dashboard-nav">
          <Link to="/reservations" className="nav-item">
            View Reservations
          </Link>
          <Link to="/admin/listings" className="nav-item active">
            View Listings
          </Link>
          <Link to="/admin/create-listing" className="nav-item">
            Create Listing
          </Link>
        </div>

        {useMockData && (
          <div className="demo-banner">
            <p>📋 Showing {safeListings.length} sample listings from your Listings.js file</p>
          </div>
        )}

        {safeListings.length === 0 ? (
          <div className="empty-state">
            <FaHome size={48} />
            <h3>No listings yet</h3>
            <p>Create your first listing to start hosting</p>
            <Link to="/admin/create-listing" className="btn-primary">
              Create a Listing
            </Link>
          </div>
        ) : (
          <div className="listings-container">
            <h2 className="section-title">My Hotel List ({safeListings.length} properties)</h2>
            
            <div className="listings-grid-horizontal">
              {safeListings.map((listing) => {
                // Safely access listing properties with defaults
                const listingId = listing?._id || listing?.id;
                const listingTitle = listing?.title || 'Untitled';
                const listingCity = listing?.city || listing?.location || 'Unknown';
                const listingCountry = listing?.country || '';
                const listingPrice = listing?.price || 0;
                const listingRating = listing?.rating || 4.5;
                const listingReviews = listing?.reviews || 0;
                const listingGuests = listing?.guests || listing?.maxGuests || 2;
                const listingBedrooms = listing?.bedrooms || 1;
                const listingBathrooms = listing?.bathrooms || 1;
                const listingType = listing?.type || 'Entire Home';
                const listingDescription = listing?.description || '';
                const listingAmenities = listing?.amenities || [];
                const listingImage = listing?.images?.[0] || listing?.image || 'https://source.unsplash.com/random/400x300?hotel';

                return (
                  <div key={listingId || Math.random()} className="listing-card-horizontal">
                    <div className="listing-image">
                      <img src={listingImage} alt={listingTitle} />
                      <span className="status-badge active">Active</span>
                    </div>

                    <div className="listing-details">
                      <div className="listing-header">
                        <div>
                          <h3 className="listing-title">{listingTitle}</h3>
                          <p className="listing-location">
                            <FaMapMarkerAlt /> {listingCity}{listingCountry ? `, ${listingCountry}` : ''}
                          </p>
                        </div>
                        <div className="listing-rating">
                          <FaStar className="star-icon" />
                          <span>{listingRating}</span>
                          <span className="reviews-count">({listingReviews})</span>
                        </div>
                      </div>

                      <div className="listing-specs">
                        <span className="spec">
                          <FaUsers /> {listingGuests} guests
                        </span>
                        <span className="spec">
                          <FaHome /> {listingType}
                        </span>
                        <span className="spec">
                          <FaBed /> {listingBedrooms} bedrooms
                        </span>
                        <span className="spec">
                          <FaBath /> {listingBathrooms} baths
                        </span>
                      </div>

                      {listingDescription && (
                        <p className="listing-description">
                          {listingDescription.substring(0, 100)}...
                        </p>
                      )}

                      {listingAmenities.length > 0 && (
                        <div className="listing-amenities">
                          {listingAmenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="amenity-tag">
                              {amenity}
                            </span>
                          ))}
                          {listingAmenities.length > 3 && (
                            <span className="amenity-tag">+{listingAmenities.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="listing-footer">
                        <div className="listing-price">
                          <span className="price">{formatPrice(listingPrice)}</span>
                          <span className="per-night">/night</span>
                        </div>
                        
                        <div className="listing-actions">
                          <Link 
                            to={`/admin/update-listing/${listingId}`} 
                            className="btn-update"
                          >
                            <FaEdit />
                            <span>Update</span>
                          </Link>
                          <button 
                            onClick={() => handleDelete(listingId)} 
                            className="btn-delete"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="quick-stats">
          <div className="stat-card">
            <h4>Total Listings</h4>
            <p className="stat-number">{safeListings.length}</p>
          </div>
          <div className="stat-card">
            <h4>Active Listings</h4>
            <p className="stat-number">{safeListings.length}</p>
          </div>
          <div className="stat-card">
            <h4>Avg Rating</h4>
            <p className="stat-number">
              {safeListings.length > 0 
                ? (safeListings.reduce((acc, curr) => acc + (curr.rating || 4.5), 0) / safeListings.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
          <div className="stat-card">
            <h4>Avg Price</h4>
            <p className="stat-number">
              {safeListings.length > 0
                ? `R ${Math.round(safeListings.reduce((acc, curr) => acc + (curr.price || 0), 0) / safeListings.length).toLocaleString()}`
                : 'R 0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewListings;