/**
 * Logging Middleware
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

import logger from '../config/logger.js';

/**
 * HTTP request logging middleware
 * Logs all incoming requests with method, URL, status, duration, and IP
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details
  logger.logInfo('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };

    // Log with appropriate level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request error', logData);
    } else {
      logger.http('Request completed', logData);
    }
  });

  next();
};

/**
 * Error logging middleware
 * Logs all errors that occur during request processing
 */
export const errorLogger = (err, req, res, next) => {
  logger.logError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: res.statusCode,
  });

  next(err);
};

/**
 * Structured logger for application use
 * Provides convenience methods for logging throughout the app
 */
export { logger };
