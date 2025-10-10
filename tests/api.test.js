/**
 * API Test Suite
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

import { jest } from '@jest/globals';
import request from 'supertest';
import Application from '../src/app.js';

// Mock Elasticsearch client to simulate unavailable ES and force fallback to in-memory search
jest.unstable_mockModule('../src/config/elasticsearch.js', () => ({
  default: {
    search: jest.fn().mockRejectedValue(new Error('ES not available in tests')),
    index: jest.fn().mockResolvedValue({ result: 'created' }),
    bulk: jest.fn().mockResolvedValue({ errors: false }),
    count: jest.fn().mockResolvedValue({ count: 0 }),
    get: jest.fn().mockRejectedValue(new Error('Not found')),
    deleteByQuery: jest.fn().mockResolvedValue({ deleted: 0 }),
    indices: {
      exists: jest.fn().mockResolvedValue(false),
      create: jest.fn().mockResolvedValue({ acknowledged: true }),
      delete: jest.fn().mockResolvedValue({ acknowledged: true }),
    },
    cluster: {
      health: jest.fn().mockResolvedValue({
        cluster_name: 'test',
        status: 'green',
        number_of_nodes: 1,
      }),
    },
  },
}));

describe('Health Check Endpoint', () => {
  let app;

  beforeAll(() => {
    const application = new Application();
    app = application.initialize();
  });

  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'ecom-search-engine');
  });
});

describe('Search API', () => {
  let app;

  beforeAll(() => {
    const application = new Application();
    app = application.initialize();
  });

  describe('GET /api/search', () => {
    it('should return 400 when query is missing', async () => {
      const response = await request(app)
        .get('/api/search')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Query parameter is required');
    });

    it('should return search results with valid query', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage')
        .expect(200);

      expect(response.body).toHaveProperty('query', 'luggage');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
      
      // Check product structure
      const product = response.body.results[0];
      expect(product).toHaveProperty('asin');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category_id');
    });

    it('should filter by category_id', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage&category_id=104')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach(product => {
        expect(product.category_id).toBe(104);
      });
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage&minPrice=50&maxPrice=200')
        .expect(200);

      if (response.body.results.length > 0) {
        response.body.results.forEach(product => {
          expect(product.price).toBeGreaterThanOrEqual(50);
          expect(product.price).toBeLessThanOrEqual(200);
        });
      }
    });

    it('should filter by star rating', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage&minStars=4.0')
        .expect(200);

      if (response.body.results.length > 0) {
        response.body.results.forEach(product => {
          expect(product.stars).toBeGreaterThanOrEqual(4.0);
        });
      }
    });

    it('should filter by best seller status', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage&isBestSeller=true')
        .expect(200);

      if (response.body.results.length > 0) {
        response.body.results.forEach(product => {
          expect(product.isBestSeller).toBe(true);
        });
      }
    });

    it('should include pagination info', async () => {
      const response = await request(app)
        .get('/api/search?query=luggage&page=1&limit=2')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 2);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('pages');
    });
  });
});

describe('Products API', () => {
  let app;

  beforeAll(() => {
    const application = new Application();
    app = application.initialize();
  });

  describe('GET /api/products/:id', () => {
    it('should return product details for valid ASIN', async () => {
      const response = await request(app)
        .get('/api/products/B014TMV5YE')
        .expect(200);

      expect(response.body).toHaveProperty('asin', 'B014TMV5YE');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('category_id');
      expect(response.body).toHaveProperty('stars');
      expect(response.body).toHaveProperty('reviews');
      expect(response.body).toHaveProperty('isBestSeller');
      expect(response.body).toHaveProperty('boughtInLastMonth');
    });

    it('should return 404 for invalid product ASIN', async () => {
      const response = await request(app)
        .get('/api/products/INVALID_ASIN')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
});

describe('Categories API', () => {
  let app;

  beforeAll(() => {
    const application = new Application();
    app = application.initialize();
  });

  describe('GET /api/categories', () => {
    it('should return list of categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);
      
      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories.length).toBeGreaterThan(0);
      
      const category = response.body.categories[0];
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('count');
    });
  });
});

describe('Error Handling', () => {
  let app;

  beforeAll(() => {
    const application = new Application();
    app = application.initialize();
  });

  it('should return 404 for unknown endpoints', async () => {
    const response = await request(app)
      .get('/api/unknown-endpoint')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('not found');
  });
});