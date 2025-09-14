import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: true,
  },
  endTime: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: true,
  },
  price: {
    regular: {
      type: Number,
      required: true,
      min: 0,
    },
    premium: {
      type: Number,
      default: function() {
        return this.price?.regular * 1.5 || 0;
      }
    },
    recliner: {
      type: Number,
      default: function() {
        return this.price?.regular * 2 || 0;
      }
    }
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 100, // Total seats in screen
  },
  bookedSeats: [{
    row: {
      type: String,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

// Index for efficient querying
showSchema.index({ cinema: 1, date: 1, startTime: 1 });
showSchema.index({ movie: 1, date: 1 });

// Virtual for calculating end time based on movie duration
showSchema.virtual('calculatedEndTime').get(function() {
  if (this.movie && this.movie.duration && this.startTime) {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + this.movie.duration;
    const endHours = Math.floor(endMinutes / 60);
    const remainingMinutes = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }
  return this.endTime;
});

const Show = mongoose.model('Show', showSchema);
export default Show;