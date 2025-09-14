import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get show details with seat layout
export const getShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id)
    .populate('movie')
    .populate('screen')
    .populate('cinema');

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found'
    });
  }

  // Get seat layout with booking status
  const seatLayout = generateSeatLayout(show.screen.seatLayout.rows, show.screen.seatLayout.seatsPerRow, show.bookedSeats);

  res.status(200).json({
    success: true,
    data: {
      show,
      seatLayout
    }
  });
});

// Get available seats for a show
export const getShowSeats = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate('screen');

  if (!show) {
    return res.status(404).json({
      success: false,
      message: 'Show not found'
    });
  }

  const seatLayout = generateSeatLayout(
    show.screen.seatLayout.rows, 
    show.screen.seatLayout.seatsPerRow, 
    show.bookedSeats
  );

  res.status(200).json({
    success: true,
    data: {
      showId: show._id,
      totalSeats: show.screen.capacity,
      availableSeats: show.availableSeats,
      seatLayout,
      prices: show.price
    }
  });
});

// Helper function to generate seat layout
const generateSeatLayout = (rows, seatsPerRow, bookedSeats) => {
  const layout = [];
  const bookedSeatSet = new Set(
    bookedSeats.map(seat => `${seat.row}-${seat.seatNumber}`)
  );

  for (let i = 1; i <= rows; i++) {
    const rowLetter = String.fromCharCode(64 + i); // A, B, C, etc.
    const row = {
      row: rowLetter,
      seats: []
    };

    for (let j = 1; j <= seatsPerRow; j++) {
      const seatKey = `${rowLetter}-${j}`;
      const isBooked = bookedSeatSet.has(seatKey);
      
      // Determine seat type based on row position
      let seatType = 'regular';
      if (i <= 3) {
        seatType = 'premium';
      } else if (i > rows - 2) {
        seatType = 'recliner';
      }

      row.seats.push({
        seatNumber: j,
        isBooked,
        seatType,
        seatId: seatKey
      });
    }

    layout.push(row);
  }

  return layout;
};