# Logging Guide

This project uses **Winston** for comprehensive logging with support for multiple transports, log levels, and daily rotation.

## 📋 Table of Contents

- [Overview](#overview)
- [Log Levels](#log-levels)
- [Configuration](#configuration)
- [Usage](#usage)
- [Log Files](#log-files)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

The logging system provides:
- ✅ Multiple log levels (error, warn, info, http, debug)
- ✅ Console output with colors
- ✅ File output with daily rotation
- ✅ HTTP request logging
- ✅ Error tracking with stack traces
- ✅ Structured logging with metadata
- ✅ Automatic log file compression
- ✅ Log retention policies

## Log Levels

Logs are categorized by severity:

| Level | Priority | Description | When to Use |
|-------|----------|-------------|-------------|
| `error` | 0 | Error messages | System errors, exceptions, failures |
| `warn` | 1 | Warning messages | Deprecated features, potential issues |
| `info` | 2 | Informational messages | Application state changes, important events |
| `http` | 3 | HTTP request logs | API requests and responses |
| `debug` | 4 | Debug messages | Detailed debugging information |

### Environment-Based Levels

- **Development**: All levels (`debug` and above)
- **Production**: `warn` and above (errors and warnings only)

## Configuration

### Location
```
src/config/logger.js
```

### Settings

```javascript
// Log file settings
maxSize: '20m'        // Max file size before rotation
maxFiles: '14d'       // Keep logs for 14 days
zippedArchive: true   // Compress old logs
```

### Environment Variables

```bash
# Set log level
export NODE_ENV=production  # warn level
export NODE_ENV=development # debug level

# Set custom port
export PORT=3000
```

## Usage

### Import the Logger

```javascript
import { logger } from './middleware/logging.js';
```

### Basic Logging

```javascript
// Error logging
logger.error('Something went wrong');

// Warning
logger.warn('This is deprecated');

// Info
logger.info('User logged in');

// HTTP requests (automatic via middleware)
logger.http('GET /api/products - 200 - 45ms');

// Debug
logger.debug('Processing data');
```

### Structured Logging

Add context with metadata:

```javascript
logger.info('User action', {
  userId: 123,
  action: 'purchase',
  productId: 456,
  amount: 99.99
});

logger.error('Payment failed', {
  userId: 123,
  orderId: 789,
  error: 'Insufficient funds',
  amount: 99.99
});
```

### Error Logging with Stack Traces

```javascript
try {
  // Some code
} catch (error) {
  logger.logError(error, {
    context: 'Payment processing',
    userId: 123,
    orderId: 789
  });
}
```

### Convenience Methods

```javascript
// Info with context
logger.logInfo('Order placed', {
  orderId: 123,
  userId: 456,
  total: 99.99
});

// Warning with context
logger.logWarn('Low inventory', {
  productId: 789,
  quantity: 5
});

// Debug with context
logger.logDebug('Cache hit', {
  key: 'product:123',
  ttl: 3600
});
```

## Log Files

### Directory Structure

```
logs/
├── combined-2025-10-01.log        # All logs
├── combined-2025-10-01.log.gz     # Compressed old logs
├── error-2025-10-01.log           # Error logs only
└── error-2025-10-01.log.gz        # Compressed error logs
```

### Log File Types

#### Combined Log
- **File**: `logs/combined-YYYY-MM-DD.log`
- **Contains**: All log levels
- **Use**: Complete application history

#### Error Log
- **File**: `logs/error-YYYY-MM-DD.log`
- **Contains**: Error level only
- **Use**: Quick error investigation

### Rotation Policy

- **Daily rotation**: New file each day
- **Max size**: 20MB per file
- **Retention**: 14 days
- **Compression**: Automatic after rotation

## Examples

### HTTP Request Logging

Automatic logging for all requests:

```
2025-10-01 14:30:15 [http]: Request completed {
  method: "GET",
  url: "/api/search?query=laptop",
  statusCode: 200,
  duration: "45ms",
  ip: "::1"
}
```

### Error Logging

```javascript
// In your route handler
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    logger.info('Product retrieved', { 
      productId: req.params.id,
      name: product.name 
    });
    res.json(product);
  } catch (error) {
    logger.logError(error, {
      productId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});
```

### Application Events

```javascript
// Server startup
logger.info('Server started', {
  port: PORT,
  environment: NODE_ENV,
  nodeVersion: process.version
});

// Database connection
logger.info('Database connected', {
  host: 'localhost',
  database: 'ecommerce'
});

// Feature flag
logger.warn('Using deprecated API', {
  endpoint: '/old-api/products',
  deprecationDate: '2025-12-31'
});
```

## Best Practices

### 1. Use Appropriate Log Levels

```javascript
// ✅ Good
logger.error('Database connection failed', { error: err.message });
logger.warn('API rate limit approaching', { current: 95, limit: 100 });
logger.info('User logged in', { userId: 123 });
logger.debug('Cache lookup', { key: 'user:123' });

// ❌ Bad
logger.error('User logged in');  // Not an error
logger.debug('Database connection failed');  // Too low priority
```

### 2. Include Context

```javascript
// ✅ Good - includes context
logger.error('Payment failed', {
  userId: 123,
  orderId: 456,
  amount: 99.99,
  paymentMethod: 'credit_card'
});

// ❌ Bad - no context
logger.error('Payment failed');
```

### 3. Don't Log Sensitive Data

```javascript
// ✅ Good - masks sensitive data
logger.info('Payment processed', {
  userId: 123,
  cardLast4: '****1234',
  amount: 99.99
});

// ❌ Bad - logs sensitive data
logger.info('Payment processed', {
  userId: 123,
  cardNumber: '1234-5678-9012-3456',
  cvv: '123'
});
```

### 4. Use Structured Logging

```javascript
// ✅ Good - structured
logger.info('Order status changed', {
  orderId: 123,
  oldStatus: 'pending',
  newStatus: 'shipped',
  timestamp: new Date()
});

// ❌ Bad - string concatenation
logger.info(`Order 123 changed from pending to shipped`);
```

### 5. Log Errors with Stack Traces

```javascript
// ✅ Good
try {
  await processOrder();
} catch (error) {
  logger.logError(error, { orderId: 123 });
  // Stack trace automatically included
}

// ❌ Bad
try {
  await processOrder();
} catch (error) {
  logger.error(error.message);
  // Stack trace lost
}
```

### 6. Don't Log in Loops

```javascript
// ✅ Good
const results = await processItems(items);
logger.info('Batch processed', {
  total: items.length,
  successful: results.filter(r => r.success).length,
  failed: results.filter(r => !r.success).length
});

// ❌ Bad
for (const item of items) {
  logger.info('Processing item', { itemId: item.id });
  await processItem(item);
}
```

## Viewing Logs

### Console Output (Development)

Logs appear in the console with colors:
```bash
npm run dev
```

### File Output (All Environments)

View combined logs:
```bash
tail -f logs/combined-$(date +%Y-%m-%d).log
```

View error logs only:
```bash
tail -f logs/error-$(date +%Y-%m-%d).log
```

Search logs:
```bash
grep "error" logs/combined-*.log
grep "userId.*123" logs/combined-*.log
```

### JSON Log Analysis

Parse JSON logs for analysis:
```bash
cat logs/combined-2025-10-01.log | jq '.message'
cat logs/combined-2025-10-01.log | jq 'select(.level == "error")'
cat logs/error-2025-10-01.log | jq '.stack'
```

## Monitoring and Alerts

### Production Monitoring

Consider integrating with:
- **Datadog**: Real-time monitoring
- **Sentry**: Error tracking
- **LogStash/ELK**: Log aggregation
- **CloudWatch**: AWS logging
- **Application Insights**: Azure monitoring

### Setting Up Alerts

Monitor for:
- High error rates
- Slow response times
- Unusual traffic patterns
- Application crashes

## Troubleshooting

### Logs Not Appearing

1. Check directory permissions:
```bash
mkdir -p logs
chmod 755 logs
```

2. Verify logger configuration:
```javascript
console.log('Log level:', logger.level);
```

3. Check environment:
```bash
echo $NODE_ENV
```

### Large Log Files

If logs grow too large:
1. Reduce retention period
2. Decrease max file size
3. Increase log level threshold
4. Review what's being logged

### Missing Logs

Ensure transports are configured:
```javascript
logger.transports.forEach(t => {
  console.log(t.name, t.level);
});
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) file for details.
