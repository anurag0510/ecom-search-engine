/**
 * Category Routes
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import express from 'express';

class CategoryRouter {
  constructor(categoryController) {
    this.categoryController = categoryController;
    this.router = express.Router();
    this._initializeRoutes();
  }

  _initializeRoutes() {
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
    this.router.get('/', (req, res) => 
      this.categoryController.getAll(req, res)
    );
  }

getRouter() {
    return this.router;
  }
}

export default CategoryRouter;
