/**
 * Elasticsearch Initialization Script
 * Creates index with proper mappings and loads sample data
 * 
 * Copyright 2025
 * Licensed under the Apache License, Version 2.0
 */

import elasticsearchClient from '../src/config/elasticsearch.js';
import { logger } from '../src/middleware/logging.js';
import config from '../src/config/index.js';

const INDEX_NAME = config.elasticsearch.index;

// Define index mappings for product structure
const indexMappings = {
  mappings: {
    properties: {
      asin: { 
        type: 'keyword' // Exact match for product IDs
      },
      title: { 
        type: 'text',
        fields: {
          keyword: { type: 'keyword' } // For exact matching
        },
        analyzer: 'standard'
      },
      imgUrl: { 
        type: 'keyword',
        index: false // Don't index URLs
      },
      productURL: { 
        type: 'keyword',
        index: false
      },
      stars: { 
        type: 'float' 
      },
      reviews: { 
        type: 'integer' 
      },
      price: { 
        type: 'float' 
      },
      listPrice: { 
        type: 'float' 
      },
      category_id: { 
        type: 'integer' 
      },
      isBestSeller: { 
        type: 'boolean' 
      },
      boughtInLastMonth: { 
        type: 'integer' 
      },
      indexedAt: { 
        type: 'date' 
      }
    }
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0, // For local development
    analysis: {
      analyzer: {
        custom_analyzer: {
          type: 'standard',
          stopwords: '_english_'
        }
      }
    }
  }
};

// Sample products matching CSV structure
const sampleProducts = [
  {
    asin: 'B014TMV5YE',
    title: 'Sion Softside Expandable Roller Luggage, Black, Checked-Large 29-Inch',
    imgUrl: 'https://m.media-amazon.com/images/I/815dLQKYIYL._AC_UL320_.jpg',
    productURL: 'https://www.amazon.com/dp/B014TMV5YE',
    stars: 4.5,
    reviews: 0,
    price: 139.99,
    listPrice: 0.0,
    category_id: 104,
    isBestSeller: false,
    boughtInLastMonth: 2000
  },
  {
    asin: 'B08N5WRWNW',
    title: 'Samsonite Omni PC Hardside Expandable Luggage with Spinner Wheels',
    imgUrl: 'https://m.media-amazon.com/images/I/81L+gu1bLJL._AC_UL320_.jpg',
    productURL: 'https://www.amazon.com/dp/B08N5WRWNW',
    stars: 4.7,
    reviews: 15234,
    price: 119.99,
    listPrice: 159.99,
    category_id: 104,
    isBestSeller: true,
    boughtInLastMonth: 5000
  },
  {
    asin: 'B07ZPKN6YR',
    title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
    imgUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UL320_.jpg',
    productURL: 'https://www.amazon.com/dp/B07ZPKN6YR',
    stars: 4.8,
    reviews: 89453,
    price: 249.99,
    listPrice: 279.99,
    category_id: 201,
    isBestSeller: true,
    boughtInLastMonth: 15000
  },
  {
    asin: 'B09X5JNC5R',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    imgUrl: 'https://m.media-amazon.com/images/I/61vFO3CUoYL._AC_UL320_.jpg',
    productURL: 'https://www.amazon.com/dp/B09X5JNC5R',
    stars: 4.6,
    reviews: 12543,
    price: 398.00,
    listPrice: 419.99,
    category_id: 201,
    isBestSeller: true,
    boughtInLastMonth: 8000
  },
  {
    asin: 'B0BSHF7WHW',
    title: 'Amazon Basics Hardside Spinner Luggage - 20-Inch, Carry-On',
    imgUrl: 'https://m.media-amazon.com/images/I/81r1KHHYX1L._AC_UL320_.jpg',
    productURL: 'https://www.amazon.com/dp/B0BSHF7WHW',
    stars: 4.3,
    reviews: 3421,
    price: 54.99,
    listPrice: 79.99,
    category_id: 104,
    isBestSeller: false,
    boughtInLastMonth: 1200
  }
];

async function initializeElasticsearch() {
  try {
    logger.info('Starting Elasticsearch initialization');

    // Check if index exists
    const indexExists = await elasticsearchClient.indices.exists({
      index: INDEX_NAME
    });

    // Delete existing index if it exists
    if (indexExists) {
      logger.info(`Deleting existing index: ${INDEX_NAME}`);
      await elasticsearchClient.indices.delete({
        index: INDEX_NAME
      });
    }

    // Create index with mappings
    logger.info(`Creating index: ${INDEX_NAME}`);
    await elasticsearchClient.indices.create({
      index: INDEX_NAME,
      body: indexMappings
    });

    // Index sample products
    logger.info('Indexing sample products');
    const operations = sampleProducts.flatMap(product => [
      { index: { _index: INDEX_NAME, _id: product.asin } },
      { ...product, indexedAt: new Date() }
    ]);

    const bulkResponse = await elasticsearchClient.bulk({
      body: operations,
      refresh: true
    });

    if (bulkResponse.errors) {
      logger.error('Some products failed to index', {
        errors: bulkResponse.items.filter(item => item.index?.error)
      });
    } else {
      logger.info(`Successfully indexed ${sampleProducts.length} products`);
    }

    // Verify data
    const countResponse = await elasticsearchClient.count({
      index: INDEX_NAME
    });

    logger.info('Elasticsearch initialization complete', {
      index: INDEX_NAME,
      documentCount: countResponse.count
    });

    // Test search
    logger.info('Testing search functionality');
    const searchResponse = await elasticsearchClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          match: { title: 'luggage' }
        }
      }
    });

    logger.info('Search test successful', {
      resultsFound: searchResponse.hits.hits.length
    });

    process.exit(0);
  } catch (error) {
    logger.error('Elasticsearch initialization failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Run initialization
initializeElasticsearch();