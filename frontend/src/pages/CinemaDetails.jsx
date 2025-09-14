import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cinemaAPI } from '../services/api';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';

const CinemaDetails = () => {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [moviesWithShows, setMoviesWithShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCinemaDetails();
    fetchCinemaMovies();
  }, [id, selectedDate]);

  const fetchCinemaDetails = async () => {
    try {
      const response = await cinemaAPI.getCinema(id);
      if (response.success) {
        setCinema(response.data);
      }
    } catch (error) {
      console.error('Error fetching cinema details:', error);
      setError('Failed to load cinema details');
    }
  };

  const fetchCinemaMovies = async () => {
    try {
      setLoading(true);
      const response = await cinemaAPI.getCinemaMovies(id, selectedDate);
      if (response.success) {
        setMoviesWithShows(response.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies and showtimes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading && !cinema) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {cinema && (
        <>
          {/* Cinema Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{cinema.name}</h1>
            
            <div className="flex items-start space-x-2 text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p>{cinema.location.address}</p>
                <p>{cinema.location.city}, {cinema.location.state} - {cinema.location.pincode}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">{cinema.totalScreens} Screens</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-gray-600">4.2</span>
              </div>
            </div>

            {cinema.amenities && cinema.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cinema.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {amenity.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Select Date
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {generateDateOptions().map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDate === date
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          {/* Movies and Shows */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Movies & Showtimes</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : moviesWithShows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No movies available for the selected date.</p>
              </div>
            ) : (
              moviesWithShows.map((movieData) => (
                <div key={movieData.movie._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    {/* Movie Poster */}
                    <div className="md:w-48 flex-shrink-0">
                      <img
                        src={movieData.movie.posterUrl}
                        alt={movieData.movie.title}
                        className="w-full h-72 md:h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzAgMTgwSDI3MFYxOTBIMTMwVjE4MFoiIGZpbGw9IiM2QjcyODAiLz4KPHA+ PC90ZXh0PgoJPHRleHQgeD0iMTUwIiB5PSIyMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gUG9zdGVyPC90ZXh0Pgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    
                    {/* Movie Details and Showtimes */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {movieData.movie.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {movieData.movie.duration} min
                            </span>
                            <span className="px-2 py-1 bg-gray-200 rounded">
                              {movieData.movie.rating}
                            </span>
                            <span>{movieData.movie.language}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movieData.movie.genre.map((g) => (
                              <span key={g} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {movieData.movie.imdbRating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{movieData.movie.imdbRating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{movieData.movie.description}</p>
                      
                      {/* Showtimes */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Showtimes</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {movieData.shows.map((show) => (
                            <Link
                              key={show._id}
                              to={`/show/${show._id}/seats`}
                              className="block text-center"
                            >
                              <div className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                                <div className="font-medium">{show.startTime}</div>
                                <div className="text-xs mt-1">
                                  ₹{show.price.regular}+
                                </div>
                                <div className="text-xs text-gray-600">
                                  {show.availableSeats} seats
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CinemaDetails;
