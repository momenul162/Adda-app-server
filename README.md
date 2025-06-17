# Adda Server

This is the backend server for the Adda App, built with Node.js and Express. It provides RESTful APIs for authentication, user management, posts, and comments.

## Features

- User registration and authentication (JWT-based)
- CRUD operations for posts and comments
- Request validation and error handling middleware
- Modular structure for controllers, services, models, and routes

## Project Structure

```
controller/         # Route controllers for business logic
middleware/         # Express middleware (auth, validation, etc.)
models/             # Mongoose models for MongoDB
routes/             # API route definitions
schemas/            # Joi validation schemas
service/            # Service layer for business logic
utils/              # Utility functions (error handling, etc.)
db.js               # Database connection setup
server.js           # Entry point for the server
package.json        # Project metadata and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or above recommended)
- MongoDB instance (local or cloud)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd adda-server
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/adda
     JWT_SECRET=your_jwt_secret
     ```

### Running the Server

```sh
pnpm start
# or
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Users

- `GET /api/users/:id` — Get user profile
- `PUT /api/users/:id` — Update user profile

### Posts

- `GET /api/posts` — List all posts
- `POST /api/posts` — Create a new post
- `GET /api/posts/:id` — Get a single post
- `PUT /api/posts/:id` — Update a post
- `DELETE /api/posts/:id` — Delete a post

### Comments

- `GET /api/comments/:postId` — List comments for a post
- `POST /api/comments/:postId` — Add a comment to a post
- `DELETE /api/comments/:id` — Delete a comment

## Scripts

- `pnpm start` — Start the server
- `pnpm dev` — Start the server with nodemon (if configured)

## Deployment

This project is ready for deployment on platforms like Vercel. See `vercel.json` for configuration.

## License

MIT
