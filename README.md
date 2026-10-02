# Pandal Tracker

A full-stack Pandal Tracker app built with React, Node.js, Express, and MongoDB Atlas.

## Features
- Zone-wise pandal tracking
- Search by pandal name
- Filter by all, visited, and pending
- Mark pandals as visited
- Add notes per pandal
- Progress bar for tracking completion
- MongoDB Atlas-ready backend

## Tech stack
- React
- Vite
- Node.js
- Express
- MongoDB Atlas
- Mongoose

## Project structure

```bash
.
├── client
├── server
├── package.json
├── .env.example
└── README.md
```

## Quick start

1. Install root dependencies:

```bash
npm install
```

2. Install client and server dependencies:

```bash
npm install --prefix client
npm install --prefix server
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Add your MongoDB Atlas connection string to `.env`.

5. Seed the database:

```bash
npm run seed
```

6. Start the app:

```bash
npm run dev
```

This starts both the backend and frontend together.

## Environment variables

Create a `.env` file in the root:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pandalTracker?retryWrites=true&w=majority
PORT=5000
```

## Backend routes

- `GET /api/pandals`
- `GET /api/progress`
- `PUT /api/progress/:pandalId`

## Frontend

Frontend runs on:
- http://localhost:5173

Backend runs on:
- http://localhost:5000

## Notes

This starter project converts your static browser-only Pandal Tracker into a dynamic app backed by MongoDB Atlas.
