import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/user.js';
import Screen from './Models/screens.js';
import Playlist from './Models/playlist.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding');
      } catch (connErr) {
        console.error('Failed to connect to provided MONGODB_URI:', connErr.message || connErr);
        // fall back to in-memory DB in development or when provided URI is unreachable
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB for seeding (fallback)');
      }
    } else {
      // If no URI provided, fall back to in-memory server for development
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB for seeding');
    }

    // Clear existing data
    await User.deleteMany({});
    await Screen.deleteMany({});
    await Playlist.deleteMany({});

    // Create seeded user
    const user = new User({
      email: process.env.SEED_EMAIL || 'admin@example.com',
      password: process.env.SEED_PASSWORD || 'admin123',
      role: process.env.SEED_ROLE || 'ADMIN'
    });
    await user.save();

    // Create sample screens
    const screens = await Screen.insertMany([
      { name: 'Main Lobby Screen' },
      { name: 'Conference Room Display' },
      { name: 'Reception Screen', isActive: false },
      { name: 'Cafeteria TV' },
      { name: 'Office Entrance Display' }
    ]);

    // Create sample playlists
    const playlists = await Playlist.insertMany([
      {
        name: 'Welcome Content',
        itemUrls: [
          'https://example.com/welcome1.jpg',
          'https://example.com/welcome2.mp4'
        ]
      },
      {
        name: 'Company Announcements',
        itemUrls: [
          'https://example.com/announcement1.png',
          'https://example.com/announcement2.jpg',
          'https://example.com/announcement3.mp4'
        ]
      },
      {
        name: 'Marketing Materials',
        itemUrls: []
      }
    ]);

    console.log('Seed data created successfully!');
    console.log(`User created: ${user.email} (${user.role})`);
    console.log(`Screens created: ${screens.length}`);
    console.log(`Playlists created: ${playlists.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();