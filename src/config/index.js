/**
 * Application Configuration
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

/**
 * Application configuration loaded from environment variables
 */
const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Logging configuration
  logging: {
    // Log level: error, warn, info, http, debug
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
    
    // Enable/disable console logging
    console: process.env.LOG_CONSOLE !== 'false',
    
    // Enable/disable file logging
    file: process.env.LOG_FILE !== 'false',
    
    // Log file settings
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    
    // Enable/disable log compression
    compress: process.env.LOG_COMPRESS !== 'false',
  },

  // API configuration
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || 'v1',
  },
};

/**
 * Validate configuration
 */
const validateConfig = () => {
  const validLogLevels = ['error', 'warn', 'info', 'http', 'debug'];
  
  if (!validLogLevels.includes(config.logging.level)) {
    console.warn(`Invalid LOG_LEVEL "${config.logging.level}". Defaulting to "info".`);
    config.logging.level = 'info';
  }

  if (config.server.port < 1 || config.server.port > 65535) {
    console.warn(`Invalid PORT "${config.server.port}". Defaulting to 3000.`);
    config.server.port = 3000;
  }
};

// Validate on load
validateConfig();

export default config;
