# 🚀 NestJS Complete Bangla Guide - Beginner to Advanced

## 📚 Table of Contents
1. [NestJS Ki aar Keno Use Korbo](#nestjs-ki-aar-keno-use-korbo)
2. [Project Structure Explained](#project-structure-explained)
3. [Decorators in Depth](#decorators-in-depth)
4. [Request-Response Flow](#request-response-flow)
5. [Dependency Injection](#dependency-injection)
6. [Authentication System](#authentication-system)
7. [Database Integration](#database-integration)
8. [Validation System](#validation-system)
9. [Common Patterns](#common-patterns)
10. [Best Practices](#best-practices)

---

## 1. NestJS Ki aar Keno Use Korbo

### 🤔 NestJS Ki?

NestJS holo ekta **Progressive Node.js Framework** ja TypeScript use kore enterprise-level applications build korar jonno.

**Simple kotha:**
- Express.js er upor built
- TypeScript er power use kore
- Angular er moto architecture follow kore
- Large applications easily manage kora jay

### 📊 Express vs NestJS Comparison

#### **Express (Traditional Way):**

```javascript
// server.js
const express = require('express');
const app = express();

// Sobkichu ek jaygay messy
app.post('/users', async (req, res) => {
  try {
    // Validation manually
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email required' });
    }
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ error: 'Password too short' });
    }

    // Check duplicate
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save to DB
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, 'secret-key');

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emon onekgulo routes...
app.post('/posts', ...);
app.get('/posts', ...);
// Code boro hole manage kora mushkil!
```

**Problems:**
1. ❌ Sob logic ek jaygay - messy, unreadable
2. ❌ Validation manually korte hoy
3. ❌ Error handling bar bar likhte hoy
4. ❌ Testing kothin
5. ❌ Code reuse kora jay na
6. ❌ Type safety nei
7. ❌ Large team e kaj kora kothin

---

#### **NestJS (Modern Way):**

```typescript
// DTO - Data structure + validation
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

// Controller - Just handles HTTP requests
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Validation automatic!
    // Just call service
    return this.userService.create(createUserDto);
  }
}

// Service - Business logic alada
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check duplicate
    const exists = await this.userModel.findOne({
      email: createUserDto.email
    });

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create user
    const user = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
    });

    return user.save();
  }
}
```

**Benefits:**
1. ✅ **Organized** - Controller, Service, DTO alada alada
2. ✅ **Auto Validation** - Decorators use kore
3. ✅ **Type Safe** - TypeScript autocomplete, compile-time errors
4. ✅ **Testable** - Each part easily test kora jay
5. ✅ **Reusable** - Service kothao use kora jay
6. ✅ **Scalable** - Large projects e perfect
7. ✅ **Team Friendly** - Clean structure

---

## 2. Project Structure Explained

### 📁 Complete Folder Structure

```
adda-server/
├── src/                          # Main source code
│   ├── auth/                     # Authentication feature module
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── login.dto.ts      # Login request structure
│   │   │   └── register.dto.ts   # Registration request structure
│   │   ├── strategies/           # Passport strategies
│   │   │   └── jwt.strategy.ts   # JWT authentication logic
│   │   ├── auth.controller.ts    # HTTP endpoints (/auth/*)
│   │   ├── auth.service.ts       # Business logic
│   │   └── auth.module.ts        # Module configuration
│   │
│   ├── user/                     # User management module
│   │   ├── dto/
│   │   │   └── update-user.dto.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   │
│   ├── post/                     # Post management module
│   │   ├── dto/
│   │   │   ├── create-post.dto.ts
│   │   │   ├── update-post.dto.ts
│   │   │   └── reaction.dto.ts
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   └── post.module.ts
│   │
│   ├── comment/                  # Comment module
│   │   ├── dto/
│   │   │   └── create-comment.dto.ts
│   │   ├── comment.controller.ts
│   │   ├── comment.service.ts
│   │   └── comment.module.ts
│   │
│   ├── database/                 # Database configuration
│   │   ├── schemas/              # Mongoose schemas
│   │   │   ├── user.schema.ts    # User collection structure
│   │   │   ├── post.schema.ts    # Post collection structure
│   │   │   └── comment.schema.ts # Comment collection structure
│   │   └── database.module.ts    # DB connection setup
│   │
│   ├── common/                   # Shared/reusable code
│   │   ├── guards/               # Route protection
│   │   │   └── jwt-auth.guard.ts # JWT authentication guard
│   │   ├── decorators/           # Custom decorators
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/              # Exception filters (future)
│   │   └── interceptors/         # Request/response interceptors (future)
│   │
│   ├── app.module.ts             # Root module - sob module import
│   └── main.ts                   # Application entry point
│
├── dist/                         # Compiled JavaScript (build output)
├── node_modules/                 # npm dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── nest-cli.json                 # NestJS CLI configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler config
└── README.md                     # Project documentation
```

### 🎯 Why This Structure?

#### **1. Feature-Based Modules**

```
auth/          → Login, Register related
user/          → User CRUD, Friends
post/          → Post CRUD, Likes
comment/       → Comments
```

**Benefits:**
- Ekta feature khuje pawa easy
- Team e multiple developers parallel kaj korte pare
- Feature remove korte hole just folder delete

#### **2. Layer Pattern (3-Tier Architecture)**

```
Controller  →  Service  →  Database
   ↓            ↓            ↓
HTTP         Logic       Data Store
```

**Example - Post Create:**

```typescript
// 1. Controller Layer - HTTP handling
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    // Just receive request and call service
    return this.postService.create(createPostDto);
  }
}

// 2. Service Layer - Business logic
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  async create(createPostDto: CreatePostDto) {
    // Validation, processing, business rules
    const post = new this.postModel(createPostDto);
    await post.save();

    // Populate user info
    return this.postModel
      .findById(post._id)
      .populate('userId', 'username photo');
  }
}

// 3. Schema Layer - Data structure
@Schema()
export class Post {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop()
  body: string;
}
```

**Keno alada alada?**
- **Controller**: HTTP er sathe deal kore, business logic jane na
- **Service**: Logic likhe, HTTP jane na, just data process kore
- **Schema**: Data structure define kore

**Benefits:**
- Testing easy - each layer independently test
- Reusability - Service onno jaygay use kora jay
- Maintenance - Logic change hole sudhu service change
- Separation of Concerns - Each layer has specific responsibility

---

## 3. Decorators in Depth

### 🎨 Decorator Ki?

Decorator holo ekta **special syntax** ja class, method, property modify kore. TypeScript er powerful feature.

**Simple Example:**

```typescript
// Without decorator
class User {
  name: string;
}

// With decorator
@Entity()  // <-- Decorator
class User {
  @Column()  // <-- Property decorator
  name: string;
}
```

Decorator use kore metadata add kora jay, behavior modify kora jay.

---

### 📌 Class Decorators

#### **1. `@Controller(path)`**

```typescript
@Controller('users')  // Base path
export class UserController {
  @Get()              // Full path: GET /users
  findAll() {}

  @Get(':id')         // Full path: GET /users/:id
  findOne() {}
}
```

**Ki kore:**
- Class ke HTTP controller banay
- Base route path set kore
- NestJS automatically routing setup kore

**Real Example:**

```typescript
@Controller('auth')
export class AuthController {
  @Post('register')    // POST /auth/register
  register() {}

  @Post('login')       // POST /auth/login
  login() {}
}
```

---

#### **2. `@Injectable()`**

```typescript
@Injectable()
export class UserService {
  // Can be injected into other classes
}
```

**Ki kore:**
- Class ke injectable banay (Dependency Injection er jonno)
- NestJS automatically instance create kore aar manage kore
- Singleton pattern - ekta instance sab jaygay share hoy

**Without Injectable:**
```typescript
// Manually instance create korte hoto
const userService = new UserService();
const postService = new PostService(userService);
```

**With Injectable:**
```typescript
@Injectable()
export class PostService {
  constructor(
    private userService: UserService  // Auto inject!
  ) {}
}
```

---

#### **3. `@Module()`**

```typescript
@Module({
  imports: [MongooseModule],      // Other modules
  controllers: [UserController],  // HTTP controllers
  providers: [UserService],       // Services, guards, etc
  exports: [UserService],         // Export to other modules
})
export class UserModule {}
```

**Ki kore:**
- Feature module define kore
- Dependencies manage kore
- Encapsulation - module er internal implementation hide

**Real Example:**

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // Other modules e use korte parbe
})
export class UserModule {}
```

---

#### **4. `@Schema()` - Mongoose Schema**

```typescript
@Schema({ timestamps: true })  // createdAt, updatedAt auto add
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: 'INACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  status: string;

  @Prop({ type: [{ type: ObjectId, ref: 'Post' }] })
  posts: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**Ki kore:**
- Mongoose schema TypeScript e define kore
- Database collection structure set kore
- Validation, defaults, relationships define

**Old Way (JavaScript):**
```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  status: {
    type: String,
    default: 'INACTIVE',
    enum: ['ACTIVE', 'INACTIVE']
  }
});
```

**Benefits:**
- Type safety - autocomplete pawa jay
- Decorators clean aar readable
- TypeScript interface automatically generate

---

### 📌 Method Decorators

#### **1. HTTP Method Decorators**

```typescript
@Controller('posts')
export class PostController {
  @Get()                    // GET /posts
  findAll() {}

  @Get(':id')              // GET /posts/123
  findOne(@Param('id') id: string) {}

  @Post()                  // POST /posts
  create(@Body() dto: CreatePostDto) {}

  @Patch(':id')           // PATCH /posts/123
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {}

  @Delete(':id')          // DELETE /posts/123
  remove(@Param('id') id: string) {}
}
```

**Available Methods:**
- `@Get()` - Read data
- `@Post()` - Create new data
- `@Put()` - Replace entire resource
- `@Patch()` - Update partial data
- `@Delete()` - Remove data

---

#### **2. `@UseGuards()` - Route Protection**

```typescript
@Controller('user')
export class UserController {
  // Public route - keu access korte parbe
  @Get('all')
  getAllUsers() {}

  // Protected route - sudhu logged in users
  @Get('profile')
  @UseGuards(JwtAuthGuard)  // <-- Guard apply
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // Multiple guards
  @Post('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminOnly() {}
}
```

**Ki kore:**
- Route access control
- Authentication/Authorization check
- Guard false return korle 403 Forbidden

**How Guard Works:**

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Request er Authorization header check
    // JWT token verify
    // Valid hole true, invalid hole false/exception
    return super.canActivate(context);
  }
}
```

---

#### **3. `@HttpCode()` - Custom Status Code**

```typescript
@Post('logout')
@HttpCode(204)  // No Content
logout() {
  // Return nothing
}

@Post('login')
@HttpCode(200)  // Default 201 change kore 200
login() {}
```

**Default Status Codes:**
- `@Get()` → 200 OK
- `@Post()` → 201 Created
- `@Patch()` → 200 OK
- `@Delete()` → 200 OK

---

### 📌 Parameter Decorators

Request theke data extract korar jonno:

```typescript
@Controller('posts')
export class PostController {
  @Get(':id')
  findOne(
    @Param('id') id: string,              // URL parameter
    @Query('include') include?: string,   // Query string
  ) {
    // GET /posts/123?include=comments
    // id = '123'
    // include = 'comments'
  }

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,  // Request body
    @CurrentUser() user: User,             // Custom decorator
  ) {
    // Body: { title: "Hello", body: "World" }
    // User: { id: 'abc', email: 'user@mail.com' }
  }

  @Post('upload')
  upload(
    @Headers('authorization') auth: string,  // Header
    @Req() request: Request,                 // Full request object
    @Res() response: Response,               // Full response object
  ) {}
}
```

**All Parameter Decorators:**
- `@Body()` - Entire request body
- `@Body('field')` - Specific field
- `@Param('id')` - URL parameter
- `@Query('search')` - Query string
- `@Headers('key')` - Request header
- `@Req()` - Express Request object
- `@Res()` - Express Response object
- `@CurrentUser()` - Custom (authenticated user)

---

### 📌 Property Decorators (Validation)

DTO te use hoy - auto validation er jonno:

```typescript
export class CreateUserDto {
  // Email validation
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // Password validation
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password cannot exceed 20 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain letters and numbers'
  })
  password: string;

  // Optional field
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bio?: string;

  // Enum validation
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: string;

  // Number validation
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  // Array validation
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  tags: string[];

  // Nested object validation
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

**Common Validators:**

**Type Checking:**
- `@IsString()` - String type
- `@IsNumber()` - Number type
- `@IsBoolean()` - Boolean type
- `@IsArray()` - Array type
- `@IsObject()` - Object type
- `@IsDate()` - Date type

**String Validators:**
- `@IsEmail()` - Valid email
- `@IsUrl()` - Valid URL
- `@MinLength(n)` - Min characters
- `@MaxLength(n)` - Max characters
- `@Matches(regex)` - Regex pattern
- `@IsAlphanumeric()` - Only letters & numbers

**Number Validators:**
- `@Min(n)` - Minimum value
- `@Max(n)` - Maximum value
- `@IsPositive()` - Positive number
- `@IsNegative()` - Negative number

**Conditional:**
- `@IsOptional()` - Field optional
- `@IsNotEmpty()` - Cannot be empty
- `@IsEnum([...])` - Must be one of values

**How Validation Works:**

```typescript
// Client sends
{
  "email": "invalid-email",
  "password": "123"
}

// ValidationPipe automatically checks
// Returns error:
{
  "statusCode": 400,
  "message": [
    "Invalid email format",
    "Password must be at least 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 4. Request-Response Flow

### 🔄 Complete Flow Diagram

```
┌─────────────┐
│   CLIENT    │
│ (Frontend)  │
└──────┬──────┘
       │
       │ HTTP Request
       │ POST /auth/login
       │ Body: { email, password }
       ↓
┌──────────────────────────────────────┐
│         NestJS Application           │
│                                      │
│  ┌────────────────────────────┐     │
│  │  1. MIDDLEWARE             │     │
│  │  - CORS check              │     │
│  │  - Body parser             │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  2. VALIDATION PIPE        │     │
│  │  - Check DTO decorators    │     │
│  │  - Validate email, password│     │
│  │  - Transform types         │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  3. GUARD (if exists)      │     │
│  │  - Check authentication    │     │
│  │  - Verify JWT token        │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  4. CONTROLLER             │     │
│  │  @Post('login')            │     │
│  │  login(@Body() dto) {      │     │
│  │    return service.login()  │     │
│  │  }                         │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  5. SERVICE                │     │
│  │  - Find user by email      │     │
│  │  - Compare password        │     │
│  │  - Generate JWT token      │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  6. DATABASE               │     │
│  │  - MongoDB query           │     │
│  │  - Return user data        │     │
│  └────────┬───────────────────┘     │
│           │                          │
│           ↓                          │
│  ┌────────────────────────────┐     │
│  │  7. INTERCEPTOR (optional) │     │
│  │  - Transform response      │     │
│  │  - Add extra fields        │     │
│  └────────┬───────────────────┘     │
│           │                          │
└───────────┼──────────────────────────┘
            │
            │ HTTP Response
            │ { user, token }
            ↓
     ┌─────────────┐
     │   CLIENT    │
     └─────────────┘
```

### 📝 Real Example - Login Flow

#### **Step 1: Client Request**

```javascript
// Frontend code
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

---

#### **Step 2: DTO Validation**

```typescript
// login.dto.ts
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// ValidationPipe automatically:
// 1. Check if email is valid email format
// 2. Check if email is not empty
// 3. Check if password is string
// 4. Check if password length >= 6
// If fail → throw 400 Bad Request
```

---

#### **Step 3: Controller Receives**

```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    // loginDto already validated!
    // Just call service
    const result = await this.authService.login(loginDto);

    return {
      message: 'Login successful',
      ...result
    };
  }
}
```

---

#### **Step 4: Service Logic**

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const user = await this.userModel.findOne({
      email: loginDto.email
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT token
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    // 4. Return user data (without password)
    const { password, ...userData } = user.toObject();

    return {
      user: userData,
      token,
    };
  }
}
```

---

#### **Step 5: Response to Client**

```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "photo": "https://...",
    "friends": [...]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔒 Protected Route Flow

```
Client Request
     ↓
JWT Guard checks Authorization header
     ↓
   Valid?
   ├─ No → 401 Unauthorized
   └─ Yes → Extract user from token
         ↓
     Controller receives @CurrentUser()
         ↓
     Service executes
         ↓
     Response
```

**Example:**

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user: User) {
  // Guard already verified token
  // User automatically injected
  return user;
}
```

**How JWT Guard Works:**

```typescript
// 1. Client sends request with token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 2. JwtStrategy extracts and verifies
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: any) {
    // payload = decoded token data
    const user = await this.userModel.findById(payload._id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;  // Attached to request.user
  }
}

// 3. Controller receives validated user
@CurrentUser() user: User  // This is request.user
```

---

## 5. Dependency Injection

### 💉 Dependency Injection Ki?

**Traditional Way (Manual):**

```typescript
// Service A needs Service B
class UserService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();  // Manually create
  }
}

