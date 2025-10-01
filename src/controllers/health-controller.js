/**
 * Health Controller
 * Handles health check requests
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

class HealthController {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Health check endpoint
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
  async check(req, res) {
    try {
      this.logger.debug('Health check requested');
      
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'ecom-search-engine'
      });
    } catch (error) {
      this.logger.logError(error, { context: 'HealthController.check' });
      res.status(500).json({ 
        status: 'error',
        timestamp: new Date().toISOString() 
      });
    }
  }
}

export default HealthController;
