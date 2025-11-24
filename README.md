# Assignment

# Frontend - React Application

## Quick Start
1. `cd frontend`
2. `npm install`
3. `npm start` - runs on http://localhost:3000

## Features
- User authentication
- Screens management with search
- Playlists creation and listing
- Responsive design
- Error handling and loading states

## Default Login
- Email: admin@example.com
- Password: admin123

- # Backend - Screens & Playlists API

## Quick Start
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and configure
4. `npm run seed` - to populate sample data
5. `npm run dev` - to start development server

## API Documentation
- Base URL: http://localhost:5000

### Endpoints
- POST /auth/login - User login
- GET /screens - List screens with search & pagination
- PUT /screens/:id - Toggle screen active status
- GET /playlists - List playlists
- POST /playlists - Create new playlist