// Problem:
// - Tightly coupled
// - Hard to test (can't mock EmailService)
// - If EmailService needs dependencies, complicated
```

**With Dependency Injection:**

```typescript
@Injectable()
class UserService {
  constructor(
    private emailService: EmailService  // Auto injected by NestJS
  ) {}
}

// Benefits:
// - Loosely coupled
// - Easy to test (can inject mock)
// - NestJS manages lifecycle
```

---

### 🔧 How It Works

```typescript
// 1. Mark class as Injectable
@Injectable()
export class EmailService {
  send(to: string, subject: string) {
    // Send email logic
  }
}

// 2. Register in module
@Module({
  providers: [EmailService],  // Tell NestJS this is available
  exports: [EmailService],    // Other modules can use
})
export class EmailModule {}

// 3. Inject where needed
@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService  // NestJS auto injects
  ) {}

  async register(user: User) {
    await user.save();
    // Use injected service
    this.emailService.send(user.email, 'Welcome!');
  }
}
```

---

### 🎯 Real Example - Multiple Dependencies

```typescript
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,  // Mongoose model

    private userService: UserService,        // Custom service

    private configService: ConfigService,    // Config service

    private eventEmitter: EventEmitter2,     // Event emitter
  ) {}

  async create(createPostDto: CreatePostDto) {
    // Use all injected dependencies
    const user = await this.userService.findById(createPostDto.userId);

    const post = new this.postModel({
      ...createPostDto,
      maxSize: this.configService.get('POST_MAX_SIZE'),
    });

    await post.save();

    this.eventEmitter.emit('post.created', post);

    return post;
  }
}
```

**Module Configuration:**

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UserModule,      // Provides UserService
    ConfigModule,    // Provides ConfigService
    EventEmitterModule,
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
```

