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
- View movie details and showtimes
- Select up to 6 seats per booking
- Booking confirmation with payment simulation
- View booking history and details

## 🗄️ Database Schema

### Users Collection
```
| Field     | Type     | Description               |
| --------- | -------- | ------------------------- |
| \_id      | ObjectId | Primary Key               |
| name      | String   | Full name of the user     |
| email     | String   | Unique, user’s email      |
| password  | String   | Hashed password           |
| phone     | String   | User’s phone number       |
| createdAt | Date     | Record creation timestamp |
| updatedAt | Date     | Record update timestamp   |
```

### Cinemas Table
```
| Field        | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| \_id         | ObjectId  | Primary Key                 |
| name         | String    | Cinema name                 |
| location     | Object    | Address details             |
| └ address    | String    | Street address              |
| └ city       | String    | City name                   |
| └ state      | String    | State name                  |
| └ pincode    | String    | Postal code                 |
| totalScreens | Number    | Number of screens in cinema |
| amenities    | \[String] | Available facilities        |
| isActive     | Boolean   | Cinema active/inactive      |
| createdAt    | Date      | Record creation timestamp   |
| updatedAt    | Date      | Record update timestamp     |
```

### Screen Table
```
| Field         | Type     | Description               |
| ------------- | -------- | ------------------------- |
| \_id          | ObjectId | Primary Key               |
| name          | String   | Screen name/number        |
| cinema        | ObjectId | Reference → Cinema        |
| capacity      | Number   | Total seat capacity       |
| seatLayout    | Object   | Seating arrangement       |
| └ rows        | Number   | Number of seat rows       |
| └ seatsPerRow | Number   | Seats per row             |
| screenType    | String   | Type (e.g., IMAX, 2D, 3D) |
| soundSystem   | String   | Sound system used         |
| isActive      | Boolean  | Screen active/inactive    |
| createdAt     | Date     | Record creation timestamp |
| updatedAt     | Date     | Record update timestamp   |
```

### Movie Table
```
| Field       | Type      | Description                    |
| ----------- | --------- | ------------------------------ |
| \_id        | ObjectId  | Primary Key                    |
| title       | String    | Movie title                    |
| description | String    | Short movie description        |
| genre       | \[String] | List of genres                 |
| duration    | Number    | Duration in minutes            |
| releaseDate | Date      | Release date                   |
| rating      | String    | Censor rating (U, UA, A, etc.) |
| language    | String    | Language                       |
| cast        | \[Object] | Actors and roles               |
| └ name      | String    | Actor name                     |
| └ role      | String    | Role in movie                  |
| director    | String    | Movie director                 |
| producer    | String    | Movie producer                 |
| posterUrl   | String    | Poster image link              |
| trailerUrl  | String    | Trailer video link             |
| isActive    | Boolean   | Active/inactive movie          |
| imdbRating  | Number    | IMDb rating                    |
| createdAt   | Date      | Record creation timestamp      |
| updatedAt   | Date      | Record update timestamp        |
```

### Show Table
```
| Field          | Type      | Description               |
| -------------- | --------- | ------------------------- |
| \_id           | ObjectId  | Primary Key               |
| movie          | ObjectId  | Reference → Movie         |
| screen         | ObjectId  | Reference → Screen        |
| cinema         | ObjectId  | Reference → Cinema        |
| date           | Date      | Show date                 |
| startTime      | String    | Start time                |
| endTime        | String    | End time                  |
| price          | Object    | Ticket pricing            |
| └ regular      | Number    | Regular ticket price      |
| └ premium      | Number    | Premium ticket price      |
| └ recliner     | Number    | Recliner ticket price     |
| availableSeats | Number    | Available seats           |
| bookedSeats    | \[Object] | Booked seats              |
| └ row          | String    | Seat row                  |
| └ seatNumber   | Number    | Seat number               |
| isActive       | Boolean   | Active/inactive show      |
| createdAt      | Date      | Record creation timestamp |
| updatedAt      | Date      | Record update timestamp   |
```

### Booking Table
```
| Field            | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| \_id             | ObjectId  | Primary Key                          |
| user             | ObjectId  | Reference → User                     |
| show             | ObjectId  | Reference → Show                     |
| movie            | ObjectId  | Reference → Movie                    |
| cinema           | ObjectId  | Reference → Cinema                   |
| screen           | ObjectId  | Reference → Screen                   |
| seats            | \[Object] | Seat details                         |
| └ row            | String    | Seat row                             |
| └ seatNumber     | Number    | Seat number                          |
| └ type           | String    | Seat type (Regular/Premium)          |
| └ price          | Number    | Price per seat                       |
| totalAmount      | Number    | Total booking amount                 |
| bookingDate      | Date      | Date of booking                      |
| showDate         | Date      | Show date                            |
| showTime         | String    | Show start time                      |
| status           | String    | Booking status (Confirmed/Cancelled) |
| paymentStatus    | String    | Payment status (Paid/Pending)        |
| bookingReference | String    | Unique booking ID                    |
| createdAt        | Date      | Record creation timestamp            |
| updatedAt        | Date      | Record update timestamp              |
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
