// MongoDB Configuration for Contact Form
// This file shows the environment variables needed for the backend

export const config = {
    // MongoDB Connection URI
    // For local development: 'mongodb://localhost:27017/beryfy'
    // For MongoDB Atlas: 'mongodb+srv://username:password@cluster.mongodb.net/beryfy'
    MONGODB_URI: 'mongodb://localhost:27017/beryfy',
    
    // Frontend URL (for CORS configuration)
    FRONTEND_URL: 'http://localhost:5173',
    
    // Server Configuration
    PORT: 5000,
    NODE_ENV: 'development'
};
