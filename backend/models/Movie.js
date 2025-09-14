import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: [{
    type: String,
    required: true,
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Adventure', 'Animation', 'Biography', 'Crime', 'Documentary', 'Family', 'Fantasy', 'History', 'Music', 'Mystery', 'Sci-Fi', 'Sport', 'War', 'Western']
  }],
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: String,
    enum: ['U', 'UA', 'A', 'S'],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  cast: [{
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    }
  }],
  director: {
    type: String,
    required: true,
  },
  producer: {
    type: String,
  },
  posterUrl: {
    type: String,
    default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iMTUwIiB5PSIyMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gUG9zdGVyPC90ZXh0Pjwvc3ZnPg==',
  },
  trailerUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10,
  }
}, {
  timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;