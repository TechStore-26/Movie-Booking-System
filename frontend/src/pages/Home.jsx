import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cinemaAPI } from '../services/api';
import { MapPin, Star } from 'lucide-react';

const Home = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      const response = await cinemaAPI.getCinemas();
      if (response.success) {
        setCinemas(response.data);
      }
    } catch (error) {
      setError('Failed to fetch cinemas');
      console.error('Error fetching cinemas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Book Your Movie Tickets
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover the latest movies and book your seats at the best cinemas
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Cinemas Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Cinema</h2>
        
        {cinemas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No cinemas available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cinemas.map((cinema) => (
              <Link
                key={cinema._id}
                to={`/cinema/${cinema._id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {cinema.name}
                  </h3>
                  
                  <div className="flex items-start space-x-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{cinema.location.address}</p>
                      <p>{cinema.location.city}, {cinema.location.state}</p>
                      <p>{cinema.location.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {cinema.totalScreens} Screens
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.2</span>
                    </div>
                  </div>

                  {cinema.amenities && cinema.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cinema.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {amenity.replace('-', ' ')}
                        </span>
                      ))}
                      {cinema.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{cinema.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;