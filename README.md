Durga Puja 2026 Pandal Tracker

A web-based tracker for exploring and managing Durga Puja pandals across Kolkata.

The project was originally built as a static HTML application and has been converted to a MERN-based application with a React frontend, Express/Node.js backend, and MongoDB database.

Features

User Features

* View Durga Puja pandals organized by zones/areas
* Track which pandals have been visited
* Mark/unmark a pandal as visited
* View overall visiting progress
* Search for pandals
* Filter pandals by zone
* Open a pandal’s location in Google Maps
* Display pandals on an interactive map
* Show a green tick on map markers for visited pandals
* Support browser location permission for location-based map functionality
* Responsive UI for mobile and desktop

Location Support

Each pandal can have location information in either of the following forms:

* Google Maps URL
* Latitude and longitude coordinates

At least one location method is required when creating a new pandal:

Map URL
OR
Latitude + Longitude

This also allows the application to continue supporting legacy pandal data that only contains a map URL.

⸻

Admin Panel

The application includes an admin panel for managing tracker data.

Administrators can:

* Log in securely
* Create zones
* Update zones
* Delete zones
* Create pandals
* Update pandals
* Delete pandals
* Add/edit pandal notes
* Add Google Maps links
* Add latitude/longitude coordinates
* Manage existing tracker data

Authentication

The admin panel is protected using authentication.

Unauthenticated users cannot access protected admin functionality.

⸻

Tech Stack

Frontend

* React
* JavaScript
* HTML5
* CSS
* Vite

Backend

* Node.js
* Express.js
* JavaScript

Database

* MongoDB
* MongoDB Atlas

Deployment

* Vercel

⸻

Project Structure

pandal-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── seed.js
│   ├── package.json
│   └── ...
│
├── package.json
├── vercel.json
└── README.md

The project uses separate package.json files for the root project, frontend, and backend.

⸻

Data Model

The tracker primarily works with two levels of data:

Zone
 └── Pandals
      ├── Name
      ├── Visited status
      ├── Map URL
      ├── Latitude
      ├── Longitude
      └── Note

A zone groups related pandals together, for example:

Jodhpur Park
 ├── Taltala
 ├── Jodhpur Park
 └── 95 Pally
Sarovar
 ├── Mudiali
 ├── Sibhmandir
 └── Pratapaditya Tricone Park

⸻

Local Development

Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas account
* Git

⸻

Clone the Repository

git clone <repository-url>
cd pandal-tracker

⸻

Install Dependencies

Install root dependencies:

npm install

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install

⸻

Environment Variables

Create the required environment files according to the configuration used by the application.

Typical backend configuration:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=5000

Do not commit .env files or database credentials to GitHub.

⸻

Run the Application

Start the backend:

cd server
npm run dev

Start the frontend in another terminal:

cd client
npm run dev

The frontend will normally be available through the Vite development server.

⸻

Database Seeding

The backend contains a seed.js script for inserting initial tracker data into MongoDB.

Run it from the server directory:

node seed.js

Make sure the MongoDB connection string is configured before running the seed script.

Note: Running the seed script can insert duplicate data if the script does not clear or upsert existing records. Check the current seed.js implementation before running it against an existing database.

⸻

Vercel Deployment

The project is structured so that the application can be deployed using Vercel.

The root vercel.json controls the deployment configuration.

The repository contains:

package.json
client/package.json
server/package.json
vercel.json

These files serve different purposes.

* Root package.json manages the overall project.
* client/package.json manages frontend dependencies and scripts.
* server/package.json manages backend dependencies and scripts.
* vercel.json tells Vercel how the project should be built and routed.

⸻

Map Functionality

The tracker supports displaying pandals on a map.

A pandal can be located using:

Map URL

or:

Latitude
Longitude

If coordinates are available, they can be used directly for map markers.

For older records where only a map URL exists, the application continues to support the existing data instead of requiring immediate migration.

⸻

Visited Markers

Visited pandals are visually distinguished on the map.

A visited marker displays a green tick so users can quickly identify:

✓ Visited

versus:

Not visited

This provides a quick visual overview while exploring the map.

⸻

Admin Data Validation

When creating or editing a pandal, the administrator must provide at least one location option:

Map URL

OR

Latitude + Longitude

This keeps the application compatible with existing records while encouraging newer records to contain precise coordinates.

⸻

Development Workflow

Development is organized into iterations.

Current development areas include:

1. MERN conversion
2. MongoDB integration
3. Admin panel
4. Admin authentication
5. Zone and pandal CRUD
6. Map integration
7. Map location support
8. Visited status
9. Visited map marker indicators
10. UI and usability improvements

Future features can be added without changing the existing tracker data structure unnecessarily.

⸻

Legacy Data

The application is designed to support existing tracker data.

Legacy records may contain:

* Pandal name
* Zone
* Map URL
* Note
* Visited status

New records can additionally contain:

* Latitude
* Longitude

The application should therefore not assume that every existing pandal has coordinates.

⸻

Security

The following should never be committed to the repository:

.env
MongoDB credentials
JWT secrets
API keys
Private deployment credentials

Use environment variables for sensitive configuration.

⸻

Future Improvements

Possible future improvements include:

* Better route planning between pandals
* Distance calculation
* Nearby pandal suggestions
* GPS-based location tracking
* Automatic nearest-pandal detection
* Pandal photos
* Estimated visit time
* Crowd information
* Shareable itineraries
* Improved mobile UI
* Offline support

⸻

Project Goal

The goal of the project is to turn a personal Durga Puja pandal checklist into a practical web application where users can:

Discover → Navigate → Visit → Track

their Durga Puja pandal journey across Kolkata.

⸻

License

This project is for personal/project use.