/**
 * Product Service
 * Business logic for product operations
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import elasticsearchClient from '../config/elasticsearch.js';
import config from '../config/index.js';

class ProductService {
  constructor(logger) {
    this.logger = logger;
    this.esClient = elasticsearchClient;
    this.indexName = config.elasticsearch.index;
    this._initializeDummyData();
  }

  _initializeDummyData() {
    // Sample products matching your CSV structure
    this.products = [
      {
        asin: 'B014TMV5YE',
        title: 'Sion Softside Expandable Roller Luggage, Black, Checked-Large 29-Inch',
        imgUrl: 'https://m.media-amazon.com/images/I/815dLQKYIYL._AC_UL320_.jpg',
        productURL: 'https://www.amazon.com/dp/B014TMV5YE',
        stars: 4.5,
        reviews: 0,
        price: 139.99,
        listPrice: 0.0,
        category_id: 104,
        isBestSeller: false,
        boughtInLastMonth: 2000
      },
      {
        asin: 'B08N5WRWNW',
        title: 'Samsonite Omni PC Hardside Expandable Luggage with Spinner Wheels',
        imgUrl: 'https://m.media-amazon.com/images/I/81L+gu1bLJL._AC_UL320_.jpg',
        productURL: 'https://www.amazon.com/dp/B08N5WRWNW',
        stars: 4.7,
        reviews: 15234,
        price: 119.99,
        listPrice: 159.99,
        category_id: 104,
        isBestSeller: true,
        boughtInLastMonth: 5000
      },
      {
        asin: 'B07ZPKN6YR',
        title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
        imgUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UL320_.jpg',
        productURL: 'https://www.amazon.com/dp/B07ZPKN6YR',
        stars: 4.8,
        reviews: 89453,
        price: 249.99,
        listPrice: 279.99,
        category_id: 201,
        isBestSeller: true,
        boughtInLastMonth: 15000
      }
    ];
  }

  /**
   * Search products by query and filters using Elasticsearch
   */
  async searchProducts(query, filters = {}) {
    this.logger.info('Product search initiated with Elasticsearch', { query, filters });

    const { category_id, minPrice, maxPrice, isBestSeller, minStars } = filters;

    try {
      // Build Elasticsearch query
      const mustClauses = [];
      const filterClauses = [];

      // Add text search query
      if (query) {
        mustClauses.push({
          multi_match: {
            query: query,
            fields: ['title^2', 'asin'], // Boost title field, also search ASIN
            fuzziness: 'AUTO',
            operator: 'or'
          },
        });
      }

      // Add category filter
      if (category_id) {
        filterClauses.push({
          term: { category_id: parseInt(category_id) },
        });
      }

      // Add price range filter
      const priceRange = {};
      if (minPrice) priceRange.gte = parseFloat(minPrice);
      if (maxPrice) priceRange.lte = parseFloat(maxPrice);

      if (Object.keys(priceRange).length > 0) {
        filterClauses.push({
          range: { price: priceRange },
        });
      }

      // Add star rating filter
      if (minStars) {
        filterClauses.push({
          range: { stars: { gte: parseFloat(minStars) } },
        });
      }

      // Add best seller filter
      if (isBestSeller !== undefined) {
        filterClauses.push({
          term: { isBestSeller: isBestSeller === 'true' || isBestSeller === true },
        });
      }

      // Build the complete query
      const esQuery = {
        bool: {
          must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }],
          filter: filterClauses,
        },
      };

      // Execute search
      const response = await this.esClient.search({
        index: this.indexName,
        body: {
          query: esQuery,
          sort: [
            { _score: { order: 'desc' } }, // Relevance first
            { isBestSeller: { order: 'desc' } }, // Best sellers next
            { stars: { order: 'desc' } }, // Then by rating
            { boughtInLastMonth: { order: 'desc' } }, // Then by popularity
          ],
          size: 100, // Max results
        },
      });

      // Extract and format results
      const results = response.hits.hits.map(hit => ({
        ...hit._source,
        _score: hit._score, // Include relevance score
        _id: hit._id
      }));

      this.logger.info('Elasticsearch search completed', {
        query,
        resultCount: results.length,
        took: response.took,
      });

      return results;
    } catch (error) {
      this.logger.error('Elasticsearch search failed, falling back to in-memory search', {
        error: error.message,
        query,
      });

      // Fallback to in-memory search
      return this._fallbackSearch(query, filters);
    }
  }

  /**
   * Fallback in-memory search if Elasticsearch fails
   */
  _fallbackSearch(query, filters = {}) {
    const { category_id, minPrice, maxPrice, isBestSeller, minStars } = filters;

    let results = [...this.products];

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(product =>
        product.title.toLowerCase().includes(lowerQuery) ||
        product.asin.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filter
    if (category_id) {
      results = results.filter(product =>
        product.category_id === parseInt(category_id)
      );
    }

    // Apply price filters
    if (minPrice) {
      results = results.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      results = results.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Apply star rating filter
    if (minStars) {
      results = results.filter(product => product.stars >= parseFloat(minStars));
    }

    // Apply best seller filter
    if (isBestSeller !== undefined) {
      const isBest = isBestSeller === 'true' || isBestSeller === true;
      results = results.filter(product => product.isBestSeller === isBest);
    }

    // Sort results
    results.sort((a, b) => {
      // Best sellers first
      if (a.isBestSeller !== b.isBestSeller) return b.isBestSeller - a.isBestSeller;
      // Then by rating
      if (a.stars !== b.stars) return b.stars - a.stars;
      // Then by popularity
      return b.boughtInLastMonth - a.boughtInLastMonth;
    });

    return results;
  }

  /**
   * Get product by ASIN
   */
  getProductById(asin) {
    this.logger.debug('Product details requested', { asin });

    const product = this.products.find(p => p.asin === asin);

    if (!product) {
      this.logger.warn('Product not found', { asin });
      return null;
    }

    this.logger.debug('Product details retrieved', { 
      asin, 
      title: product.title 
    });

    return product;
  }

  /**
   * Get product from Elasticsearch by ASIN
   */
  async getProductByIdFromES(asin) {
    try {
      const response = await this.esClient.get({
        index: this.indexName,
        id: asin
      });

      this.logger.debug('Product retrieved from Elasticsearch', { asin });
      return response._source;
    } catch (error) {
      this.logger.warn('Product not found in Elasticsearch, using fallback', { 
        asin, 
        error: error.message 
      });
      return this.getProductById(asin);
    }
  }

  /**
   * Get all products
   */
  getAllProducts() {
    return this.products;
  }

  /**
   * Index a single product in Elasticsearch
   */
  async indexProduct(product) {
    try {
      await this.esClient.index({
        index: this.indexName,
        id: product.asin, // Use ASIN as document ID
        body: {
          ...product,
          price: parseFloat(product.price),
          listPrice: parseFloat(product.listPrice),
          stars: parseFloat(product.stars),
          reviews: parseInt(product.reviews),
          category_id: parseInt(product.category_id),
          boughtInLastMonth: parseInt(product.boughtInLastMonth),
          isBestSeller: product.isBestSeller === 'True' || product.isBestSeller === true,
          indexedAt: new Date(),
        },
        refresh: true, // Make immediately searchable
      });

      this.logger.debug('Product indexed in Elasticsearch', {
        asin: product.asin,
        title: product.title,
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to index product', {
        error: error.message,
        asin: product.asin,
      });
      return false;
    }
  }

  /**
   * Index all dummy products in Elasticsearch
   */
  async indexAllProducts() {
    this.logger.info('Indexing all products in Elasticsearch');

    const operations = this.products.flatMap(product => [
      { index: { _index: this.indexName, _id: product.asin } },
      { 
        ...product, 
        price: parseFloat(product.price),
        listPrice: parseFloat(product.listPrice),
        stars: parseFloat(product.stars),
        reviews: parseInt(product.reviews),
        category_id: parseInt(product.category_id),
        boughtInLastMonth: parseInt(product.boughtInLastMonth),
        indexedAt: new Date() 
      },
    ]);

    try {
      const response = await this.esClient.bulk({
        body: operations,
        refresh: true,
      });

      if (response.errors) {
        this.logger.warn('Some products failed to index', {
          errors: response.items.filter(item => item.index?.error),
        });
      } else {
        this.logger.info('All products indexed successfully', {
          count: this.products.length,
        });
      }

      return !response.errors;
    } catch (error) {
      this.logger.error('Failed to bulk index products', {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Delete all products from Elasticsearch index
   */
  async deleteAllProducts() {
    try {
      await this.esClient.deleteByQuery({
        index: this.indexName,
        body: {
          query: {
            match_all: {},
          },
        },
        refresh: true,
      });

      this.logger.info('All products deleted from Elasticsearch');
      return true;
    } catch (error) {
      this.logger.error('Failed to delete products', {
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category_id) {
    this.logger.info('Fetching products by category', { category_id });

    try {
      const response = await this.esClient.search({
        index: this.indexName,
        body: {
          query: {
            term: { category_id: parseInt(category_id) }
          },
          sort: [
            { isBestSeller: { order: 'desc' } },
            { stars: { order: 'desc' } },
          ],
          size: 100,
        },
      });

      return response.hits.hits.map(hit => hit._source);
    } catch (error) {
      this.logger.error('Failed to fetch products by category from ES', {
        error: error.message,
        category_id
      });
      
      // Fallback
      return this.products.filter(p => p.category_id === parseInt(category_id));
    }
  }

  /**
   * Get best sellers
   */
  async getBestSellers(limit = 10) {
    try {
      const response = await this.esClient.search({
        index: this.indexName,
        body: {
          query: {
            term: { isBestSeller: true }
          },
          sort: [
            { boughtInLastMonth: { order: 'desc' } },
            { stars: { order: 'desc' } },
          ],
          size: limit,
        },
      });

      return response.hits.hits.map(hit => hit._source);
    } catch (error) {
      this.logger.error('Failed to fetch best sellers from ES', {
        error: error.message
      });
      
      // Fallback
      return this.products
        .filter(p => p.isBestSeller)
        .sort((a, b) => b.boughtInLastMonth - a.boughtInLastMonth)
        .slice(0, limit);
    }
  }
}

export default ProductService;