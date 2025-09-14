import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'recliner'],
    default: 'regular',
  }
});

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 100, // 10x10 grid
  },
  seatLayout: {
    rows: {
      type: Number,
      default: 10,
    },
    seatsPerRow: {
      type: Number,
      default: 10,
    }
  },
  screenType: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D',
  },
  soundSystem: {
    type: String,
    enum: ['Dolby Digital', 'Dolby Atmos', 'DTS', 'IMAX Enhanced'],
    default: 'Dolby Digital',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;