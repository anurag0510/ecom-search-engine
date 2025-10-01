/**
 * Swagger Configuration - OpenAPI 3.0 Specification
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

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce Search Engine API',
      version: '1.0.0',
      description: 'A REST API for e-commerce product search and filtering with support for categories, price ranges, and pagination.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Search',
        description: 'Product search operations'
      },
      {
        name: 'Products',
        description: 'Product management operations'
      },
      {
        name: 'Categories',
        description: 'Category operations'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Wireless Bluetooth Headphones'
            },
            category: {
              type: 'string',
              description: 'Product category',
              example: 'Electronics'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Product price',
              example: 79.99
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'High-quality wireless headphones with noise cancellation'
            },
            inStock: {
              type: 'boolean',
              description: 'Stock availability',
              example: true
            }
          }
        },
        ProductDetail: {
          allOf: [
            { $ref: '#/components/schemas/Product' },
            {
              type: 'object',
              properties: {
                ratings: {
                  type: 'number',
                  format: 'float',
                  description: 'Average product rating',
                  example: 4.5
                },
                reviews: {
                  type: 'integer',
                  description: 'Number of reviews',
                  example: 120
                }
              }
            }
          ]
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Category ID',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Category name',
              example: 'Electronics'
            },
            count: {
              type: 'integer',
              description: 'Number of products in category',
              example: 150
            }
          }
        },
        SearchResponse: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
              example: 'headphones'
            },
            filters: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  nullable: true,
                  example: 'Electronics'
                },
                minPrice: {
                  type: 'string',
                  nullable: true,
                  example: '50'
                },
                maxPrice: {
                  type: 'string',
                  nullable: true,
                  example: '200'
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 1
                }
              }
            },
            results: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product'
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-01T12:00:00.000Z'
            },
            service: {
              type: 'string',
              example: 'ecom-search-engine'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Product not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/app.js']
};
