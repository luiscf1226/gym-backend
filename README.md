# Gym App Backend

A robust NestJS backend application for managing gym memberships, workouts, and user profiles.

## Features

- 🔐 Authentication with JWT and Refresh Tokens
- 👤 User Profile Management
- 💳 Subscription Management
- 🏋️‍♂️ Workout Tracking
- 🤖 AI-Powered Features
- 📊 Analytics and Reporting
- 🔒 Role-Based Access Control
- 📱 Mobile-First API Design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gym-app.git
cd gym-app/backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
# Application
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_POOL_MODE=session

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=7d

# Logging
LOG_LEVEL=debug
```

## Running the Application

### Development Mode
```bash
npm run start:dev
# or
yarn start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/docs
```

## Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication module
│   ├── users/          # User management module
│   └── health/         # Health check module
├── common/             # Shared utilities and constants
├── config/            # Configuration files
└── main.ts            # Application entry point
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Application port | No | 3000 |
| NODE_ENV | Environment (development/production) | No | development |
| DB_HOST | Database host | Yes | - |
| DB_PORT | Database port | No | 5432 |
| DB_NAME | Database name | Yes | - |
| DB_USER | Database user | Yes | - |
| DB_PASSWORD | Database password | Yes | - |
| DB_POOL_MODE | Database connection pool mode | No | session |
| JWT_SECRET | Secret for JWT token generation | Yes | - |
| JWT_EXPIRATION | JWT token expiration time | No | 15m |
| REFRESH_TOKEN_SECRET | Secret for refresh token generation | Yes | - |
| REFRESH_TOKEN_EXPIRATION | Refresh token expiration time | No | 7d |
| LOG_LEVEL | Logging level | No | debug |

## Development Guidelines

### Code Style
- Follow the NestJS style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive tests

### Git Workflow
1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Submit a pull request

### Testing
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Security Considerations

- All endpoints are rate-limited
- JWT tokens are short-lived
- Refresh tokens are rotated
- Passwords are hashed using bcrypt
- Input validation using class-validator
- CORS enabled with proper configuration

## Performance Optimization

- Database connection pooling
- Query optimization
- Caching where appropriate
- Async/await for non-blocking operations

## Monitoring and Logging

- Winston logger for structured logging
- Daily rotating log files
- Health check endpoint
- Performance metrics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