---

### 🧪 Testing with DI

```typescript
describe('PostService', () => {
  let service: PostService;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    // Create mock
    mockUserService = {
      findById: jest.fn().mockResolvedValue({ id: '123', name: 'John' })
    };

    // Create testing module with mock
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: UserService, useValue: mockUserService },  // Inject mock
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should create post', async () => {
    // Test with mocked dependency
    const result = await service.create({...});
    expect(mockUserService.findById).toHaveBeenCalled();
  });
});
```

---

## 6. Authentication System

### 🔐 JWT Authentication Flow

```
Registration Flow:
Client → Register → Hash Password → Save to DB → Generate Token → Return

Login Flow:
Client → Login → Find User → Verify Password → Generate Token → Return

Protected Request:
Client → Send Token → Verify Token → Extract User → Execute → Response
```

---

### 📝 Complete Implementation

#### **Step 1: Auth Module Setup**

```typescript
// auth.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',  // Should be in .env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

---

#### **Step 2: JWT Strategy**

```typescript
// strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Payload = decoded JWT data
    // { _id: '...', email: '...', iat: ..., exp: ... }

    const user = await this.userModel.findById(payload._id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // This will be available as @CurrentUser()
    return user;
  }
}
```

**Kivabe kaj kore:**
1. Client request e `Authorization: Bearer <token>` pathay
2. Strategy token extract kore aar verify kore
3. Token valid hole payload decode kore
4. `validate()` method call hoye user data ber kore
5. User `request.user` te attach hoye jay

---

#### **Step 3: JWT Guard**

```typescript
// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Strategy automatically validate korbe
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
```

---

#### **Step 4: Custom User Decorator**

```typescript
// decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;  // JWT Strategy e set kora user
  },
);
```

**Usage:**

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: User) {
  // user = authenticated user from JWT
  return user;
}
```

