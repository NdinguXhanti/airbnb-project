const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');
const { auth, host, admin } = require('../middleware/auth');

// @route   GET /api/accommodations
// @desc    Get all accommodations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, bedrooms, guests, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }
    
    if (guests) {
      filter.maxGuests = { $gte: Number(guests) };
    }
    
    const skip = (page - 1) * limit;
    
    const accommodations = await Accommodation.find(filter)
      .populate('host', 'name email profileImage')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Accommodation.countDocuments(filter);
    
    res.json({
      success: true,
      count: accommodations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: accommodations
    });
  } catch (error) {
    console.error('Get accommodations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accommodations',
      error: error.message
    });
  }
});

// @route   GET /api/accommodations/:id
// @desc    Get single accommodation
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id)
      .populate('host', 'name email profileImage createdAt');
    
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }
    
    res.json({
      success: true,
      data: accommodation
    });
  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get accommodation',
      error: error.message
    });
  }
});

// @route   POST /api/accommodations
// @desc    Create new accommodation
// @access  Private (Host/Admin)
router.post('/', auth, host, async (req, res) => {
  try {
    const accommodationData = {
      ...req.body,
      host: req.user._id
    };
    
    const accommodation = new Accommodation(accommodationData);
    await accommodation.save();
    
    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully',
      data: accommodation
    });
  } catch (error) {
    console.error('Create accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create accommodation',
      error: error.message
    });
  }
});

// @route   PUT /api/accommodations/:id
// @desc    Update accommodation
// @access  Private (Host/Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    let accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }
    
    // Check if user is owner or admin
    if (accommodation.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this accommodation'
      });
    }
    
    accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Accommodation updated successfully',
      data: accommodation
    });
  } catch (error) {
    console.error('Update accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update accommodation',
      error: error.message
    });
  }
});

// @route   DELETE /api/accommodations/:id
// @desc    Delete accommodation
// @access  Private (Host/Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }
    
    // Check if user is owner or admin
    if (accommodation.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this accommodation'
      });
    }
    
    await accommodation.deleteOne();
    
    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accommodation',
      error: error.message
    });
  }
});

module.exports = router;