/**
 * Elasticsearch Client Configuration
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import { Client } from '@elastic/elasticsearch';
import config from './index.js';

/**
 * Create and configure Elasticsearch client
 */
const createElasticsearchClient = () => {
  const clientConfig = {
    node: config.elasticsearch.node,
    maxRetries: config.elasticsearch.maxRetries,
    requestTimeout: config.elasticsearch.requestTimeout,
  };

  // Add authentication if provided
  if (config.elasticsearch.username && config.elasticsearch.password) {
    clientConfig.auth = {
      username: config.elasticsearch.username,
      password: config.elasticsearch.password,
    };
  }

  const client = new Client(clientConfig);

  return client;
};

// Create singleton instance
const elasticsearchClient = createElasticsearchClient();

/**
 * Check Elasticsearch connection
 */
export const checkElasticsearchConnection = async (logger) => {
  try {
    const health = await elasticsearchClient.cluster.health();
    logger.info('Elasticsearch connection established', {
      cluster: health.cluster_name,
      status: health.status,
      nodes: health.number_of_nodes,
    });
    return true;
  } catch (error) {
    logger.error('Failed to connect to Elasticsearch', {
      error: error.message,
      node: config.elasticsearch.node,
    });
    return false;
  }
};

/**
 * Initialize product index with mapping
 */
export const initializeProductIndex = async (logger) => {
  const indexName = config.elasticsearch.index;

  try {
    // Check if index exists
    const indexExists = await elasticsearchClient.indices.exists({
      index: indexName,
    });

    if (!indexExists) {
      // Create index with mapping
      await elasticsearchClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { 
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' }
                }
              },
              category: { 
                type: 'keyword'
              },
              price: { type: 'float' },
              description: { type: 'text' },
              inStock: { type: 'boolean' },
              ratings: { type: 'float' },
              reviews: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
        },
      });

      logger.info('Product index created', { index: indexName });
    } else {
      logger.info('Product index already exists', { index: indexName });
    }

    return true;
  } catch (error) {
    logger.error('Failed to initialize product index', {
      error: error.message,
      index: indexName,
    });
    return false;
  }
};

export default elasticsearchClient;
