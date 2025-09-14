import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Film, 
  Ticket, 
  IndianRupee, 
  User, 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Trash2,
  Filter,
  Search
} from 'lucide-react';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelLoading, setCancelLoading] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filter, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(booking => booking.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
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

  const canCancelBooking = (booking) => {
    const showDateTime = new Date(`${booking.showDate}T${booking.showTime}:00`);
    const now = new Date();
    const timeDiff = showDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return booking.status === 'confirmed' && hoursDiff > 2;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelLoading(bookingId);
      const response = await bookingAPI.cancelBooking(bookingId);
      
      if (response.success) {
        // Update the booking in the list
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' }
            : booking
        ));
        
        // Close modal if this booking was selected
        if (selectedBooking?._id === bookingId) {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={fetchBookings}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Ticket className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600">Manage your movie ticket bookings</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by movie, cinema, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input min-w-32"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {bookings.length === 0 ? 'No Bookings Yet' : 'No Bookings Found'}
          </h3>
          <p className="text-gray-400 mb-6">
            {bookings.length === 0 
              ? 'Start booking your favorite movies to see them here!'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {bookings.length === 0 && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Film className="w-4 h-4" />
              Browse Movies
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Movie Poster */}
                  <img
                    src={booking.movie.poster || '/api/placeholder/80/120'}
                    alt={booking.movie.title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.movie.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.cinema.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            <span>{booking.screen.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking.showDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(booking.showTime)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status and Amount */}
                      <div className="text-right flex-shrink-0">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 flex items-center justify-end">
                          <IndianRupee className="w-4 h-4" />
                          {booking.totalAmount}
                        </div>
                      </div>
                    </div>

                    {/* Seats and Booking Reference */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>Seats:</strong> {booking.seats.map(seat => `${seat.row}${seat.seatNumber}`).join(', ')}
                        </span>
                        <span className="text-gray-600">
                          <strong>Booking ID:</strong> {booking.bookingReference}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelLoading === booking._id}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50"
                          >
                            {cancelLoading === booking._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Booking Details</h2>
                    <p className="text-blue-100 text-sm">{selectedBooking.bookingReference}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Movie Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={selectedBooking.movie.poster || '/api/placeholder/120/180'}
                  alt={selectedBooking.movie.title}
                  className="w-24 h-36 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBooking.movie.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedBooking.cinema.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      <span>{selectedBooking.screen.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedBooking.showDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(selectedBooking.showTime)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="capitalize">{selectedBooking.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Seat Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedBooking.seats.map((seat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
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
              </div>

              {/* Summary */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="font-semibold">{selectedBooking.seats.length}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-semibold">{formatDate(selectedBooking.bookingDate)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedBooking.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : selectedBooking.paymentStatus === 'refunded'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {selectedBooking.totalAmount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download Ticket
                </button>
                
                {canCancelBooking(selectedBooking) && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking._id);
                    }}
                    disabled={cancelLoading === selectedBooking._id}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {cancelLoading === selectedBooking._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Cancel Booking
                  </button>
                )}
              </div>

              {/* Cancellation Note */}
              {canCancelBooking(selectedBooking) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Bookings can be cancelled up to 2 hours before the show time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