---

#### **Step 5: Password Hashing**

```typescript
// auth.service.ts
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    // 1. Check if user exists
    const exists = await this.userModel.findOne({
      email: registerDto.email
    });

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      saltRounds
    );

    // 3. Create user with hashed password
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    await user.save();

    // 4. Don't return password
    const { password, ...result } = user.toObject();
    return result;
  }

  async login(loginDto: LoginDto) {
    // 1. Find user
    const user = await this.userModel.findOne({
      email: loginDto.email
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT
    const payload = {
      _id: user._id,
      email: user.email
    };

    const token = this.jwtService.sign(payload);

    // 4. Return user + token
    const { password, ...userData } = user.toObject();

    return {
      user: userData,
      token,
    };
  }
}
```

---

### 🛡️ Using Guards

```typescript
// Public route - anyone can access
@Get('posts')
getAllPosts() {}

// Protected route - logged in users only
@Get('my-posts')
@UseGuards(JwtAuthGuard)
getMyPosts(@CurrentUser() user: User) {
  return this.postService.findByUser(user._id);
}

// Admin only
@Delete(':id')
@UseGuards(JwtAuthGuard, AdminGuard)
deletePost(@Param('id') id: string) {}

// Optional authentication
@Get('post/:id')
@UseGuards(OptionalJwtAuthGuard)
getPost(
  @Param('id') id: string,
  @CurrentUser() user?: User  // May or may not exist
) {
  // If logged in, show private posts too
  // If not, show only public
}
```

