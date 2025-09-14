import Cinema from '../models/Cinema.js';
import Screen from '../models/Screen.js';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all cinemas
export const getCinemas = asyncHandler(async (req, res) => {
  const cinemas = await Cinema.find({ isActive: true }).sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    count: cinemas.length,
    data: cinemas
  });
});

// Get single cinema by ID
export const getCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);
  
  if (!cinema) {
    return res.status(404).json({
      success: false,
      message: 'Cinema not found'
    });
  }

  res.status(200).json({
    success: true,
    data: cinema
  });
});

// Get cinema screens
export const getCinemaScreens = asyncHandler(async (req, res) => {
  const screens = await Screen.find({ 
    cinema: req.params.id, 
    isActive: true 
  }).populate('cinema');

  if (!screens) {
    return res.status(404).json({
      success: false,
      message: 'No screens found for this cinema'
    });
  }

  res.status(200).json({
    success: true,
    count: screens.length,
    data: screens
  });
});

// Get movies and shows for a cinema
export const getCinemaMovies = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const cinemaId = req.params.id;

  // If no date provided, use today
  const showDate = date ? new Date(date) : new Date();
  showDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(showDate);
  nextDay.setDate(showDate.getDate() + 1);

  const shows = await Show.find({
    cinema: cinemaId,
    date: {
      $gte: showDate,
      $lt: nextDay
    },
    isActive: true
  })
  .populate('movie')
  .populate('screen')
  .sort({ startTime: 1 });

  // Group shows by movie
  const movieShowsMap = new Map();
  
  shows.forEach(show => {
    const movieId = show.movie._id.toString();
    if (!movieShowsMap.has(movieId)) {
      movieShowsMap.set(movieId, {
        movie: show.movie,
        shows: []
      });
    }
    movieShowsMap.get(movieId).shows.push({
      _id: show._id,
      screen: show.screen,
      startTime: show.startTime,
      endTime: show.endTime,
      price: show.price,
      availableSeats: show.availableSeats
    });
  });

  const moviesWithShows = Array.from(movieShowsMap.values());

  res.status(200).json({
    success: true,
    count: moviesWithShows.length,
    data: moviesWithShows
  });
});