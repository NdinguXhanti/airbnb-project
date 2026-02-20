import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaMapMarkerAlt, FaCalendar, FaUsers,
  FaGlobe, FaBars, FaUserCircle, FaGift,
  FaQuestionCircle, FaChevronRight, FaChevronDown
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 0
  });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.checkIn) queryParams.append('checkIn', searchParams.checkIn);
    if (searchParams.checkOut) queryParams.append('checkOut', searchParams.checkOut);
    if (searchParams.guests) queryParams.append('guests', searchParams.guests);
    navigate(`/locations?${queryParams.toString()}`);
  };

  const incrementGuests = () => {
    setSearchParams({ ...searchParams, guests: searchParams.guests + 1 });
  };

  const decrementGuests = () => {
    if (searchParams.guests > 0) {
      setSearchParams({ ...searchParams, guests: searchParams.guests - 1 });
    }
  };

  const handleFlexibleClick = () => {
    navigate('/locations?flexible=true');
  };

  const selectLocation = (location) => {
    setSearchParams({ ...searchParams, location });
    setShowLocationDropdown(false);
  };

  const locationOptions = [
    'New York',
    'Paris',
    'Tokyo',
    'Cape Town',
    'Thailand'
  ];

  const destinations = [
    { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
    { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
    { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
    { city: 'Cape Town', country: 'South Africa', image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400' },
    { city: 'Phuket', country: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400' }
  ];

  const landmarks = [
    { name: 'Eiffel Tower', location: 'Paris, France', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
    { name: 'Colosseum', location: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
    { name: 'Great Wall', location: 'Beijing, China', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400' },
    { name: 'Statue of Liberty', location: 'New York, USA', image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400' },
    { name: 'Sydney Opera House', location: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400' },
    { name: 'Christ the Redeemer', location: 'Rio de Janeiro, Brazil', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400' },
    { name: 'Shibuya Crossing', location: 'Tokyo, Japan', image: 'https://media.cntraveler.com/photos/598202951209f576909acb19/master/w_1200,c_limit/Shibuya-Crossing-GettyImages-533959897.jpg' },
    { name: 'Table Mountain', location: 'Cape Town, South Africa', image: 'https://cdn.wallpapersafari.com/45/8/AwDLx2.jpg' },
    { name: 'Santorini', location: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
    { name: 'Big Ben', location: 'London, UK', image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400' },
    { name: 'Sagrada Familia', location: 'Barcelona, Spain', image: 'https://cdn.britannica.com/15/194815-050-08B5E7D1/Nativity-facade-Sagrada-Familia-cathedral-Barcelona-Spain.jpg' },
    { name: 'Grand Canyon', location: 'Arizona, USA', image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400' }
  ];

  const categories = [
    'Destinations for arts and culture',
    'Destinations for outdoor adventure',
    'Mountain cabins',
    'Beach destinations',
    'Popular destinations',
    'Unique stays'
  ];

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-background">
          <img 
            src="https://www.homelane.com/design-ideas/wp-content/uploads/2022/11/box-type-house-front-design.jpg" 
            alt="Modern house" 
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-nav-container">
          <div className="nav-container">
            <Link to="/" className="hero-logo">
              <img src="/airbnb-logo.png" alt="Airbnb" width="30" height="30" style={{ filter: 'brightness(0) invert(1)' }} />
              <span>airbnb</span>
            </Link>

            <div className="hero-nav-links">
              <Link to="/locations" className="hero-nav-link active">Places to stay</Link>
              <Link to="/experiences" className="hero-nav-link">Experiences</Link>
              <Link to="/online-experiences" className="hero-nav-link">Online Experiences</Link>
            </div>

            <div className="hero-nav-right">
              <Link to="/admin/create-listing" className="hero-become-host">Become a host</Link>
              <button className="hero-language-btn"><FaGlobe /></button>
              <div className="hero-user-menu">
                <FaBars /><FaUserCircle />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-search-wrapper">
          <div className="hero-search-box">
            <form onSubmit={handleSearch} className="search-fields">
              <div className="search-field location-field">
                <label>Locations</label>
                <div className="search-input-wrapper" onClick={() => setShowLocationDropdown(!showLocationDropdown)}>
                  <FaMapMarkerAlt className="search-icon" />
                  <input
                    type="text"
                    placeholder="Select a Location"
                    value={searchParams.location}
                    readOnly
                    className="location-input"
                  />
                  <FaChevronDown className="dropdown-icon" />
                </div>
                {showLocationDropdown && (
                  <div className="location-dropdown">
                    <div className="dropdown-header">
                      <span>All Locations</span>
                    </div>
                    {locationOptions.map((location, index) => (
                      <div 
                        key={index} 
                        className="dropdown-item"
                        onClick={() => selectLocation(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="search-field">
                <label>Check in date</label>
                <div className="search-input-wrapper">
                  <FaCalendar className="search-icon" />
                  <input
                    type="text"
                    placeholder="Select date"
                    value={searchParams.checkIn}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                  />
                </div>
              </div>
              <div className="search-field">
                <label>Checkout date</label>
                <div className="search-input-wrapper">
                  <FaCalendar className="search-icon" />
                  <input
                    type="text"
                    placeholder="Select date"
                    value={searchParams.checkOut}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                  />
                </div>
              </div>
              <div className="search-field">
                <label>Guests</label>
                <div className="search-input-wrapper">
                  <FaUsers className="search-icon" />
                  <div className="guests-input">
                    <span>{searchParams.guests} guests</span>
                    <div className="guests-controls">
                      <button type="button" onClick={decrementGuests} disabled={searchParams.guests === 0}>−</button>
                      <button type="button" onClick={incrementGuests}>+</button>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="hero-search-btn">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>

        <div className="flexible-section">
          <h1 className="flexible-title">Not sure where to go? Perfect.</h1>
          <button className="flexible-btn" onClick={handleFlexibleClick}>
            I'm flexible
          </button>
        </div>
      </div>

      <div className="inspiration-section">
        <div className="container">
          <h2 className="section-title">Inspiration for your next trip</h2>
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <Link to={`/locations?city=${destination.city}`} key={index} className="destination-card">
                <div className="destination-image">
                  <img src={destination.image} alt={`${destination.city}, ${destination.country}`} />
                </div>
                <div className="destination-info">
                  <h3>{destination.city}</h3>
                  <p>{destination.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="experiences-section">
        <div className="container">
          <h2 className="section-title">Discover Airbnb Experiences</h2>
          <div className="experiences-grid">
            <Link to="/experiences/trips" className="experience-card">
              <div className="experience-image">
                <img 
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400" 
                  alt="Things to do on your trip" 
                />
                <div className="experience-overlay">
                  <h3>Things to do on your trip</h3>
                  <p>Experiences</p>
                </div>
              </div>
            </Link>
            <Link to="/experiences/online" className="experience-card">
              <div className="experience-image">
                <img 
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400" 
                  alt="Things to do from home" 
                />
                <div className="experience-overlay">
                  <h3>Things to do from home</h3>
                  <p>Online Experiences</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="gift-cards-section">
        <div className="container">
          <div className="gift-card-content">
            <FaGift className="gift-icon" />
            <div className="gift-text">
              <h3>Shop Airbnb gift cards</h3>
              <Link to="/gift-cards" className="learn-more">Learn more <FaChevronRight /></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hosting-question-section">
        <div className="container">
          <div className="hosting-question-content">
            <FaQuestionCircle className="question-icon" />
            <div className="question-text">
              <h3>Questions about hosting?</h3>
              <Link to="/help/hosting" className="ask-superhost">Ask a super host <FaChevronRight /></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="future-getaways-section">
        <div className="container">
          <h2 className="section-title">Inspiration for future getaways</h2>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`} key={index} className="category-link">
                {category}
              </Link>
            ))}
          </div>

          <div className="landmarks-grid">
            {landmarks.map((landmark, index) => (
              <Link to={`/locations?landmark=${landmark.name}`} key={index} className="landmark-card">
                <div className="landmark-image">
                  <img src={landmark.image} alt={landmark.name} />
                </div>
                <div className="landmark-info">
                  <h4>{landmark.name}</h4>
                  <p>{landmark.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;