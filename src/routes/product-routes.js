/**
 * Product Routes
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import express from 'express';

class ProductRouter {
  constructor(productController) {
    this.productController = productController;
    this.router = express.Router();
    this._initializeRoutes();
  }

  _initializeRoutes() {
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
    this.router.get('/search', (req, res) => 
      this.productController.search(req, res)
    );

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
    this.router.get('/:id', (req, res) => 
      this.productController.getById(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default ProductRouter;
