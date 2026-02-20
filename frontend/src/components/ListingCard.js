// src/components/ListingCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/location/${listing.id}`} className="listing-card">
      <div className="listing-image">
        <img src={listing.image} alt={listing.title} />
      </div>
      <div className="listing-details">
        <div className="listing-header">
          <h3>{listing.title}</h3>
          <div className="listing-rating">
            <FaStar className="star-icon" />
            <span>{listing.rating}</span>
            <span className="reviews-count">({listing.reviews})</span>
          </div>
        </div>
        <p className="listing-location">
          <FaMapMarkerAlt className="location-icon" />
          {listing.city}, {listing.country}
        </p>
        <p className="listing-type">{listing.type} · {listing.bedrooms} bedrooms</p>
        <p className="listing-price">
          <span className="price">${listing.price}</span> <span className="night">night</span>
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;