---

## 7. Database Integration

### 🗄️ MongoDB + Mongoose Setup

#### **Database Module**

```typescript
// database.module.ts
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        // Additional options
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

**.env file:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adda-db
```

---

### 📊 Schema Definition

```typescript
// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,  // createdAt, updatedAt auto add
  collection: 'users',  // Collection name
})
export class User {
  // Simple field
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  // With validation
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
  })
  username: string;

  // Enum
  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'INACTIVE',
  })
  status: string;

  // Number with min/max
  @Prop({
    type: Number,
    min: 0,
    max: 150,
  })
  age: number;

  // Array of strings
  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  // Reference to another model (One-to-Many)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Post'
  })
  featuredPost: MongooseSchema.Types.ObjectId;

  // Array of references (Many-to-Many)
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }]
  })
  friends: MongooseSchema.Types.ObjectId[];

  // Nested object
  @Prop({
    type: {
      street: String,
      city: String,
      country: String,
    }
  })
  address: {
    street: string;
    city: string;
    country: string;
  };

  // Virtual field (not stored in DB)
  fullName: string;
}

// Create schema
export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Add index
UserSchema.index({ email: 1, username: 1 });

// Add method
UserSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};
```

---

### 🔗 Relationships

#### **One-to-Many: Post → Comments**

