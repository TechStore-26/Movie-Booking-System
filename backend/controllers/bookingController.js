import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// Create a new booking
export const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  const { showId, seats } = req.body;
  const userId = req.user._id;

  // Validate maximum 6 seats
  if (seats.length > 6) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 6 seats can be selected'
    });
  }

  // Get show details
  const show = await Show.findById(showId)
    .populate('movie')
    .populate('cinema')
    .populate('screen');

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found'
    });
  }

  // Check if seats are available
  const bookedSeatKeys = show.bookedSeats.map(seat => `${seat.row}-${seat.seatNumber}`);
  const requestedSeatKeys = seats.map(seat => `${seat.row}-${seat.seatNumber}`);
  
  const alreadyBooked = requestedSeatKeys.some(seatKey => bookedSeatKeys.includes(seatKey));
  
  if (alreadyBooked) {
    return res.status(400).json({
      success: false,
      message: 'Some of the selected seats are already booked'
    });
  }

  // Calculate total amount
  let totalAmount = 0;
  const seatDetails = seats.map(seat => {
    let price = show.price.regular;
    
    // Determine seat type and price based on row
    const rowNumber = seat.row.charCodeAt(0) - 64; // A=1, B=2, etc.
    let seatType = 'regular';
    
    if (rowNumber <= 3) {
      seatType = 'premium';
      price = show.price.premium || show.price.regular * 1.5;
    } else if (rowNumber > show.screen.seatLayout.rows - 2) {
      seatType = 'recliner';
      price = show.price.recliner || show.price.regular * 2;
    }

    totalAmount += price;

    return {
      row: seat.row,
      seatNumber: seat.seatNumber,
      type: seatType,
      price: price
    };
  });

  // Generate booking reference
  const bookingReference = `MB${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create booking
  const booking = await Booking.create({
    user: userId,
    show: showId,
    movie: show.movie._id,
    cinema: show.cinema._id,
    screen: show.screen._id,
    seats: seatDetails,
    totalAmount,
    showDate: show.date,
    showTime: show.startTime,
    bookingReference
  });

  // Update show's booked seats and available seats
  show.bookedSeats.push(...seats.map(seat => ({
    row: seat.row,
    seatNumber: seat.seatNumber
  })));
  show.availableSeats -= seats.length;
  
  await show.save();

  // Populate booking details for response
  const populatedBooking = await Booking.findById(booking._id)
    .populate('movie')
    .populate('cinema')
    .populate('screen')
    .populate('user', 'name email phone');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: populatedBooking
  });
});

// Get user bookings
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('movie')
    .populate('cinema')
    .populate('screen')
    .sort({ bookingDate: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Get single booking
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('movie')
    .populate('cinema')
    .populate('screen')
    .populate('user', 'name email phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if booking belongs to the user
  if (booking.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking'
    });
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Check if booking belongs to the user
  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    });
  }

  // Check if show date is in the future
  const now = new Date();
  if (booking.showDate <= now) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel bookings for past shows'
    });
  }

  // Update booking status
  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  // Free up the seats in the show
  const show = await Show.findById(booking.show);
  if (show) {
    // Remove booked seats
    const bookedSeatKeys = booking.seats.map(seat => `${seat.row}-${seat.seatNumber}`);
    show.bookedSeats = show.bookedSeats.filter(seat => 
      !bookedSeatKeys.includes(`${seat.row}-${seat.seatNumber}`)
    );
    show.availableSeats += booking.seats.length;
    await show.save();
  }

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});