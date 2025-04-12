import mongoose from 'mongoose';

// Check if we're in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Use the correct MongoDB connection string
const MONGO_URL = process.env.MONGO_URL!;

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable inside .env');
}

// Define proper types for the global mongoose cache
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add the correct global type declaration
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Initialize the cached connection object
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// Only assign to global in development (prevents memory leaks in production)
if (!isProduction) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Additional useful options
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    try {
      cached.promise = mongoose.connect(MONGO_URL, opts);
    } catch (error) {
      cached.promise = null;
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
  
  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to establish MongoDB connection:', error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;