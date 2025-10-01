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

import request from 'supertest';
import app from '../src/app.js';

describe('Health Check Endpoint', () => {
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
  describe('GET /api/search', () => {
    it('should return 400 when query is missing', async () => {
      const response = await request(app)
        .get('/api/search')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Search query is required');
    });

    it('should return search results with valid query', async () => {
      const response = await request(app)
        .get('/api/search?query=headphones')
        .expect(200);

      expect(response.body).toHaveProperty('query', 'headphones');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/search?query=watch&category=Electronics')
        .expect(200);

      expect(response.body.results.length).toBeGreaterThan(0);
      response.body.results.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/search?query=watch&minPrice=50&maxPrice=150')
        .expect(200);

      response.body.results.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(150);
      });
    });

    it('should include pagination info', async () => {
      const response = await request(app)
        .get('/api/search?query=shoes&page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
    });
  });
});

describe('Products API', () => {
  describe('GET /api/products/:id', () => {
    it('should return product details for valid ID', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('inStock');
      expect(response.body).toHaveProperty('ratings');
      expect(response.body).toHaveProperty('reviews');
    });

    it('should return 404 for invalid product ID', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
});

describe('Categories API', () => {
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
  it('should return 404 for unknown endpoints', async () => {
    const response = await request(app)
      .get('/api/unknown')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Endpoint not found');
  });
});
