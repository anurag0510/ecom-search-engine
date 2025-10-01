/**
 * Product Service
 * Business logic for product operations
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

class ProductService {
  constructor(logger) {
    this.logger = logger;
    this._initializeDummyData();
  }

  _initializeDummyData() {
    this.products = [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        price: 79.99,
        description: 'High-quality wireless headphones with noise cancellation',
        inStock: true,
        ratings: 4.5,
        reviews: 120
      },
      {
        id: 2,
        name: 'Smart Watch',
        category: 'Electronics',
        price: 199.99,
        description: 'Feature-rich smartwatch with health tracking',
        inStock: true,
        ratings: 4.7,
        reviews: 85
      },
      {
        id: 3,
        name: 'Running Shoes',
        category: 'Sports',
        price: 89.99,
        description: 'Comfortable running shoes for all terrains',
        inStock: false,
        ratings: 4.3,
        reviews: 45
      }
    ];
  }

  /**
   * Search products by query and filters
   */
  searchProducts(query, filters = {}) {
    this.logger.info('Product search initiated', { query, filters });

    const { category, minPrice, maxPrice } = filters;

    // Filter by search query
    let results = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );

    // Apply category filter
    if (category) {
      results = results.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply price filters
    if (minPrice) {
      results = results.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      results = results.filter(product => product.price <= parseFloat(maxPrice));
    }

    this.logger.debug('Search completed', { query, resultCount: results.length });

    return results;
  }

  /**
   * Get product by ID
   */
  getProductById(id) {
    this.logger.debug('Product details requested', { productId: id });

    const product = this.products.find(p => p.id === parseInt(id));

    if (!product) {
      this.logger.warn('Product not found', { productId: id });
      return null;
    }

    this.logger.debug('Product details retrieved', { 
      productId: id, 
      productName: product.name 
    });

    return product;
  }

  /**
   * Get all products
   */
  getAllProducts() {
    return this.products;
  }
}

export default ProductService;
