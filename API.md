# E-commerce Search Engine API

A simple REST API for e-commerce search functionality.

## 📚 Interactive Documentation

For an interactive API experience, visit the **Swagger UI** at:
```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- 🔍 Browse all endpoints with detailed descriptions
- 🎯 Try out API calls directly from your browser
- 📋 View request/response schemas and examples
- 📥 Download OpenAPI specification

## Available Endpoints

### Health Check
```
GET /health
```
Returns the health status of the service.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-01T12:00:00.000Z",
  "service": "ecom-search-engine"
}
```

### Search Products
```
GET /api/search?query={search_term}&category={category}&minPrice={min}&maxPrice={max}&page={page}&limit={limit}
```

Search for products with optional filters.

**Query Parameters:**
- `query` (required): Search term
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of results per page

**Example:**
```
GET /api/search?query=headphones&category=Electronics&maxPrice=100
```

**Response:**
```json
{
  "query": "headphones",
  "filters": {
    "category": "Electronics",
    "minPrice": null,
    "maxPrice": "100"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  },
  "results": [
    {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "category": "Electronics",
      "price": 79.99,
      "description": "High-quality wireless headphones with noise cancellation",
      "inStock": true
    }
  ]
}
```

### Get Product by ID
```
GET /api/products/:id
```

Get detailed information about a specific product.

**Example:**
```
GET /api/products/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Wireless Bluetooth Headphones",
  "category": "Electronics",
  "price": 79.99,
  "description": "High-quality wireless headphones with noise cancellation",
  "inStock": true,
  "ratings": 4.5,
  "reviews": 120
}
```

### Get Categories
```
GET /api/categories
```

Get a list of all available product categories.

**Response:**
```json
{
  "categories": [
    { "id": 1, "name": "Electronics", "count": 150 },
    { "id": 2, "name": "Sports", "count": 80 },
    { "id": 3, "name": "Clothing", "count": 200 },
    { "id": 4, "name": "Books", "count": 120 },
    { "id": 5, "name": "Home & Garden", "count": 95 }
  ]
}
```

## Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Search query is required"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) file for details.
