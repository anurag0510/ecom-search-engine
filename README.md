# ecom-search-engine

E-commerce search engine with REST API for product search and filtering.

## Features

- 🔍 **Elasticsearch Integration**: Fast, relevant product search with fuzzy matching
- 📊 **Full-Text Search**: Search across product names and descriptions
- 🔄 **Automatic Fallback**: Falls back to in-memory search if Elasticsearch is unavailable
- 🏷️ Category-based filtering
- 💰 Price range filtering
- 📄 Pagination support
- 🏥 Health check endpoint
- 📚 Interactive Swagger/OpenAPI documentation
- 📝 Comprehensive logging with Winston
- ✅ Comprehensive test coverage
- 🎯 OOP Architecture with dependency injection

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- **Elasticsearch** (optional but recommended for production search)
  - Running on `http://localhost:9200` by default
  - See [ELASTICSEARCH.md](ELASTICSEARCH.md) for setup instructions

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env to configure logging, Elasticsearch, and other settings
```

### Elasticsearch Setup (Recommended)

For production-quality search with fuzzy matching and relevance scoring:

```bash
# 1. Start Elasticsearch (using Docker)
docker run -d --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0

# 2. Initialize the product index and load sample data
npm run es:init

# 3. Start the application
npm run dev
```

See [ELASTICSEARCH.md](ELASTICSEARCH.md) for detailed Elasticsearch integration documentation.

**Note:** The application will work without Elasticsearch by falling back to in-memory search.

### Configuration

Configure the application by editing the `.env` file:

```bash
# Server
PORT=3000

# Logging level: error, warn, info, http, debug
LOG_LEVEL=debug

# Elasticsearch (optional)
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_INDEX=products
```

See [CONFIGURATION.md](CONFIGURATION.md) for detailed configuration options.
See [ELASTICSEARCH.md](ELASTICSEARCH.md) for Elasticsearch-specific configuration.

### Running the Application

```bash
# Development mode (default log level from .env)
npm run dev

# Development with specific log levels
npm run dev:debug   # All logs
npm run dev:info    # Info and above
npm run dev:warn    # Warnings and errors only
npm run dev:error   # Errors only

# Initialize Elasticsearch (run once or after clearing index)
npm run es:init

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### Interactive Swagger UI

Visit `http://localhost:3000/api-docs` to access the interactive Swagger UI documentation where you can:
- Browse all available endpoints
- View request/response schemas
- Test API endpoints directly from the browser
- Download the OpenAPI specification

### Detailed Documentation

See [API.md](./API.md) for detailed API documentation.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Quick Example

```bash
# Search for products
curl "http://localhost:3000/api/search?query=headphones"

# Get product by ID
curl "http://localhost:3000/api/products/1"

# Get all categories
curl "http://localhost:3000/api/categories"
```

## Project Structure

```
ecom-search-engine/
├── src/
│   ├── config/
│   │   └── logger.js    # Winston logger configuration
│   ├── middleware/
│   │   └── logging.js   # Logging middleware
│   ├── app.js           # Express app configuration and routes
│   ├── swagger.js       # Swagger/OpenAPI configuration
│   └── index.js         # Application entry point
├── tests/
│   └── api.test.js      # API endpoint tests
├── logs/                # Application logs (gitignored)
├── config/              # Configuration files
├── API.md               # API documentation
├── LOGGING.md           # Logging guide
└── package.json         # Project dependencies and scripts
```

## Technologies Used

- **Express** - Web framework
- **Winston** - Logging library with daily rotation
- **Swagger UI Express** - Interactive API documentation
- **Swagger JSDoc** - Generate OpenAPI specs from JSDoc comments
- **Jest** - Testing framework
- **Supertest** - HTTP testing library
- **Joi** - Data validation
- **Elasticsearch** - Search engine (future integration)

## Logging

This project includes comprehensive logging with Winston:
- 📝 Multiple log levels (error, warn, info, http, debug)
- 🔄 Daily log rotation with compression
- 📁 Separate error and combined logs
- 🎨 Colored console output in development
- 📊 Structured logging with metadata

For detailed logging documentation, see [LOGGING.md](LOGGING.md).

### Quick Log Examples

```javascript
// Info with context
logger.info('Order placed', { orderId: 123, userId: 456 });

// Error with stack trace
logger.logError(error, { context: 'Payment processing' });

// Debug message
logger.debug('Cache hit', { key: 'product:123' });
```

### Viewing Logs

```bash
# View all logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# View errors only
tail -f logs/error-$(date +%Y-%m-%d).log
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- How to report bugs
- How to suggest features
- Development setup
- Code style guidelines
- Pull request process

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.


A modern e-commerce search engine built with Node.js.

## Features

- Fast and efficient product search
- RESTful API
- Modern ES6+ JavaScript

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Usage

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## Project Structure

```
ecom-search-engine/
├── src/
│   └── index.js        # Application entry point
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── eslint.config.js    # ESLint configuration
├── .prettierrc         # Prettier configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## Configuration

Create a `.env` file in the root directory based on `.env.example` and configure your environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

E-commerce search engine built with Node.js

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Update the environment variables as needed

```bash
cp .env.example .env
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Testing

```bash
npm test
```

## Project Structure

```
├── src/            # Source code
├── tests/          # Test files
├── config/         # Configuration files
├── .env.example    # Environment variables template
└── package.json    # Project dependencies
```

## License

ISC
