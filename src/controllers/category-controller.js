/**
 * Category Controller
 * Handles HTTP requests for category operations
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

class CategoryController {
  constructor(categoryService, logger) {
    this.categoryService = categoryService;
    this.logger = logger;
  }

  /**
   * Get all categories
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
  async getAll(req, res) {
    try {
      const categories = this.categoryService.getAllCategories();

      res.status(200).json({
        categories
      });
    } catch (error) {
      this.logger.logError(error, { context: 'CategoryController.getAll' });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default CategoryController;
