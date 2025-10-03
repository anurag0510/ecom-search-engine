/**
 * Product Controller
 * Handles HTTP requests for product operations
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

class ProductController {
  constructor(productService, logger) {
    this.productService = productService;
    this.logger = logger;
  }

  /**
   * Search products
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
  /**
   * Search products
   */
  async search(req, res) {
    const { query, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Validate required query parameter
    if (!query) {
      this.logger.warn('Search attempted without query parameter');
      return res.status(400).json({
        error: 'Query parameter is required',
        message: 'Please provide a search query using ?query=your-search-term',
      });
    }

    try {
      // Get filtered results from service (now async with Elasticsearch)
      const allResults = await this.productService.searchProducts(query, {
        category,
        minPrice,
        maxPrice,
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedResults = allResults.slice(startIndex, endIndex);

      // Prepare response
      const response = {
        query,
        filters: { category, minPrice, maxPrice },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: allResults.length,
          pages: Math.ceil(allResults.length / limit),
        },
        results: paginatedResults,
      };

      this.logger.info('Search completed successfully', {
        query,
        resultCount: allResults.length,
      });

      res.json(response);
    } catch (error) {
      this.logger.error('Search operation failed', { error: error.message });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to perform search',
      });
    }
  }

  /**
   * Get product by ID
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
  async getById(req, res) {
    try {
      const { id } = req.params;

      const product = this.productService.getProductById(id);

      if (!product) {
        this.logger.warn('Product not found', { productId: id, ip: req.ip });
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.status(200).json(product);
    } catch (error) {
      this.logger.logError(error, { context: 'ProductController.getById' });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ProductController;
