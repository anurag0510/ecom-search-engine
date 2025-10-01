# Configuration Guide

This guide explains how to configure the E-commerce Search Engine application, particularly the logging system.

## 📋 Table of Contents

- [Environment Variables](#environment-variables)
- [Logging Configuration](#logging-configuration)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [NPM Scripts](#npm-scripts)
- [VS Code Launch Configurations](#vs-code-launch-configurations)

## Environment Variables

All configuration is done through environment variables. Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

### Available Variables

#### Server Configuration

| Variable | Description | Default | Valid Values |
|----------|-------------|---------|--------------|
| `NODE_ENV` | Application environment | `development` | `development`, `production`, `test` |
| `PORT` | Server port | `3000` | `1-65535` |

#### Logging Configuration

| Variable | Description | Default | Valid Values |
|----------|-------------|---------|--------------|
| `LOG_LEVEL` | Logging level | `debug` (dev) / `warn` (prod) | `error`, `warn`, `info`, `http`, `debug` |
| `LOG_CONSOLE` | Enable console logging | `true` | `true`, `false` |
| `LOG_FILE` | Enable file logging | `true` | `true`, `false` |
| `LOG_MAX_SIZE` | Max log file size before rotation | `20m` | e.g., `10m`, `50m`, `1g` |
| `LOG_MAX_FILES` | Log retention period | `14d` | e.g., `7d`, `30d`, `90d` |
| `LOG_COMPRESS` | Compress rotated logs | `true` | `true`, `false` |

#### API Configuration

| Variable | Description | Default | Valid Values |
|----------|-------------|---------|--------------|
| `API_PREFIX` | API route prefix | `/api` | Any string starting with `/` |
| `API_VERSION` | API version | `v1` | Any string |

## Logging Configuration

### Log Levels Explained

The log levels determine what gets logged, from most to least severe:

1. **`error`** - Only critical errors (production safe)
   - Application crashes
   - Database failures
   - Payment failures
   - Security breaches

2. **`warn`** - Errors and warnings (recommended for production)
   - Deprecated features
   - Rate limiting
   - Invalid requests
   - Configuration issues

3. **`info`** - Errors, warnings, and important events
   - User actions (login, logout)
   - Business events (orders, payments)
   - System state changes

4. **`http`** - All above + HTTP requests
   - All API requests
   - Response times
   - Status codes

5. **`debug`** - Everything (development only)
   - Detailed execution flow
   - Variable values
   - Cache hits/misses
   - Internal operations

### When to Use Each Level

```bash
# Production - Only critical issues
LOG_LEVEL=error

# Production - With warnings
LOG_LEVEL=warn

# Staging - Business events + warnings
LOG_LEVEL=info

# Testing - All requests + responses
LOG_LEVEL=http

# Development - Everything
LOG_LEVEL=debug
```

## Quick Start

### 1. Using Environment Variables

```bash
# Set log level for current session
export LOG_LEVEL=debug
npm run dev

# Or inline
LOG_LEVEL=info npm run dev
```

### 2. Using .env File

Create a `.env` file:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
LOG_CONSOLE=true
LOG_FILE=true
```

Then run:
```bash
npm run dev
```

### 3. Using NPM Scripts

We provide convenient scripts for different log levels:

```bash
# Development with debug logs
npm run dev:debug

# Development with info logs
npm run dev:info

# Development with warnings only
npm run dev:warn

# Development with errors only
npm run dev:error

# Production mode
npm run start:prod
```

## Usage Examples

### Example 1: Development with All Logs

```bash
# .env
NODE_ENV=development
LOG_LEVEL=debug
LOG_CONSOLE=true
LOG_FILE=true
```

```bash
npm run dev
```

**Output:** All logs in console + files

### Example 2: Production with Minimal Logging

```bash
# .env
NODE_ENV=production
LOG_LEVEL=warn
LOG_CONSOLE=false
LOG_FILE=true
```

```bash
npm start
```

**Output:** Only warnings and errors in files

### Example 3: Testing with HTTP Logs

```bash
# .env
NODE_ENV=test
LOG_LEVEL=http
LOG_CONSOLE=true
LOG_FILE=false
```

```bash
npm run dev
```

**Output:** HTTP requests + errors/warnings in console only

### Example 4: Disable All Logging

```bash
# .env
LOG_LEVEL=error
LOG_CONSOLE=false
LOG_FILE=false
```

**Output:** No logs (not recommended)

### Example 5: Console Only (No Files)

```bash
# .env
LOG_LEVEL=info
LOG_CONSOLE=true
LOG_FILE=false
```

```bash
npm run dev
```

**Output:** Info/warn/error in console, no files

### Example 6: Files Only (No Console)

```bash
# .env
LOG_LEVEL=info
LOG_CONSOLE=false
LOG_FILE=true
```

```bash
npm run dev
```

**Output:** Info/warn/error in files only

## NPM Scripts

### Available Scripts

```bash
# Standard scripts
npm start           # Production mode (uses .env settings)
npm run dev         # Development mode (uses .env settings)

# Development with specific log levels
npm run dev:debug   # All logs (error + warn + info + http + debug)
npm run dev:info    # Info and above (error + warn + info)
npm run dev:warn    # Warnings and above (error + warn)
npm run dev:error   # Errors only

# Production
npm run start:prod  # Production mode with warn level

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Script Details

| Script | LOG_LEVEL | NODE_ENV | Use Case |
|--------|-----------|----------|----------|
| `dev` | From .env | development | Normal development |
| `dev:debug` | debug | development | Full debugging |
| `dev:info` | info | development | Important events only |
| `dev:warn` | warn | development | Test production-like logging |
| `dev:error` | error | development | Critical issues only |
| `start:prod` | warn | production | Production deployment |

## VS Code Launch Configurations

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug with All Logs",
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug",
        "PORT": "3000"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug with Info Logs",
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "info",
        "PORT": "3000"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug with Errors Only",
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "error",
        "PORT": "3000"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Production Mode",
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "warn",
        "PORT": "3000"
      }
    }
  ]
}
```

### Using Launch Configurations

1. Open VS Code
2. Go to Run and Debug (⇧⌘D)
3. Select configuration from dropdown
4. Click "Start Debugging" (F5)

## Advanced Configuration

### Custom Log File Locations

Modify `src/config/index.js`:

```javascript
logging: {
  level: process.env.LOG_LEVEL || 'info',
  logDir: process.env.LOG_DIR || './logs',
  // ... other settings
}
```

### Dynamic Log Level Changes

While the app is running, you can't change log level without restart. For dynamic changes, consider:

1. **Restart with new level:**
   ```bash
   LOG_LEVEL=error npm run dev
   ```

2. **Use different terminals:**
   ```bash
   # Terminal 1: Debug mode
   LOG_LEVEL=debug npm run dev

   # Terminal 2: Error mode
   LOG_LEVEL=error PORT=3001 npm run dev
   ```

### Environment-Specific Configurations

Create multiple .env files:

```bash
.env.development  # Development settings
.env.staging      # Staging settings
.env.production   # Production settings
```

Then use a tool like `dotenv` to load the right one.

## Troubleshooting

### Logs Not Appearing

**Check log level:**
```bash
# Should see logger initialization
npm run dev:debug
```

**Check transports:**
```bash
# Verify console and file are enabled
LOG_CONSOLE=true LOG_FILE=true npm run dev
```

### Too Many Logs

**Reduce log level:**
```bash
# Only show warnings and errors
npm run dev:warn
```

**Disable console:**
```bash
LOG_CONSOLE=false npm run dev
```

### Log Files Growing Too Large

**Reduce retention:**
```bash
LOG_MAX_FILES=7d npm run dev
```

**Reduce file size:**
```bash
LOG_MAX_SIZE=10m npm run dev
```

## Best Practices

### Development
```bash
LOG_LEVEL=debug      # See everything
LOG_CONSOLE=true     # Console for quick viewing
LOG_FILE=true        # Files for history
```

### Staging
```bash
LOG_LEVEL=info       # Important events
LOG_CONSOLE=false    # No console clutter
LOG_FILE=true        # Files for analysis
```

### Production
```bash
LOG_LEVEL=warn       # Only issues
LOG_CONSOLE=false    # No console output
LOG_FILE=true        # Files for debugging
LOG_COMPRESS=true    # Save disk space
```

## Summary

✅ **Configure once** in `.env` file
✅ **Use NPM scripts** for quick log level changes
✅ **VS Code launch configs** for debugging
✅ **Environment variables** for deployment
✅ **Appropriate levels** for each environment

For more logging details, see [LOGGING.md](LOGGING.md).