```typescript
// post.schema.ts
@Schema()
export class Post {
  @Prop()
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: MongooseSchema.Types.ObjectId;
}

// comment.schema.ts
@Schema()
export class Comment {
  @Prop()
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  post: MongooseSchema.Types.ObjectId;
}

// Service
async getPostWithComments(postId: string) {
  return this.postModel
    .findById(postId)
    .populate({
      path: 'author',
      select: 'username email photo',  // Only these fields
    });
}

async getCommentsForPost(postId: string) {
  return this.commentModel
    .find({ post: postId })
    .populate('user', 'username photo');
}
```

---

#### **Many-to-Many: User ↔ Friends**

```typescript
@Schema()
export class User {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  friends: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  friendRequests: MongooseSchema.Types.ObjectId[];
}

// Service
async sendFriendRequest(userId: string, friendId: string) {
  const user = await this.userModel.findById(userId);
  const friend = await this.userModel.findById(friendId);

  // Add to arrays
  user.sentRequests.push(friendId as any);
  friend.friendRequests.push(userId as any);

  await user.save();
  await friend.save();

  // Return populated
  return this.userModel
    .findById(userId)
    .populate('friends', 'username photo')
    .populate('friendRequests', 'username photo');
}
```

---

### 🔍 Query Examples

```typescript
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  // Find all
  async findAll() {
    return this.postModel.find();
  }

  // Find with conditions
  async findPublicPosts() {
    return this.postModel.find({
      visibility: 'PUBLIC',
      status: 'ACTIVE',
    });
  }

  // Find one
  async findById(id: string) {
    return this.postModel.findById(id);
  }

  // Find with populate
  async findWithAuthor(id: string) {
    return this.postModel
      .findById(id)
      .populate('author', 'username email photo')
      .populate('likes', 'username photo');
  }

  // Find with sorting
  async findLatest(limit: number = 10) {
    return this.postModel
      .find()
      .sort({ createdAt: -1 })  // Descending
      .limit(limit);
  }

  // Find with pagination
  async findPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('author'),
      this.postModel.countDocuments(),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Search
  async search(query: string) {
    return this.postModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  // Case insensitive
        { body: { $regex: query, $options: 'i' } },
      ],
    });
  }

  // Create
  async create(createPostDto: CreatePostDto) {
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  // Update
  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(
      id,
      { $set: updatePostDto },
      { new: true }  // Return updated document
    );
  }

  // Add to array
  async addLike(postId: string, userId: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },  // Add if not exists
      { new: true }
    );
  }

  // Remove from array
  async removeLike(postId: string, userId: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  // Delete
  async remove(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }

  // Aggregation
  async getPostStats() {
    return this.postModel.aggregate([
      {
        $group: {
          _id: '$author',
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: '$likes' } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
    ]);
  }
}
```

