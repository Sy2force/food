# Flavors of Israel - Backend API

## Structure
- `/config`: Configuration files
- `/controllers`: Logic for Users and Cards
- `/routes`: API routes definitions
- `/models`: Mongoose schemas (User, Card, etc.)
- `/middlewares`: Auth, Validation, Logger
- `/utils`: Utility functions
- `/scripts`: Database seeding scripts
- `/logs`: Access and Error logs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file in the `backend` directory with:
   ```
   PORT=3007
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/flavors_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. Seed Database:
   ```bash
   npm run seed
   ```

4. Run Server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users`: Register a new user
- `POST /api/users/login`: Login
- `GET /api/users`: Get all users (Admin)
- `GET /api/users/:id`: Get user details (Self/Admin)
- `PUT /api/users/:id`: Update user profile (Self)
- `PATCH /api/users/:id`: Update isBusiness status (Self)
- `DELETE /api/users/:id`: Delete user (Self/Admin)

### Cards
- `GET /api/cards`: Get all cards
- `GET /api/cards/my-cards`: Get my cards (Logged in)
- `GET /api/cards/:id`: Get specific card
- `POST /api/cards`: Create card (Business only)
- `PUT /api/cards/:id`: Update card (Creator)
- `PATCH /api/cards/:id`: Like/Unlike card (Logged in)
- `DELETE /api/cards/:id`: Delete card (Creator/Admin)
