/**
 * E-commerce Search Engine - Express Application
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

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.js';
import { requestLogger, errorLogger, logger } from './middleware/logging.js';

// Import services
import ProductService from './services/product-service.js';
import CategoryService from './services/category-service.js';

// Import controllers
import ProductController from './controllers/product-controller.js';
import CategoryController from './controllers/category-controller.js';
import HealthController from './controllers/health-controller.js';

// Import routers
import ProductRouter from './routes/product-routes.js';
import CategoryRouter from './routes/category-routes.js';
import HealthRouter from './routes/health-routes.js';

class Application {
  constructor() {
    this.app = express();
    this.logger = logger;
  }

  /**
   * Initialize all dependencies
   */
  _initDependencies() {
    this.logger.debug('Initializing dependencies');

    // Initialize services
    this.productService = new ProductService(this.logger);
    this.categoryService = new CategoryService(this.logger);

    // Initialize controllers
    this.productController = new ProductController(this.productService, this.logger);
    this.categoryController = new CategoryController(this.categoryService, this.logger);
    this.healthController = new HealthController(this.logger);

    // Initialize routers
    this.productRouter = new ProductRouter(this.productController);
    this.categoryRouter = new CategoryRouter(this.categoryController);
    this.healthRouter = new HealthRouter(this.healthController);

    this.logger.info('Dependencies initialized successfully');
  }

  /**
   * Configure middleware
   */
  _configureMiddleware() {
    this.logger.debug('Configuring middleware');

    // Request logging middleware (before other middleware)
    this.app.use(requestLogger);

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Swagger UI
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'E-commerce Search API Docs'
    }));

    this.logger.info('Middleware configured successfully');
  }

  /**
   * Configure routes
   */
  _configureRoutes() {
    this.logger.debug('Configuring routes');

    // Health check route
    this.app.use('/health', this.healthRouter.getRouter());

    // API routes
    this.app.use('/api/categories', this.categoryRouter.getRouter());
    this.app.use('/api/products', this.productRouter.getRouter());
    this.app.use('/api', this.productRouter.getRouter());

    this.logger.info('Routes configured successfully');
  }

  /**
   * Configure error handlers
   */
  _configureErrorHandlers() {
    this.logger.debug('Configuring error handlers');

    // 404 handler
    this.app.use((req, res) => {
      this.logger.warn('404 - Endpoint not found', { 
        method: req.method, 
        url: req.originalUrl, 
        ip: req.ip 
      });
      res.status(404).json({
        error: 'Endpoint not found'
      });
    });

    // Error logging middleware
    this.app.use(errorLogger);

    // Error handler
    this.app.use((err, req, res, next) => {
      this.logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
      });
      
      res.status(500).json({
        error: 'Internal server error'
      });
    });

    this.logger.info('Error handlers configured successfully');
  }

  /**
   * Initialize the application
   */
  initialize() {
    this.logger.info('Initializing application');

    this._initDependencies();
    this._configureMiddleware();
    this._configureRoutes();
    this._configureErrorHandlers();

    this.logger.info('Application initialized successfully');

    return this.app;
  }

  /**
   * Get the Express app instance
   */
  getApp() {
    return this.app;
  }
}

export default Application;
