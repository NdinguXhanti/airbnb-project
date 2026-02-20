import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import './UpdateListing.css';

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
    price: '',
    bedrooms: '1',
    bathrooms: '1',
    maxGuests: '1',
    propertyType: 'Apartment',
    amenities: [],
    weeklyDiscount: '0',
    cleaningFee: '0',
    serviceFee: '0',
    occupancyTaxes: '0',
    images: []
  });

  const amenitiesList = ['wifi', 'kitchen', 'parking', 'pool', 'hot tub', 'washer', 'dryer', 'ac', 'heating', 'tv', 'workspace'];
  const propertyTypes = ['Apartment', 'House', 'Condo', 'Villa', 'Cabin', 'Studio', 'Loft', 'Other'];

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await API.get(`/accommodations/${id}`);
      const listing = response.data;
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        location: listing.location || '',
        address: listing.address || { street: '', city: '', state: '', country: '', zipCode: '' },
        price: listing.price || '',
        bedrooms: listing.bedrooms?.toString() || '1',
        bathrooms: listing.bathrooms?.toString() || '1',
        maxGuests: listing.maxGuests?.toString() || '1',
        propertyType: listing.propertyType || 'Apartment',
        amenities: listing.amenities || [],
        weeklyDiscount: listing.weeklyDiscount?.toString() || '0',
        cleaningFee: listing.cleaningFee?.toString() || '0',
        serviceFee: listing.serviceFee?.toString() || '0',
        occupancyTaxes: listing.occupancyTaxes?.toString() || '0',
        images: listing.images || []
      });
    } catch (error) {
      setError('Failed to fetch listing details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const listingData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        maxGuests: Number(formData.maxGuests),
        weeklyDiscount: Number(formData.weeklyDiscount),
        cleaningFee: Number(formData.cleaningFee),
        serviceFee: Number(formData.serviceFee),
        occupancyTaxes: Number(formData.occupancyTaxes)
      };

      await API.put(`/accommodations/${id}`, listingData);
      
      setSuccess('Listing updated successfully!');
      setTimeout(() => {
        navigate('/admin/listings');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="update-listing">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-listing">
      <div className="container">
        <div className="page-header">
          <h1>Update Listing</h1>
          <p>Edit property details</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Modern Apartment in City Center" required />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="New York, USA" required />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your property..." rows="4" required></textarea>
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>
            <div className="grid grid-4">
              <div className="form-group">
                <label>Bedrooms *</label>
                <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} required>
                  {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} {num === 1 ? 'bedroom' : 'bedrooms'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Bathrooms *</label>
                <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} required>
                  {[1,2,3,4,5].map(num => <option key={num} value={num}>{num} {num === 1 ? 'bathroom' : 'bathrooms'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Max Guests *</label>
                <select name="maxGuests" value={formData.maxGuests} onChange={handleChange} required>
                  {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Property Type *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                  {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Pricing</h2>
            <div className="grid grid-4">
              <div className="form-group">
                <label>Price per night ($) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="100" min="0" required />
              </div>
              <div className="form-group">
                <label>Weekly Discount (%)</label>
                <input type="number" name="weeklyDiscount" value={formData.weeklyDiscount} onChange={handleChange} placeholder="10" min="0" max="100" />
              </div>
              <div className="form-group">
                <label>Cleaning Fee ($)</label>
                <input type="number" name="cleaningFee" value={formData.cleaningFee} onChange={handleChange} placeholder="50" min="0" />
              </div>
              <div className="form-group">
                <label>Service Fee ($)</label>
                <input type="number" name="serviceFee" value={formData.serviceFee} onChange={handleChange} placeholder="30" min="0" />
              </div>
            </div>
            <div className="form-group">
              <label>Occupancy Taxes ($)</label>
              <input type="number" name="occupancyTaxes" value={formData.occupancyTaxes} onChange={handleChange} placeholder="20" min="0" />
            </div>
          </div>

          <div className="form-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} />
                  <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Images</h2>
            <div className="form-group">
              <label>Upload Property Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              {formData.images.length > 0 && (
                <div className="image-preview">
                  {formData.images.map((img, index) => (
                    <div key={index} className="preview-image">
                      <img src={img} alt={`Preview ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Address Details</h2>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Street</label>
                <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="123 Main St" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="New York" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="NY" />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} placeholder="10001" />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="USA" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/listings')} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateListing;