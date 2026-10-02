# Pandal Tracker

A full-stack Pandal Tracker app built with React, Node.js, Express, MongoDB Atlas, and a Vercel-friendly serverless API.

## Overview

This project converts the original static HTML/CSS/JS Pandal Tracker into a modern full-stack application.

It includes:
- React frontend for the dashboard UI
- Express API for fetching and updating progress
- MongoDB Atlas for persistent storage
- serverless API setup for Vercel deployment
- seed script for the initial pandal dataset

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Deployment: Vercel

## Project Structure

```bash
pandal-tracker/
├── api/
│   └── index.js                  # Serverless Express API for Vercel
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── data/
│   │   └── seed.js
│   ├── models/
│   │   ├── Pandal.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── pandalRoutes.js
│   │   └── progressRoutes.js
│   └── server.js                # Local development server
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── vercel.json
└── package-lock.json (optional if generated locally)
```

## Features

- Zone-wise pandal listing
- Search pandals by name
- Filter by all / visited / pending
- Toggle visited status
- Add notes per pandal
- Progress bar for festival completion
- MongoDB persistence
- Vercel-ready deployment setup

## Local Development

### 1. Install dependencies

```bash
npm install
npm install --prefix client
```

### 2. Set up environment variables

Copy the sample file:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pandalTracker?retryWrites=true&w=majority
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
npm run seed
```

This inserts the initial pandal data into MongoDB Atlas.

### 4. Start the app

```bash
npm run dev
```

This starts:
- the frontend on `http://localhost:5173`
- the local backend on `http://localhost:5000`

## API Endpoints

### Health check

```http
GET /api
```

### Fetch pandals

```http
GET /api/pandals
```

### Fetch progress

```http
GET /api/progress
```

### Update pandal progress

```http
PUT /api/progress/:pandalId
```

Example body:

```json
{
  "visited": true,
  "note": "Visited with family"
}
```

## Production Deployment (Vercel)

This project is set up for Vercel deployment with:
- frontend served as a Vite static app
- backend served from `api/index.js` as a serverless Express API

### Required environment variables in Vercel

```env
MONGO_URI=your_mongodb_atlas_connection_string
VITE_API_URL=https://your-project-name.vercel.app/api
```

### Deploy

1. Push the repository to GitHub
2. Import it in Vercel
3. Add the required environment variables
4. Deploy the project

## Notes

- The project uses a serverless Express setup for easier Vercel hosting.
- The local development script still runs the traditional Express server via `server/server.js`.
- MongoDB Atlas is the persistent data layer for all pandal records and progress tracking.

## Scripts

Root `package.json` includes:

```bash
npm run dev
npm run build
npm run seed
```

## License

MIT
