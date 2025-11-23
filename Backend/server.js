import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import screenRoutes from './routes/screens.js';
import playlistRoutes from './routes/playlists.js';
import User from './Models/user.js';
import Screen from './Models/screens.js';
import Playlist from './Models/playlist.js';

dotenv.config();

// Validate important env vars early and provide a clear error
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing required environment variable: MONGODB_URI. Create a .env file or set the env var.');
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/screens', screenRoutes);
app.use('/playlists', playlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Try connecting to the configured MongoDB URI. If it fails and we're in
// development, fall back to an in-memory MongoDB so the app can still run.
(async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);

    if (process.env.NODE_ENV === 'development') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB (development fallback)');
      } catch (memErr) {
        console.error('In-memory MongoDB startup failed:', memErr);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
  console.log("THIS IS FOR ASSIGNMENT")
  // Development seeding: if no users exist, create seed data so frontend can log in.
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found — creating seed data');
      const user = new User({
        email: process.env.SEED_EMAIL || 'admin@example.com',
        password: process.env.SEED_PASSWORD || 'admin123',
        role: process.env.SEED_ROLE || 'ADMIN'
      });
      await user.save();

      await Screen.deleteMany({});
      await Playlist.deleteMany({});

      await Screen.insertMany([
        { name: 'Main Lobby Screen' },
        { name: 'Conference Room Display' },
        { name: 'Reception Screen', isActive: false },
        { name: 'Cafeteria TV' },
        { name: 'Office Entrance Display' }
      ]);

      await Playlist.insertMany([
        {
          name: 'Welcome Content',
          itemUrls: ['https://example.com/welcome1.jpg', 'https://example.com/welcome2.mp4']
        },
        {
          name: 'Company Announcements',
          itemUrls: ['https://example.com/announcement1.png', 'https://example.com/announcement2.jpg', 'https://example.com/announcement3.mp4']
        },
        { name: 'Marketing Materials', itemUrls: [] }
      ]);

      console.log('Seed data created by server startup');
    }
  } catch (seedErr) {
    console.error('Seeding error on startup:', seedErr.message || seedErr);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

export default app;