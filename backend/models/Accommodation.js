const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [1, 'Minimum 1 bedroom']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [1, 'Minimum 1 bathroom']
  },
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Minimum 1 guest']
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Villa', 'Cabin', 'Studio', 'Loft', 'Other'],
    default: 'Apartment'
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'kitchen', 'parking', 'pool', 'hot tub', 'washer', 'dryer', 'ac', 'heating', 'tv', 'workspace']
  }],
  images: [{
    type: String,
    default: []
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  weeklyDiscount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  cleaningFee: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  occupancyTaxes: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
accommodationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;