/**
 * E-commerce Search Engine - Express Application
 * 
 * Copyright 2025
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.js';
import { requestLogger, errorLogger, logger } from './middleware/logging.js';

const app = express();

// Request logging middleware (before other middleware)
app.use(requestLogger);

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce Search API Docs'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  logger.debug('Health check requested');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ecom-search-engine'
  });
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for products
 *     description: Search products with optional filters for category and price range
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to find products
 *         example: headphones
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category
 *         example: Electronics
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 50
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 200
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Bad request - query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/search', (req, res) => {
  const { query, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  if (!query) {
    logger.warn('Search attempted without query parameter', { ip: req.ip });
    return res.status(400).json({
      error: 'Search query is required'
    });
  }

  logger.info('Product search initiated', { query, category, minPrice, maxPrice, page, limit });

  // Dummy search results
  const dummyProducts = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 79.99,
      description: 'High-quality wireless headphones with noise cancellation',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      category: 'Electronics',
      price: 199.99,
      description: 'Feature-rich smartwatch with health tracking',
      inStock: true
    },
    {
      id: 3,
      name: 'Running Shoes',
      category: 'Sports',
      price: 89.99,
      description: 'Comfortable running shoes for all terrains',
      inStock: false
    }
  ];

  // Filter results based on query and filters
  let results = dummyProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  if (category) {
    results = results.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    results = results.filter(product => product.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    results = results.filter(product => product.price <= parseFloat(maxPrice));
  }

  logger.debug('Search completed', { query, resultCount: results.length });

  res.status(200).json({
    query,
    filters: { category, minPrice, maxPrice },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: results.length
    },
    results
  });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve detailed information about a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  logger.debug('Product details requested', { productId: id });

  const dummyProducts = {
    '1': {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 79.99,
      description: 'High-quality wireless headphones with noise cancellation',
      inStock: true,
      ratings: 4.5,
      reviews: 120
    },
    '2': {
      id: 2,
      name: 'Smart Watch',
      category: 'Electronics',
      price: 199.99,
      description: 'Feature-rich smartwatch with health tracking',
      inStock: true,
      ratings: 4.7,
      reviews: 85
    }
  };

  const product = dummyProducts[id];

  if (!product) {
    logger.warn('Product not found', { productId: id, ip: req.ip });
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  logger.debug('Product details retrieved', { productId: id, productName: product.name });
  res.status(200).json(product);
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all available product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
app.get('/api/categories', (req, res) => {
  logger.debug('Categories list requested');
  
  const categories = [
    { id: 1, name: 'Electronics', count: 150 },
    { id: 2, name: 'Sports', count: 80 },
    { id: 3, name: 'Clothing', count: 200 },
    { id: 4, name: 'Books', count: 120 },
    { id: 5, name: 'Home & Garden', count: 95 }
  ];

  res.status(200).json({
    categories
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('404 - Endpoint not found', { 
    method: req.method, 
    url: req.originalUrl, 
    ip: req.ip 
  });
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Error logging middleware
app.use(errorLogger);

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(500).json({
    error: 'Internal server error'
  });
});

export default app;
