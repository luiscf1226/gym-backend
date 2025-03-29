# Gym App Backend

A NestJS-based backend application for the Gym App, featuring Supabase integration, Swagger documentation, and comprehensive logging.

## Features

- NestJS framework with TypeScript
- Supabase database integration
- Swagger API documentation
- Winston logging with daily rotation
- Docker support
- Clean Architecture principles
- Environment-based configuration

## Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- Supabase account and credentials

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   LOG_LEVEL=debug
   ```

## Development

### Running locally

```bash
npm run start:dev
```

### Running with Docker

```bash
docker-compose up
```

## API Documentation

Once the application is running:
- API endpoints are available at: `http://localhost:3000/api/v1`
- Swagger documentation is available at: `http://localhost:3000/docs`

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Logging

Logs are stored in the `logs` directory with daily rotation. Each log file contains:
- Timestamp
- Log level
- Message
- Additional metadata (when available)

## License

UNLICENSED
