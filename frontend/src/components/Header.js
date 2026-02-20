// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaGlobe, FaUserCircle, FaBars,
  FaMapMarkerAlt, FaCalendar, FaUsers, FaSearch
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 0
  });

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (isHomePage) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.checkIn) queryParams.append('checkIn', searchParams.checkIn);
    if (searchParams.checkOut) queryParams.append('checkOut', searchParams.checkOut);
    if (searchParams.guests) queryParams.append('guests', searchParams.guests);
    
    navigate(`/locations?${queryParams.toString()}`);
    setShowSearchModal(false);
  };

  const incrementGuests = () => {
    setSearchParams({ ...searchParams, guests: searchParams.guests + 1 });
  };

  const decrementGuests = () => {
    if (searchParams.guests > 0) {
      setSearchParams({ ...searchParams, guests: searchParams.guests - 1 });
    }
  };

  const popularDestinations = [
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200' },
    { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200' },
    { name: 'Cape Town', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=200' },
    { name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=200' },
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200' }
  ];

  return (
    <header className="airbnb-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/airbnb-logo.png" alt="Airbnb" width="30" height="30" />
          <span>airbnb</span>
        </Link>

        <nav className="header-nav-center">
          <Link to="/locations" className={`nav-link ${location.pathname.includes('/locations') || location.pathname.includes('/location/') ? 'active' : ''}`}>
            Places to stay
          </Link>
          <Link to="/experiences" className="nav-link">Experiences</Link>
          <Link to="/online-experiences" className="nav-link">Online Experiences</Link>
        </nav>

        <div className="header-right">
          <Link to="/admin/create-listing" className="become-host-link">
            Become a host
          </Link>
          
          <button className="language-btn">
            <FaGlobe />
          </button>
          
          <div className="user-menu-container">
            <button 
              className="user-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars />
              <FaUserCircle />
            </button>
            
            {showMenu && (
              <div className="user-dropdown">
                {isLoggedIn ? (
                  <>
                    <div className="dropdown-header">
                      <span className="user-name">{user?.name || 'User'}</span>
                      <span className="user-email">{user?.email || ''}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/reservations" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      Reservations
                    </Link>
                    <Link to="/admin/listings" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      My listings
                    </Link>
                    <Link to="/account" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      Account
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      Log in
                    </Link>
                    <Link to="/register" className="dropdown-item" onClick={() => setShowMenu(false)}>
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-search-container">
        <button 
          className="header-search-btn"
          onClick={() => setShowSearchModal(true)}
        >
          <div className="search-items">
            <span className="search-item location-item">
              <FaMapMarkerAlt className="search-item-icon" />
              {searchParams.location || 'Select a Location'}
            </span>
            <span className="search-divider">|</span>
            <span className="search-item">
              <FaCalendar className="search-item-icon" />
              {searchParams.checkIn || 'Select date'}
            </span>
            <span className="search-divider">|</span>
            <span className="search-item">
              <FaCalendar className="search-item-icon" />
              {searchParams.checkOut || 'Select date'}
            </span>
            <span className="search-divider">|</span>
            <span className="search-item guests">
              <FaUsers className="search-item-icon" />
              {searchParams.guests} {searchParams.guests === 1 ? 'guest' : 'guests'}
            </span>
          </div>
          <div className="search-icon-wrapper">
            <FaSearch />
          </div>
        </button>
      </div>

      {showSearchModal && (
        <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h2>Search accommodations</h2>
              <button className="close-btn" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-section">
                <label>Location</label>
                <div className="location-input-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    placeholder="Select a Location"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    className="location-input"
                  />
                </div>
                
                <div className="popular-destinations">
                  <h4>Popular destinations</h4>
                  <div className="destination-grid">
                    {popularDestinations.map((dest, index) => (
                      <button
                        key={index}
                        type="button"
                        className="destination-btn"
                        onClick={() => setSearchParams({ ...searchParams, location: dest.name })}
                      >
                        <div className="destination-image">
                          <img src={dest.image} alt={dest.name} />
                        </div>
                        <span>{dest.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="search-row">
                <div className="search-section half">
                  <label>Check in date</label>
                  <div className="date-input-wrapper">
                    <FaCalendar className="input-icon" />
                    <input
                      type="date"
                      value={searchParams.checkIn}
                      onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="search-section half">
                  <label>Checkout date</label>
                  <div className="date-input-wrapper">
                    <FaCalendar className="input-icon" />
                    <input
                      type="date"
                      value={searchParams.checkOut}
                      onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                      min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div className="search-section">
                <label>Guests</label>
                <div className="guests-selector">
                  <FaUsers className="input-icon" />
                  <div className="guests-control">
                    <button 
                      type="button" 
                      onClick={decrementGuests}
                      className="guest-btn"
                      disabled={searchParams.guests === 0}
                    >
                      -
                    </button>
                    <span className="guest-count">{searchParams.guests} {searchParams.guests === 1 ? 'guest' : 'guests'}</span>
                    <button 
                      type="button" 
                      onClick={incrementGuests}
                      className="guest-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="modal-search-btn">
                <FaSearch />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;