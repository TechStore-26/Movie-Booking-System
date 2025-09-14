import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('\n🔧 DATABASE SETUP REQUIRED:');
    console.log('Please choose one of the following options:');
    console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('2. Create a free MongoDB Atlas account: https://www.mongodb.com/atlas');
    console.log('3. Update MONGODB_URI in your .env file with your connection string');
    console.log('\nServer will continue running without database for API testing...\n');
    // Don't exit - let server run for frontend testing
  }
};

export default connectDB;
