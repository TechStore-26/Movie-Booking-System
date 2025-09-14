import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Film, Clock, MapPin, User, IndianRupee, ArrowLeft } from 'lucide-react';

const SeatSelection = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showDetails, setShowDetails] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [prices, setPrices] = useState({});

  const MAX_SEATS = 6;

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await showAPI.getShowSeats(showId);
      
      if (response.success) {
        const { seatLayout: layout, prices: showPrices } = response.data;
        setSeatLayout(layout);
        setPrices(showPrices);
        
        // Fetch complete show details
        const showResponse = await showAPI.getShow(showId);
        if (showResponse.success) {
          setShowDetails(showResponse.data.show);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load show details');
    } finally {
      setLoading(false);
    }
  };

  const getSeatPrice = (seatType) => {
    switch (seatType) {
      case 'premium':
        return prices.premium || prices.regular * 1.5;
      case 'recliner':
        return prices.recliner || prices.regular * 2;
      default:
        return prices.regular || 150;
    }
  };

  const handleSeatClick = (rowLetter, seatNumber, seatType, isBooked) => {
    if (isBooked) return;

    const seatId = `${rowLetter}-${seatNumber}`;
    const existingSeatIndex = selectedSeats.findIndex(seat => seat.seatId === seatId);

    if (existingSeatIndex > -1) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(seat => seat.seatId !== seatId));
    } else {
      // Select seat if under limit
      if (selectedSeats.length < MAX_SEATS) {
        setSelectedSeats(prev => [...prev, {
          seatId,
          row: rowLetter,
          seatNumber,
          type: seatType,
          price: getSeatPrice(seatType)
        }]);
      } else {
        alert(`Maximum ${MAX_SEATS} seats can be selected`);
      }
    }
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const getSeatClassName = (seat, isSelected) => {
    const baseClasses = "w-7 h-7 m-0.5 rounded-t-xl cursor-pointer border-2 transition-all duration-300 flex items-center justify-center text-xs font-bold shadow-sm hover:shadow-md";
    
    if (seat.isBooked) {
      return `${baseClasses} bg-red-500 border-red-600 text-white cursor-not-allowed opacity-75`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-green-500 border-green-600 text-white shadow-lg transform scale-110 ring-2 ring-green-300`;
    }
    
    switch (seat.seatType) {
      case 'premium':
        return `${baseClasses} bg-gradient-to-t from-yellow-300 to-yellow-200 border-yellow-500 text-yellow-900 hover:from-yellow-400 hover:to-yellow-300`;
      case 'recliner':
        return `${baseClasses} bg-gradient-to-t from-purple-300 to-purple-200 border-purple-500 text-purple-900 hover:from-purple-400 hover:to-purple-300`;
      default:
        return `${baseClasses} bg-gradient-to-t from-blue-200 to-blue-100 border-blue-400 text-blue-900 hover:from-blue-300 hover:to-blue-200`;
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      
      const bookingData = {
        showId,
        seats: selectedSeats.map(seat => ({
          row: seat.row,
          seatNumber: seat.seatNumber
        }))
      };

      console.log('Sending booking data:', bookingData);
      
      const response = await bookingAPI.createBooking(bookingData);
      
      console.log('Booking response:', response);
      
      if (response.success) {
        // Navigate to confirmation page with booking details
        navigate('/booking/confirmation', {
          state: { 
            bookingData: response.data,
            showDetails: showDetails,
            selectedSeats: selectedSeats,
            totalAmount: getTotalAmount()
          }
        });
      } else {
        setError(response.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || err.error || 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Remove full-page error handling for booking errors
  // Booking errors are now handled inline

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        {showDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <img
                src={showDetails.movie.poster || '/api/placeholder/120/180'}
                alt={showDetails.movie.title}
                className="w-20 h-30 object-cover rounded"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {showDetails.movie.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{showDetails.cinema.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Film className="h-4 w-4" />
                    <span>{showDetails.screen.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(showDetails.date).toLocaleDateString()} at {showDetails.startTime}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {showDetails.movie.genre}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
                    {showDetails.movie.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Booking Failed</h3>
              <div className="mt-1 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => setError('')}
                  className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Layout */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Select Seats</h2>
            
            {/* Screen */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 h-6 rounded-t-2xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-gray-700 tracking-wider">🎬 SCREEN 🎬</span>
              </div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-200 h-2 rounded-b-md shadow-inner"></div>
            </div>

            {/* Row Numbers Header */}
            <div className="flex items-center justify-center mb-2">
              <span className="w-8 text-center font-bold text-gray-500 text-xs mr-3">ROW</span>
              <div className="flex">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className="w-7 text-center font-medium text-gray-500 text-xs mx-0.5">
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Seat Layout */}
            <div className="space-y-1 bg-gray-50 p-4 rounded-lg">
              {seatLayout.map((row, rowIndex) => (
                <div key={row.row} className="flex items-center justify-center">
                  <span className="w-8 text-center font-bold text-gray-700 text-sm mr-3 bg-white px-1 py-1 rounded shadow-sm">
                    {row.row}
                  </span>
                  <div className="flex gap-0.5">
                    {/* Left section (seats 1-4) */}
                    <div className="flex">
                      {row.seats.slice(0, 4).map((seat) => {
                        const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                        return (
                          <button
                            key={seat.seatId}
                            onClick={() => handleSeatClick(row.row, seat.seatNumber, seat.seatType, seat.isBooked)}
                            disabled={seat.isBooked}
                            className={getSeatClassName(seat, isSelected)}
                            title={`${row.row}${seat.seatNumber} - ${seat.seatType} - ₹${getSeatPrice(seat.seatType)}`}
                          >
                            {seat.seatNumber}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Aisle gap */}
                    <div className="w-4"></div>
                    
                    {/* Middle section (seats 5-6) */}
                    <div className="flex">
                      {row.seats.slice(4, 6).map((seat) => {
                        const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                        return (
                          <button
                            key={seat.seatId}
                            onClick={() => handleSeatClick(row.row, seat.seatNumber, seat.seatType, seat.isBooked)}
                            disabled={seat.isBooked}
                            className={getSeatClassName(seat, isSelected)}
                            title={`${row.row}${seat.seatNumber} - ${seat.seatType} - ₹${getSeatPrice(seat.seatType)}`}
                          >
                            {seat.seatNumber}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Aisle gap */}
                    <div className="w-4"></div>
                    
                    {/* Right section (seats 7-10) */}
                    <div className="flex">
                      {row.seats.slice(6, 10).map((seat) => {
                        const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                        return (
                          <button
                            key={seat.seatId}
                            onClick={() => handleSeatClick(row.row, seat.seatNumber, seat.seatType, seat.isBooked)}
                            disabled={seat.isBooked}
                            className={getSeatClassName(seat, isSelected)}
                            title={`${row.row}${seat.seatNumber} - ${seat.seatType} - ₹${getSeatPrice(seat.seatType)}`}
                          >
                            {seat.seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">Seat Legend</h4>
              <div className="flex flex-wrap gap-4 justify-center text-xs">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                  <div className="w-5 h-5 bg-gradient-to-t from-blue-200 to-blue-100 border-2 border-blue-400 rounded-t-xl shadow-sm"></div>
                  <span className="font-medium">Regular ₹{prices.regular || 150}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                  <div className="w-5 h-5 bg-gradient-to-t from-yellow-300 to-yellow-200 border-2 border-yellow-500 rounded-t-xl shadow-sm"></div>
                  <span className="font-medium">Premium ₹{getSeatPrice('premium')}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                  <div className="w-5 h-5 bg-gradient-to-t from-purple-300 to-purple-200 border-2 border-purple-500 rounded-t-xl shadow-sm"></div>
                  <span className="font-medium">Recliner ₹{getSeatPrice('recliner')}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                  <div className="w-5 h-5 bg-green-500 border-2 border-green-600 rounded-t-xl shadow-sm ring-2 ring-green-300"></div>
                  <span className="font-medium text-green-700">Selected</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                  <div className="w-5 h-5 bg-red-500 border-2 border-red-600 rounded-t-xl shadow-sm opacity-75"></div>
                  <span className="font-medium text-red-700">Unavailable</span>
                </div>
              </div>
              <div className="text-center mt-3 text-xs text-gray-600">
                <p>• Click on seats to select/deselect • Rows A-C: Premium • Rows H-J: Recliner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-bold mb-4">Booking Summary</h3>
            
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No seats selected</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {selectedSeats.map((seat) => (
                    <div key={seat.seatId} className="flex justify-between items-center">
                      <span className="font-medium">
                        {seat.row}{seat.seatNumber} ({seat.type})
                      </span>
                      <span className="flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {seat.price}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      {getTotalAmount()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || selectedSeats.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <p>• Maximum {MAX_SEATS} seats can be selected</p>
              <p>• Prices are inclusive of all taxes</p>
              <p>• No cancellation 2 hours before show time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