---

## 8. Validation System

### ✅ DTO Validation Deep Dive

#### **Basic Validation**

```typescript
export class CreateUserDto {
  // Required string
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  // Email
  @IsEmail({}, { message: 'Please provide valid email' })
  email: string;

  // Number with range
  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;

  // Boolean
  @IsBoolean()
  isActive: boolean;
}
```

---

#### **Advanced Validation**

```typescript
export class RegisterDto {
  // Custom regex
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscore'
  })
  @Length(3, 20)
  username: string;

  // Password strength
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain letters, numbers and special characters'
  })
  password: string;

  // Confirm password match
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  confirmPassword: string;

  // Array validation
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one interest required' })
  @ArrayMaxSize(5, { message: 'Maximum 5 interests allowed' })
  @IsString({ each: true })  // Each item must be string
  interests: string[];

  // Enum
  @IsEnum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Gender must be MALE, FEMALE or OTHER'
  })
  gender: string;

  // Date validation
  @IsDate()
  @Type(() => Date)  // Transform string to Date
  dateOfBirth: Date;

  // Conditional validation
  @ValidateIf(o => o.age < 18)  // Only if age < 18
  @IsNotEmpty()
  parentEmail: string;

  // Nested object
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

// Nested DTO
class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  @Length(4, 6)
  postalCode: string;
}
```

---

#### **Custom Validators**

```typescript
// Custom decorator
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Custom validation logic
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[@$!%*?&]/.test(value);
          const isLongEnough = value.length >= 8;

          return hasUpperCase && hasLowerCase && hasNumber &&
                 hasSpecialChar && isLongEnough;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must contain uppercase, lowercase, number, special character and be at least 8 characters';
        }
      }
    });
  };
}

// Usage
export class RegisterDto {
  @IsStrongPassword()
  password: string;
}
```

---

#### **Validation Groups**

```typescript
export class UpdateUserDto {
  @IsString({ groups: ['admin'] })  // Only admin can update
  role: string;

  @IsString({ groups: ['user', 'admin'] })  // Both can update
  bio: string;
}

// In controller
@Patch('profile')
update(
  @Body(new ValidationPipe({ groups: ['user'] }))
  updateDto: UpdateUserDto
) {}

@Patch('admin/:id')
adminUpdate(
  @Body(new ValidationPipe({ groups: ['admin'] }))
  updateDto: UpdateUserDto
) {}
```

---

