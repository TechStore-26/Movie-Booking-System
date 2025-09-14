import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Film, Clock, MapPin, User, IndianRupee, Calendar, Ticket, Download, Share } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!location.state) {
      // If no booking data, redirect to home
      navigate('/');
      return;
    }
    
    const { bookingData, showDetails, selectedSeats, totalAmount } = location.state;
    setBookingDetails({
      booking: bookingData,
      show: showDetails,
      seats: selectedSeats,
      total: totalAmount
    });
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}:00`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const generateBookingId = (booking) => {
    if (booking?._id) {
      return booking._id.slice(-8).toUpperCase();
    }
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { booking, show, seats, total } = bookingDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tickets have been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Booking ID</p>
                  <p className="text-xl font-bold">{generateBookingId(booking)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total Amount</p>
                <p className="text-xl font-bold flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {total}
                </p>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4">
              <img
                src={show?.movie?.poster || '/api/placeholder/80/120'}
                alt={show?.movie?.title}
                className="w-20 h-30 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {show?.movie?.title}
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{show?.cinema?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>{show?.screen?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(show?.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(show?.startTime)}</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {show?.movie?.genre}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {show?.movie?.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {seats?.map((seat, index) => (
                <div key={seat.seatId} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {seat.row}{seat.seatNumber}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {seat.type} Seat
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 flex items-center">
                      <IndianRupee className="w-3 h-3" />
                      {seat.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Seats:</span>
                <span className="font-semibold">{seats?.length}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-gray-900 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {total}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Amount includes all applicable taxes and fees
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Ticket
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              <Share className="w-4 h-4" />
              Share Ticket
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/bookings"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              View All Bookings
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              Book More Tickets
            </Link>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please arrive at the cinema at least 15 minutes before showtime</li>
            <li>• Carry a valid ID proof along with the ticket</li>
            <li>• Outside food and beverages are not allowed</li>
            <li>• Cancellation not allowed 2 hours before showtime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
