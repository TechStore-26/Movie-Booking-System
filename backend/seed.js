import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cinema from './models/Cinema.js';
import Screen from './models/Screen.js';
import Movie from './models/Movie.js';
import Show from './models/Show.js';
import connectDB from './config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Cinema.deleteMany({});
    await Screen.deleteMany({});
    await Movie.deleteMany({});
    await Show.deleteMany({});
    
    console.log('Cleared existing data');

    // Create Cinemas
    const cinemas = await Cinema.insertMany([
      {
        name: 'PVR Cinemas',
        location: {
          address: '123 Mall Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        totalScreens: 4,
        amenities: ['parking', 'food-court', 'wheelchair-accessible', '3D', 'air-conditioning']
      },
      {
        name: 'INOX Multiplex',
        location: {
          address: '456 Central Plaza',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        totalScreens: 3,
        amenities: ['parking', 'food-court', 'IMAX', '3D', 'air-conditioning']
      },
      {
        name: 'Cinepolis',
        location: {
          address: '789 Entertainment City',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        totalScreens: 5,
        amenities: ['parking', 'food-court', 'wheelchair-accessible', '3D', '4DX', 'air-conditioning']
      }
    ]);

    console.log('Created cinemas');

    // Create Screens
    const screens = [];
    for (const cinema of cinemas) {
      for (let i = 1; i <= cinema.totalScreens; i++) {
        const screen = {
          name: `Screen ${i}`,
          cinema: cinema._id,
          capacity: 100,
          seatLayout: {
            rows: 10,
            seatsPerRow: 10
          },
          screenType: i <= 2 ? '3D' : '2D',
          soundSystem: i === 1 ? 'Dolby Atmos' : 'Dolby Digital'
        };
        screens.push(screen);
      }
    }
    
    const createdScreens = await Screen.insertMany(screens);
    console.log('Created screens');

    // Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'Avengers: Endgame',
        description: 'The epic conclusion to the Infinity Saga that became a defining moment in cinematic history.',
        genre: ['Action', 'Adventure', 'Drama'],
        duration: 181,
        releaseDate: new Date('2019-04-26'),
        rating: 'UA',
        language: 'English',
        cast: [
          { name: 'Robert Downey Jr.', role: 'Iron Man' },
          { name: 'Chris Evans', role: 'Captain America' },
          { name: 'Mark Ruffalo', role: 'Hulk' }
        ],
        director: 'Anthony and Joe Russo',
        producer: 'Kevin Feige',
        posterUrl: 'https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg',
        imdbRating: 8.4
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'Peter Parker seeks Doctor Strange\'s help to make everyone forget his secret identity.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        duration: 148,
        releaseDate: new Date('2021-12-17'),
        rating: 'UA',
        language: 'English',
        cast: [
          { name: 'Tom Holland', role: 'Spider-Man' },
          { name: 'Zendaya', role: 'MJ' },
          { name: 'Benedict Cumberbatch', role: 'Doctor Strange' }
        ],
        director: 'Jon Watts',
        producer: 'Kevin Feige',
        posterUrl: 'https://m.media-amazon.com/images/I/71rKVP4A8qL._AC_SY679_.jpg',
        imdbRating: 8.2
      },
      {
        title: 'RRR',
        description: 'A fictional story about two legendary revolutionaries and their journey away from home.',
        genre: ['Action', 'Drama', 'History'],
        duration: 187,
        releaseDate: new Date('2022-03-25'),
        rating: 'UA',
        language: 'Telugu',
        cast: [
          { name: 'N. T. Rama Rao Jr.', role: 'Komaram Bheem' },
          { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
          { name: 'Alia Bhatt', role: 'Sita' }
        ],
        director: 'S. S. Rajamouli',
        producer: 'D. V. V. Danayya',
        posterUrl: 'https://m.media-amazon.com/images/I/61P4pE5gYLL._AC_SY679_.jpg',
        imdbRating: 7.9
      },
      {
        title: 'The Batman',
        description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 176,
        releaseDate: new Date('2022-03-04'),
        rating: 'UA',
        language: 'English',
        cast: [
          { name: 'Robert Pattinson', role: 'Batman/Bruce Wayne' },
          { name: 'Zoë Kravitz', role: 'Catwoman' },
          { name: 'Paul Dano', role: 'The Riddler' }
        ],
        director: 'Matt Reeves',
        producer: 'Dylan Clark',
        posterUrl: 'https://m.media-amazon.com/images/I/81-tcgLnO5L._AC_SY679_.jpg',
        imdbRating: 7.8
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
        genre: ['Action', 'Drama'],
        duration: 131,
        releaseDate: new Date('2022-05-27'),
        rating: 'UA',
        language: 'English',
        cast: [
          { name: 'Tom Cruise', role: 'Pete "Maverick" Mitchell' },
          { name: 'Miles Teller', role: 'Bradley "Rooster" Bradshaw' },
          { name: 'Jennifer Connelly', role: 'Penny Benjamin' }
        ],
        director: 'Joseph Kosinski',
        producer: 'Jerry Bruckheimer',
        posterUrl: 'https://m.media-amazon.com/images/I/91P1u3lUzXL._AC_SY679_.jpg',
        imdbRating: 8.3
      }
    ]);

    console.log('Created movies');

    // Create Shows for next 7 days
    const shows = [];
    const today = new Date();
    const showTimes = ['10:00', '13:30', '17:00', '20:30'];
    
    for (let day = 0; day < 7; day++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + day);
      
      for (const cinema of cinemas) {
        const cinemaScreens = createdScreens.filter(screen => 
          screen.cinema.toString() === cinema._id.toString()
        );
        
        for (const screen of cinemaScreens) {
          // Randomly assign 2-3 movies per screen per day
          const dailyMovies = movies.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
          
          dailyMovies.forEach((movie, index) => {
            const timeIndex = index % showTimes.length;
            const startTime = showTimes[timeIndex];
            
            // Calculate end time
            const [hours, minutes] = startTime.split(':').map(Number);
            const startMinutes = hours * 60 + minutes;
            const endMinutes = startMinutes + movie.duration;
            const endHours = Math.floor(endMinutes / 60);
            const remainingMinutes = endMinutes % 60;
            const endTime = `${endHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
            
            const show = {
              movie: movie._id,
              screen: screen._id,
              cinema: cinema._id,
              date: showDate,
              startTime,
              endTime,
              price: {
                regular: 150 + Math.floor(Math.random() * 100), // Random price between 150-250
                premium: 0, // Will be calculated as 1.5x regular
                recliner: 0  // Will be calculated as 2x regular
              },
              availableSeats: 100,
              bookedSeats: []
            };
            
            // Set premium and recliner prices
            show.price.premium = Math.floor(show.price.regular * 1.5);
            show.price.recliner = show.price.regular * 2;
            
            shows.push(show);
          });
        }
      }
    }
    
    await Show.insertMany(shows);
    console.log('Created shows');
    
    console.log('Database seeded successfully!');
    console.log(`Created ${cinemas.length} cinemas`);
    console.log(`Created ${createdScreens.length} screens`);
    console.log(`Created ${movies.length} movies`);
    console.log(`Created ${shows.length} shows`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

seedData();