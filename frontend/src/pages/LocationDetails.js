import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaStar, FaMapMarkerAlt, FaBed, FaBath, FaUserFriends, 
  FaWifi, FaCar, FaTv, FaSnowflake, FaFire, FaUtensils, 
  FaSwimmingPool, FaHome, FaShieldAlt, FaKey, FaCalendar, 
  FaCheck, FaCamera, FaBicycle, FaCalendarAlt, FaUser, 
  FaChevronRight, FaFilter, FaHeart, FaArrowLeft
} from 'react-icons/fa';
import { fetchListingById } from '../utils/listingService';
import './LocationDetails.css';

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2'
  });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await fetchListingById(id);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!listing || !reservation.checkIn || !reservation.checkOut) {
      return { nights: 7, total: (listing?.price * 7) + 80 };
    }
    
    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    const total = listing.price * nights;
    const cleaningFee = 50;
    const serviceFee = 30;
    
    return { nights, total: total + cleaningFee + serviceFee, cleaningFee, serviceFee };
  };

  const handleReservationChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleBookNow = async () => {
    if (!reservation.checkIn || !reservation.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setBooking(true);
    try {
      alert('Booking successful! (Demo mode)');
      navigate('/reservations');
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setBooking(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    switch (amenityLower) {
      case 'wifi': return <FaWifi />;
      case 'parking': return <FaCar />;
      case 'tv': return <FaTv />;
      case 'air conditioning':
      case 'ac': return <FaSnowflake />;
      case 'heating': return <FaFire />;
      case 'kitchen': return <FaUtensils />;
      case 'pool': return <FaSwimmingPool />;
      case 'garden view': return <FaHome />;
      case 'washer': return <FaUtensils />;
      case 'dryer': return <FaUtensils />;
      case 'security cameras': return <FaCamera />;
      case 'bicycles': return <FaBicycle />;
      default: return <FaCheck />;
    }
  };

  const formatPrice = (price) => {
    return `R ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="location-details-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="location-details-empty">
        <div className="empty-state">
          <h3>Listing not found</h3>
          <p>The property you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/locations')}>
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  const { nights, total, cleaningFee, serviceFee } = calculateTotal();

  return (
    <div className="airbnb-listing-details">
      <div className="back-button-container">
        <Link to="/locations" className="back-button">
          <FaArrowLeft /> Back to listings
        </Link>
      </div>

      <div className="listing-header-section">
        <h1>{listing.title}</h1>
        <div className="header-meta">
          <div className="rating-location">
            <div className="rating">
              <FaStar className="star-icon" />
              <span className="rating-value">{listing.rating}</span>
              <span className="reviews-count">· {listing.reviews} reviews</span>
              <span className="superhost-badge">Superhost</span>
            </div>
            <div className="location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{listing.city}, {listing.country}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="share-btn">
              <span>Share</span>
            </button>
            <button className="save-btn">
              <FaHeart />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="image-gallery-section">
        <div className="main-gallery-image">
          <img src={listing.image} alt={listing.title} />
        </div>
        <div className="gallery-thumbnails">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="thumbnail">
              <img src={`https://source.unsplash.com/random/400x300?interior&sig=${index}`} alt={`Interior ${index}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="main-content-layout">
        <div className="left-content-column">
          <div className="host-info-section">
            <div className="host-info-content">
              <h2>Entire rental unit hosted by {listing.host}</h2>
              <div className="host-details">
                <span>{listing.bedrooms} bedroom · {listing.bedrooms} bed · {listing.bathrooms} bath</span>
              </div>
            </div>
            <div className="host-avatar">
              <img src="https://source.unsplash.com/random/100x100?person" alt="Host" />
            </div>
          </div>

          <div className="features-highlights">
            <div className="feature-item">
              <FaHome className="feature-icon" />
              <div>
                <h4>Entire home</h4>
                <p>You'll have the apartment to yourself.</p>
              </div>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <div>
                <h4>Enhanced Clean</h4>
                <p>This Host committed to Airbnb's 5-step enhanced cleaning process.</p>
              </div>
            </div>
            <div className="feature-item">
              <FaKey className="feature-icon" />
              <div>
                <h4>Self check-in</h4>
                <p>Check yourself in with the keypad.</p>
              </div>
            </div>
          </div>

          <div className="description-section">
            <p>{listing.description}</p>
          </div>

          <div className="sleeping-section">
            <h3>Where you'll sleep</h3>
            <div className="bedroom-card">
              <FaBed className="bed-icon" />
              <h4>Bedroom</h4>
              <p>1 queen bed</p>
            </div>
          </div>

          <div className="amenities-section">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              <div className="amenity-item">
                <span className="amenity-icon"><FaWifi /></span>
                <span className="amenity-text">Wifi</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon"><FaCar /></span>
                <span className="amenity-text">Free parking</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon"><FaTv /></span>
                <span className="amenity-text">TV</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon"><FaSnowflake /></span>
                <span className="amenity-text">Air conditioning</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon"><FaFire /></span>
                <span className="amenity-text">Heating</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-icon"><FaUtensils /></span>
                <span className="amenity-text">Kitchen</span>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <div className="reviews-header">
              <FaStar className="star-icon" />
              <h3>{listing.rating} · {listing.reviews} reviews</h3>
            </div>
          </div>
        </div>

        <div className="right-booking-column">
          <div className="booking-widget-sticky">
            <div className="price-box">
              <div className="price-header">
                <span className="price">{formatPrice(listing.price)}</span>
                <span className="per-night"> / night</span>
              </div>
              
              <div className="date-selector">
                <div className="date-input-group">
                  <label>CHECK-IN</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    value={reservation.checkIn} 
                    onChange={handleReservationChange} 
                    min={new Date().toISOString().split('T')[0]}
                    className="date-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>CHECKOUT</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    value={reservation.checkOut} 
                    onChange={handleReservationChange} 
                    min={reservation.checkIn || new Date().toISOString().split('T')[0]}
                    className="date-input"
                  />
                </div>
              </div>
              
              <div className="guests-selector">
                <label>GUESTS</label>
                <select 
                  name="guests" 
                  value={reservation.guests} 
                  onChange={handleReservationChange}
                  className="guests-select"
                >
                  {[1,2,3,4,5,6,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="reserve-button" 
                onClick={handleBookNow} 
                disabled={booking}
              >
                {booking ? 'Reserving...' : 'Reserve'}
              </button>
              
              <p className="no-charge-text">You won't be charged yet</p>
              
              <div className="price-breakdown">
                <div className="price-line">
                  <span>{formatPrice(listing.price)} × {nights} nights</span>
                  <span>{formatPrice(listing.price * nights)}</span>
                </div>
                <div className="price-line">
                  <span>Cleaning fee</span>
                  <span>{formatPrice(cleaningFee)}</span>
                </div>
                <div className="price-line">
                  <span>Service fee</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="price-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;