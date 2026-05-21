# Doc Appoint Server


This is a Node.js/Express backend server for a doctor appointment booking system. It provides RESTful APIs for managing doctors, appointments, and user bookings, and uses MongoDB as the database.


<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-brightgreen)](https://doc-appoint-delta.vercel.app/)
[![GitHub stars](https://img.shields.io/github/stars/ahmedriadx10/doc-appoint-server)](https://github.com/ahmedriadx10/doc-appoint-server)

</div>

## Features

- User authentication and JWT validation (with remote JWKS)
- Manage doctor appointments
- Book, update, and delete appointments
- Retrieve top-rated doctors
- User-specific booking management
- CORS and JSON body parsing

## Tech Stack

- Node.js
- Express.js
- MongoDB
- jose-cjs (JWT handling)
- dotenv (environment variables)
- cors

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB database (URI required)

### Installation

1. Clone the repository or copy the project files.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=your_client_url_for_jwks
   ```
4. Start the server:
   ```bash
   node index.js
   ```

## API Endpoints

### Health Check

- `GET /` — Returns server status

### Appointments

- `GET /appointments` — List all appointments (supports `?search=` query)
- `GET /appointments/:id` — Get details of a specific doctor (JWT required)
- `GET /top-rated-doctors` — List top 3 rated doctors

### Bookings

- `POST /bookings` — Create a new booking (JWT required)
- `GET /bookings/:id` — Get all bookings for a user (JWT required)
- `PATCH /bookings/:bookingId` — Update a booking (JWT required)
- `DELETE /bookings/:bookingId` — Delete a booking (JWT required)

## Deployment

This project is ready for deployment on Vercel using the provided `vercel.json` configuration.


