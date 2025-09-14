import express from 'express';
import { body } from 'express-validator';
import { createBooking, getUserBookings, getBooking, cancelBooking } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const bookingValidation = [
  body('showId').notEmpty().withMessage('Show ID is required'),
  body('seats').isArray({ min: 1, max: 6 }).withMessage('Seats array must contain 1-6 seats'),
  body('seats.*.row').notEmpty().withMessage('Seat row is required'),
  body('seats.*.seatNumber').isNumeric().withMessage('Seat number must be numeric')
];

// All routes require authentication
router.use(authenticateToken);

// Routes
router.post('/', bookingValidation, createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;