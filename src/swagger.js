/**
 * Swagger/OpenAPI Configuration
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce Search Engine API',
    version: '1.0.0',
    description: 'A scalable e-commerce product search engine with Elasticsearch integration',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
    contact: {
      name: 'API Support',
      url: 'https://github.com/yourusername/ecom-search-engine',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.yourproduction.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Products',
      description: 'Product search and retrieval operations',
    },
    {
      name: 'Categories',
      description: 'Product category operations',
    },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['asin', 'title', 'price', 'category_id'],
        properties: {
          asin: {
            type: 'string',
            description: 'Amazon Standard Identification Number',
            example: 'B014TMV5YE',
          },
          title: {
            type: 'string',
            description: 'Product title/name',
            example: 'Sion Softside Expandable Roller Luggage, Black, Checked-Large 29-Inch',
          },
          imgUrl: {
            type: 'string',
            format: 'uri',
            description: 'Product image URL',
            example: 'https://m.media-amazon.com/images/I/815dLQKYIYL._AC_UL320_.jpg',
          },
          productURL: {
            type: 'string',
            format: 'uri',
            description: 'Product page URL',
            example: 'https://www.amazon.com/dp/B014TMV5YE',
          },
          stars: {
            type: 'number',
            format: 'float',
            description: 'Average star rating (0-5)',
            example: 4.5,
            minimum: 0,
            maximum: 5,
          },
          reviews: {
            type: 'integer',
            description: 'Number of customer reviews',
            example: 1234,
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Current product price in USD',
            example: 139.99,
          },
          listPrice: {
            type: 'number',
            format: 'float',
            description: 'Original/list price in USD',
            example: 179.99,
          },
          category_id: {
            type: 'integer',
            description: 'Product category identifier',
            example: 104,
          },
          isBestSeller: {
            type: 'boolean',
            description: 'Whether product is a best seller',
            example: true,
          },
          boughtInLastMonth: {
            type: 'integer',
            description: 'Number of units bought in the last month',
            example: 2000,
          },
          _score: {
            type: 'number',
            format: 'float',
            description: 'Elasticsearch relevance score (only in search results)',
            example: 2.456789,
          },
        },
      },
      SearchResponse: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
          total: {
            type: 'integer',
            description: 'Total number of results',
            example: 42,
          },
          query: {
            type: 'string',
            description: 'Search query used',
            example: 'luggage',
          },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Category ID',
            example: 104,
          },
          name: {
            type: 'string',
            description: 'Category name',
            example: 'Luggage & Travel Gear',
          },
        },
      },
      HealthStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['healthy', 'degraded', 'unhealthy'],
            example: 'healthy',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-03T12:00:00Z',
          },
          services: {
            type: 'object',
            properties: {
              api: {
                type: 'string',
                example: 'operational',
              },
              elasticsearch: {
                type: 'string',
                example: 'operational',
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Product not found',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Path to route files with JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;