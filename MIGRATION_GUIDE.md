# Migration Guide: Express to NestJS + TypeScript

## Overview
The Adda server has been successfully migrated from Express.js (JavaScript) to NestJS (TypeScript) with MongoDB using Mongoose.

## What Changed

### Technology Stack
- **Before**: Express.js + JavaScript + Mongoose
- **After**: NestJS + TypeScript + Mongoose

### New Project Structure
```
adda-server/
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── strategies/        # Passport JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── user/                  # User module
│   │   ├── dto/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── post/                  # Post module
│   │   ├── dto/
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   └── post.module.ts
│   ├── comment/               # Comment module
│   │   ├── dto/
│   │   ├── comment.controller.ts
│   │   ├── comment.service.ts
│   │   └── comment.module.ts
│   ├── database/              # Database configuration
│   │   ├── schemas/           # Mongoose schemas in TypeScript
│   │   │   ├── user.schema.ts
│   │   │   ├── post.schema.ts
│   │   │   └── comment.schema.ts
│   │   └── database.module.ts
│   ├── common/                # Shared utilities
│   │   ├── guards/            # Authentication guards
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   └── interceptors/      # Interceptors
│   ├── app.module.ts          # Root application module
│   └── main.ts                # Application entry point
├── dist/                      # Compiled JavaScript output
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # NestJS CLI configuration
└── package.json               # Updated dependencies

Old files (can be deleted after testing):
├── server.js
├── db.js
├── controller/
├── service/
├── routes/
├── models/
├── middleware/
├── schemas/
└── utils/
```

## Available Scripts

```bash
# Development mode with hot-reload
npm run dev

# Build the project
npm run build

# Start the production build
npm run start:prod

# Start without watching (compiled mode)
npm start

# Debug mode
npm run start:debug
```

## Key Features

### 1. Type Safety
All code is now written in TypeScript with proper type checking and interfaces.

### 2. Dependency Injection
NestJS provides a powerful dependency injection system for better modularity and testability.

### 3. Decorators
- `@Controller()` - Define routes
- `@Injectable()` - Mark services as injectable
- `@UseGuards()` - Apply authentication guards
- `@Body()`, `@Param()`, `@Query()` - Extract request data
- Custom `@CurrentUser()` decorator for authenticated user

### 4. Validation
Automatic request validation using `class-validator` and `class-transformer`.

### 5. Module System
Clean separation of concerns with feature modules (auth, user, post, comment).

## API Endpoints

All endpoints remain the same:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /user` - Get all users
- `GET /user/me` - Get current user (protected)
- `GET /user/:userId` - Get user by ID
- `PATCH /user/profile` - Update user profile (protected)
- `POST /user/friend-request/:friendId` - Send friend request (protected)
- `POST /user/accept-request/:friendId` - Accept friend request (protected)
- `POST /user/reject-request/:friendId` - Reject friend request (protected)
- `POST /user/cancel-request/:friendId` - Cancel friend request (protected)

### Posts
- `POST /post` - Create post
- `GET /post` - Get all posts
- `GET /post/:postId` - Get post by ID
- `PATCH /post/:postId` - Update post
- `DELETE /post/:postId` - Delete post
- `PATCH /post/:postId/reaction` - Add/remove like/dislike

### Comments
- `POST /comment` - Create comment
- `GET /comment/post/:postId` - Get comments by post ID

## Environment Variables

Make sure your `.env` file contains:
```
PORT=3000
USER_NAME=your_mongodb_username
DB_PASS=your_mongodb_password
```

## Database

The MongoDB connection and schemas remain the same, just converted to TypeScript with Mongoose decorators.

## Authentication

JWT-based authentication using Passport and `@nestjs/jwt`:
- Token expiration: 7 days
- Protected routes use `@UseGuards(JwtAuthGuard)`
- Current user accessible via `@CurrentUser()` decorator

## CORS

CORS is enabled for all origins. Update in `src/main.ts` if you need to restrict origins.

## What to Test

1. User registration and login
2. JWT authentication on protected routes
3. CRUD operations for posts
4. Comment system
5. Friend request system
6. Like/dislike functionality

## Migration Checklist

- [x] Install NestJS dependencies
- [x] Create TypeScript configuration
- [x] Convert Mongoose models to schemas
- [x] Migrate authentication logic
- [x] Convert all controllers to NestJS controllers
- [x] Convert all services to NestJS providers
- [x] Implement JWT guards
- [x] Set up validation pipes
- [x] Configure CORS
- [x] Test build process
- [x] Test server startup

## Next Steps

1. **Test the application thoroughly** with your frontend
2. **Delete old files** (controller/, service/, routes/, models/, etc.) after confirming everything works
3. **Add unit and e2e tests** using Jest (included with NestJS)
4. **Update JWT secret** - Move it to environment variables
5. **Add API documentation** using Swagger (`@nestjs/swagger`)
6. **Implement proper error handling** with exception filters
7. **Add logging** with a proper logger (e.g., Winston)
8. **Set up CI/CD** pipeline

## Troubleshooting

### Build Errors
```bash
npm run build
```
Check for TypeScript errors and fix them.

### Server Won't Start
- Verify MongoDB connection string in `.env`
- Check if port is already in use
- Ensure all dependencies are installed

### Authentication Issues
- Verify JWT secret is properly configured
- Check token format in Authorization header: `Bearer <token>`

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Mongoose with NestJS](https://docs.nestjs.com/techniques/mongodb)
- [Authentication in NestJS](https://docs.nestjs.com/security/authentication)
- [Validation in NestJS](https://docs.nestjs.com/techniques/validation)
