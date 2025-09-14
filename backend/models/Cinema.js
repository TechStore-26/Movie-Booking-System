import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    }
  },
  totalScreens: {
    type: Number,
    required: true,
    min: 1,
  },
  amenities: [{
    type: String,
    enum: ['parking', 'food-court', 'wheelchair-accessible', '3D', 'IMAX', '4DX', 'air-conditioning']
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Cinema = mongoose.model('Cinema', cinemaSchema);
export default Cinema;