# Movie Booking System

A full-stack movie booking system built with the MERN stack, allowing users to browse cinemas, select movies, book seats, and manage their bookings.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Context API** - State management

## 📋 Features

### Core Functionality ✅
- **User Authentication**: Register, login, logout with JWT tokens
- **Cinema Listing**: Display all available cinemas with location and amenities
- **Movie & Show Listings**: View movies and showtimes by cinema
- **Seat Selection**: Interactive seat map with booking status
- **Booking Management**: Create bookings and view booking history
- **Responsive Design**: Mobile-friendly interface

### User Features
- User registration and authentication
- Browse cinemas by location
- View movie details and showtimes
- Select up to 6 seats per booking
- Booking confirmation with payment simulation
- View booking history and details
- User profile management

### Admin Features (Data Management)
- Pre-populated cinema data
- Movie catalog with details
- Screen and seat layout management
- Show scheduling system

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cinemas Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  totalScreens: Number,
  amenities: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Screens Collection
```javascript
{
  _id: ObjectId,
  name: String,
  cinema: ObjectId (ref: Cinema),
  capacity: Number,
  seatLayout: {
    rows: Number,
    seatsPerRow: Number
  },
  screenType: String,
  soundSystem: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Movies Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  genre: [String],
  duration: Number,
  releaseDate: Date,
  rating: String,
  language: String,
  cast: [{
    name: String,
    role: String
  }],
  director: String,
  producer: String,
  posterUrl: String,
  trailerUrl: String,
  isActive: Boolean,
  imdbRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Shows Collection
```javascript
{
  _id: ObjectId,
  movie: ObjectId (ref: Movie),
  screen: ObjectId (ref: Screen),
  cinema: ObjectId (ref: Cinema),
  date: Date,
  startTime: String,
  endTime: String,
  price: {
    regular: Number,
    premium: Number,
    recliner: Number
  },
  availableSeats: Number,
  bookedSeats: [{
    row: String,
    seatNumber: Number
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  show: ObjectId (ref: Show),
  movie: ObjectId (ref: Movie),
  cinema: ObjectId (ref: Cinema),
  screen: ObjectId (ref: Screen),
  seats: [{
    row: String,
    seatNumber: Number,
    type: String,
    price: Number
  }],
  totalAmount: Number,
  bookingDate: Date,
  showDate: Date,
  showTime: String,
  status: String,
  paymentStatus: String,
  bookingReference: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Clone the Repository
```bash
git clone <repository-url>
cd movie-booking-system
```

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-booking
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with:
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Database Setup
1. **Local MongoDB**: Install MongoDB locally and ensure it's running
2. **MongoDB Atlas**: Create a cluster and update the `MONGODB_URI` in your `.env` file

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id` - Get single cinema
- `GET /api/cinemas/:id/movies` - Get movies and shows for a cinema
- `GET /api/cinemas/:id/screens` - Get screens for a cinema

### Shows
- `GET /api/shows/:id` - Get show details
- `GET /api/shows/:id/seats` - Get seat layout and availability

### Bookings
- `POST /api/bookings` - Create new booking (Protected)
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (Protected)

## 🎯 User Flow

1. **Home Page**: Users see all available cinemas
2. **Cinema Selection**: Click on a cinema to view movies and showtimes
3. **Show Selection**: Choose a specific showtime
4. **Authentication**: Login or register to proceed with booking
5. **Seat Selection**: Select up to 6 seats on interactive seat map
6. **Payment**: Simulate payment process
7. **Confirmation**: Get booking confirmation with reference number
8. **History**: View past bookings in user profile

## 🔐 Authentication & Authorization

- JWT-based authentication
- Protected routes for booking-related operations
- Automatic token refresh handling
- Secure password hashing with bcrypt

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Seat Map**: Visual seat selection with color coding
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side and server-side validation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Connect your GitHub repository
3. Set environment variables in the deployment platform
4. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)
1. Create account on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy with automatic deployments

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in your backend environment

## 🧪 Testing

To test the complete functionality:

1. Start both backend and frontend servers
2. Register a new user account
3. Browse cinemas on the home page
4. Select a cinema and choose a movie/showtime
5. Complete the seat selection process
6. Verify booking confirmation
7. Check booking history

## 📄 Project Structure

```
movie-booking-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── cinemaController.js
│   │   └── showController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Cinema.js
│   │   ├── Movie.js
│   │   ├── Screen.js
│   │   ├── Show.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── cinemaRoutes.js
│   │   └── showRoutes.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── BookingHistory.jsx
│   │   │   ├── CinemaDetails.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SeatSelection.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository
- Contact the development team

## 📈 Future Enhancements

- Payment gateway integration
- Email notifications for bookings
- Admin dashboard for cinema management
- Movie recommendations
- Social features (reviews, ratings)
- Mobile app development
- Multi-language support
- Advanced filtering and search