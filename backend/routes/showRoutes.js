import express from 'express';
import { getShow, getShowSeats } from '../controllers/showController.js';

const router = express.Router();

// Routes
router.get('/:id', getShow);
router.get('/:id/seats', getShowSeats);

export default router;