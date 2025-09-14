import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
  seats: [{
    row: {
      type: String,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['regular', 'premium', 'recliner'],
      default: 'regular',
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  showDate: {
    type: Date,
    required: true,
  },
  showTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed', // Since we're not implementing actual payment
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  timestamps: true,
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = `MB${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Index for efficient querying
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ bookingReference: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;