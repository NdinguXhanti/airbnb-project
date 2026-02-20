const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const { auth } = require('../middleware/auth');

// @route   GET /api/reservations
// @desc    Get all reservations (User's own or all for admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    
    // If not admin, only show user's own reservations
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }
    
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate('accommodation', 'title location price images')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reservations',
      error: error.message
    });
  }
});

// @route   GET /api/reservations/:id
// @desc    Get single reservation
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('accommodation');
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if user owns reservation or is admin
    if (reservation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reservation',
      error: error.message
    });
  }
});

// @route   POST /api/reservations
// @desc    Create new reservation
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests, specialRequests } = req.body;
    
    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }
    
    // Get accommodation
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }
    
    // Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    let totalPrice = accommodation.price * nights;
    
    // Apply weekly discount
    if (nights >= 7 && accommodation.weeklyDiscount > 0) {
      const discount = totalPrice * (accommodation.weeklyDiscount / 100);
      totalPrice -= discount;
    }
    
    // Add fees
    totalPrice += accommodation.cleaningFee || 0;
    totalPrice += accommodation.serviceFee || 0;
    totalPrice += accommodation.occupancyTaxes || 0;
    
    // Create reservation
    const reservation = new Reservation({
      user: req.user._id,
      accommodation: accommodationId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests: specialRequests || ''
    });
    
    await reservation.save();
    
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        ...reservation.toObject(),
        accommodation: {
          title: accommodation.title,
          location: accommodation.location,
          price: accommodation.price,
          images: accommodation.images
        }
      }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation',
      error: error.message
    });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if user owns reservation or is admin
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reservation'
      });
    }
    
    // Only allow updating status and specialRequests
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.specialRequests) updates.specialRequests = req.body.specialRequests;
    
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updatedReservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
      error: error.message
    });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel reservation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if user owns reservation or is admin
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }
    
    // Instead of deleting, mark as cancelled
    reservation.status = 'cancelled';
    await reservation.save();
    
    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reservation',
      error: error.message
    });
  }
});

module.exports = router;