### 🔧 Validation Pipe Configuration

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Remove non-DTO fields
    forbidNonWhitelisted: true,   // Throw error if extra fields
    transform: true,              // Auto transform types
    transformOptions: {
      enableImplicitConversion: true,  // '123' → 123
    },
    validationError: {
      target: false,              // Don't include target object
      value: false,               // Don't include validated value
    },
    exceptionFactory: (errors) => {
      // Custom error format
      const messages = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints),
      }));

      return new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    },
  }),
);
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["email must be an email"]
    },
    {
      "field": "password",
      "errors": ["password must be longer than 6 characters"]
    }
  ]
}
```

---

## 9. Common Patterns

### 🎯 Repository Pattern

```typescript
// user.repository.ts
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }
}

// Service uses repository
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUser(id: string) {
    return this.userRepository.findById(id);
  }
}
```

**Benefits:**
- Database queries centralized
- Easy to change database
- Reusable across services

---

### 🎯 Exception Filters

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Custom error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    });
  }
}

// Apply globally
app.useGlobalFilters(new HttpExceptionFilter());
```

---

### 🎯 Interceptors

```typescript
// logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`Before: ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`After: ${Date.now() - now}ms`);
      }),
    );
  }
}

// Transform response
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

---

## 10. Best Practices

### ✅ Do's

1. **Always use DTOs for validation**
```typescript
// ✅ Good
@Post()
create(@Body() createUserDto: CreateUserDto) {}

// ❌ Bad
@Post()
create(@Body() body: any) {}
```

2. **Separate business logic from controllers**
```typescript
// ✅ Good
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}

// ❌ Bad
@Controller()
export class UserController {
  @Get()
  async findAll() {
    const users = await User.find();  // Logic in controller
    return users;
  }
}
```

3. **Use environment variables**
```typescript
// ✅ Good
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
})

// ❌ Bad
JwtModule.register({
  secret: 'hardcoded-secret',  // Don't do this!
})
```

4. **Handle errors properly**
```typescript
// ✅ Good
async findUser(id: string) {
  const user = await this.userModel.findById(id);

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
}

// ❌ Bad
async findUser(id: string) {
  return this.userModel.findById(id);  // Might return null
}
```

5. **Use TypeScript types properly**
```typescript
// ✅ Good
async findUser(id: string): Promise<User> {
  return this.userModel.findById(id);
}

// ❌ Bad
async findUser(id): Promise<any> {
  return this.userModel.findById(id);
}
```

---

### ❌ Don'ts

1. **Don't put logic in DTOs**
```typescript
// ❌ Bad
export class CreateUserDto {
  email: string;

  async save() {  // No!
    // ...
  }
}

// ✅ Good - DTOs are just data structures
export class CreateUserDto {
  @IsEmail()
  email: string;
}
```

2. **Don't use `@Res()` unless necessary**
```typescript
// ❌ Bad
@Get()
findAll(@Res() res: Response) {
  res.json({ data: [] });  // Manual response
}

// ✅ Good
@Get()
findAll() {
  return { data: [] };  // Auto JSON response
}
```

3. **Don't forget error handling**
```typescript
// ❌ Bad
async createPost(userId: string, dto: CreatePostDto) {
  const user = await this.userModel.findById(userId);
  user.posts.push(post);  // user might be null!
}

// ✅ Good
async createPost(userId: string, dto: CreatePostDto) {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.posts.push(post);
}
```

---

## 📚 Summary

**NestJS Core Concepts:**
1. **Modules** - Feature organization
2. **Controllers** - HTTP request handling
3. **Services** - Business logic
4. **DTOs** - Data validation
5. **Guards** - Authentication/Authorization
6. **Decorators** - Metadata & behavior
7. **Dependency Injection** - Auto instance management
8. **Pipes** - Data transformation & validation

**Key Benefits:**
- ✅ Type safety with TypeScript
- ✅ Auto validation
- ✅ Organized code structure
- ✅ Easy testing
- ✅ Scalable architecture
- ✅ Enterprise ready

---

Ami asha kori ekhon tumi NestJS er sob basic theke advanced concepts bujhte parchho! Kono specific topic niye aro details jante chaile bolo. 🚀
