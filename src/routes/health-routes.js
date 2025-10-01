/**
 * Health Routes
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import express from 'express';

class HealthRouter {
  constructor(healthController) {
    this.healthController = healthController;
    this.router = express.Router();
    this._initializeRoutes();
  }

  _initializeRoutes() {
    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Health check endpoint
     *     description: Returns the health status of the API service
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Service is healthy
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/HealthResponse'
     */
    this.router.get('/', (req, res) => 
      this.healthController.check(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default HealthRouter;
