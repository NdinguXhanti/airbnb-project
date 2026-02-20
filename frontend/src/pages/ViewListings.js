// src/pages/ViewListings.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, FaWifi, FaKitchen, FaCar, FaTv, 
  FaSnowflake, FaEdit, FaTrash, FaPlus,
  FaBed, FaBath, FaUsers, FaMapMarkerAlt,
  FaStar, FaImage
} from 'react-icons/fa';
import API from '../utils/api';
import './ViewListings.css';

const ViewListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchHostListings();
  }, []);

  const fetchHostListings = async () => {
    try {
      // Get all listings (you can filter by host ID on backend)
      const response = await API.get('/accommodations');
      
      // For demo, show first few listings
      // In production, your backend should filter by host ID
      setListings(response.data.slice(0, 2));
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback data that matches the screenshot
      setListings(fallbackListings);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/accommodations/${id}`);
        setListings(listings.filter(listing => listing._id !== id));
        alert('Listing deleted successfully');
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      }
    }
  };

  // Fallback data matching the screenshot
  const fallbackListings = [
    {
      _id: '1',
      title: '3 Room Bedroom',
      location: 'Sandton City Hotel',
      description: 'Luxurious suite in the heart of Sandton',
      price: 325,
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      propertyType: 'Entire Home',
      bedCount: 5,
      amenities: ['Wifi', 'Kitchen', 'Free Parking'],
      images: ['https://source.unsplash.com/random/800x600?sandton-hotel'],
      status: 'active'
    },
    {
      _id: '2',
      title: 'Entire home in Bordeaux',
      location: 'Woodmead City Hotel',
      description: 'Elegant apartment with city views',
      price: 125,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      propertyType: 'Entire Home',
      bedCount: 3,
      amenities: ['Wifi', 'Kitchen', 'Free Parking'],
      images: ['https://source.unsplash.com/random/800x600?woodmead-hotel'],
      status: 'active'
    }
  ];

  if (loading) {
    return (
      <div className="host-listings-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="host-listings-page">
      <div className="container">
        {/* Header with User Info */}
        <div className="page-header">
          <div className="header-left">
            <h1>My Hotel List</h1>
            <p className="user-greeting">
              Welcome back, <strong>{user?.name || 'John Doe'}</strong>
            </p>
          </div>
          
          {/* Create Listing Button */}
          <Link to="/admin/create-listing" className="btn-create">
            <FaPlus />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* Dashboard Navigation */}
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

        {/* Listings Grid */}
        {listings.length === 0 ? (
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
            <h2 className="section-title">My Hotel List</h2>
            
            <div className="listings-grid-horizontal">
              {listings.map((listing) => (
                <div key={listing._id} className="listing-card-horizontal">
                  {/* Listing Image */}
                  <div className="listing-image">
                    <img 
                      src={listing.images[0] || 'https://source.unsplash.com/random/400x300?hotel'} 
                      alt={listing.title} 
                    />
                    {listing.status === 'active' && (
                      <span className="status-badge active">Active</span>
                    )}
                  </div>

                  {/* Listing Details */}
                  <div className="listing-details">
                    <div className="listing-header">
                      <div>
                        <h3 className="listing-title">{listing.title}</h3>
                        <p className="listing-location">
                          <FaMapMarkerAlt /> {listing.location}
                        </p>
                      </div>
                      <div className="listing-price">
                        <span className="price">${listing.price}</span>
                        <span className="per-night">/night</span>
                      </div>
                    </div>

                    <div className="listing-specs">
                      <span className="spec">
                        <FaUsers /> {listing.maxGuests || 4}-{listing.maxGuests + 2 || 6} guests
                      </span>
                      <span className="spec">
                        <FaHome /> {listing.propertyType || 'Entire Home'}
                      </span>
                      <span className="spec">
                        <FaBed /> {listing.bedCount || 5} beds
                      </span>
                      <span className="spec">
                        <FaBath /> {listing.bathrooms || 3} bath
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="listing-amenities">
                      {listing.amenities?.map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="listing-actions">
                      <Link 
                        to={`/admin/update-listing/${listing._id}`} 
                        className="btn-update"
                      >
                        <FaEdit />
                        <span>Update</span>
                      </Link>
                      <button 
                        onClick={() => handleDelete(listing._id)} 
                        className="btn-delete"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <h4>Total Listings</h4>
            <p className="stat-number">{listings.length}</p>
          </div>
          <div className="stat-card">
            <h4>Active Listings</h4>
            <p className="stat-number">
              {listings.filter(l => l.status === 'active').length}
            </p>
          </div>
          <div className="stat-card">
            <h4>Total Bookings</h4>
            <p className="stat-number">24</p>
          </div>
          <div className="stat-card">
            <h4>Revenue</h4>
            <p className="stat-number">$3,450</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewListings;