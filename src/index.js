/**
 * E-commerce Search Engine - Server Entry Point
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

import Application from './app.js';
import config from './config/index.js';
import { logger } from './middleware/logging.js';

class ServerApplication {
  constructor() {
    this.application = null;
    this.server = null;
    this.port = config.server.port;
    this.logger = logger;
  }

  /**
   * Initialize dependencies
   */
  _initDependencies() {
    this.logger.info('Initializing server application');
    
    // Initialize the Application
    this.application = new Application();
    this.app = this.application.initialize();
    
    this.logger.debug('Server application dependencies initialized');
  }

  /**
   * Start the server
   */
  _start() {
    this.logger.info('Starting server', {
      port: this.port,
      env: config.server.env,
      logLevel: config.logging.level
    });

    this.server = this.app.listen(this.port, () => {
      this.logger.info('E-commerce Search Engine started successfully', {
        port: this.port,
        environment: config.server.env,
        nodeVersion: process.version,
        logLevel: config.logging.level,
        timestamp: new Date().toISOString()
      });
      
      this.logger.info(`Health check: http://localhost:${this.port}/health`);
      this.logger.info(`API docs: http://localhost:${this.port}/api-docs`);
      this.logger.info(`Swagger UI: http://localhost:${this.port}/api-docs`);
    });

    // Handle graceful shutdown
    this._setupGracefulShutdown();
  }

  /**
   * Setup graceful shutdown handlers
   */
  _setupGracefulShutdown() {
    const shutdown = (signal) => {
      this.logger.info(`${signal} received, shutting down gracefully`);
      
      this.server.close(() => {
        this.logger.info('Server closed successfully');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        this.logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled Rejection', {
        reason: reason,
        promise: promise,
      });
    });
  }

  /**
   * Initialize and start the application
   */
  run() {
    try {
      this._initDependencies();
      this._start();
    } catch (error) {
      this.logger.error('Failed to start server', {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
  }
}

// Create and run the application
const serverApp = new ServerApplication();
serverApp.run();
