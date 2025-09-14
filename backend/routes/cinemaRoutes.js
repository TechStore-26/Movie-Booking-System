import express from 'express';
import { getCinemas, getCinema, getCinemaScreens, getCinemaMovies } from '../controllers/cinemaController.js';

const router = express.Router();

// Routes
router.get('/', getCinemas);
router.get('/:id', getCinema);
router.get('/:id/screens', getCinemaScreens);
router.get('/:id/movies', getCinemaMovies);

export default router;