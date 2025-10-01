/**
 * Category Service
 * Business logic for category operations
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

class CategoryService {
  constructor(logger) {
    this.logger = logger;
    this._initializeDummyData();
  }

  _initializeDummyData() {
    this.categories = [
      { id: 1, name: 'Electronics', count: 150 },
      { id: 2, name: 'Sports', count: 80 },
      { id: 3, name: 'Clothing', count: 200 },
      { id: 4, name: 'Books', count: 120 },
      { id: 5, name: 'Home & Garden', count: 95 }
    ];
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    this.logger.debug('Categories list requested');
    return this.categories;
  }

  /**
   * Get category by ID
   */
  getCategoryById(id) {
    return this.categories.find(c => c.id === parseInt(id));
  }

  /**
   * Get category by name
   */
  getCategoryByName(name) {
    return this.categories.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );
  }
}

export default CategoryService;
