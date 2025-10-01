# Logging Level Configuration - Quick Reference

## 🎯 Quick Start

### Option 1: Using .env File (Recommended)

1. Copy the template:
```bash
cp .env.example .env
```

2. Edit `.env`:
```bash
LOG_LEVEL=debug  # or info, warn, error
```

3. Run the app:
```bash
npm run dev
```

### Option 2: Using NPM Scripts

```bash
npm run dev:debug   # All logs
npm run dev:info    # Important events + warnings + errors
npm run dev:warn    # Warnings + errors only
npm run dev:error   # Errors only
```

### Option 3: Inline Environment Variable

```bash
LOG_LEVEL=info npm run dev
```

### Option 4: VS Code Debugger

1. Press `F5` or click Run and Debug
2. Select configuration:
   - "Debug - All Logs (Debug Level)"
   - "Debug - Info Level"
   - "Debug - Warnings & Errors Only"
   - "Debug - Errors Only"
3. Start debugging

## 📊 Log Levels Comparison

| Level | What You See | Use Case | Command |
|-------|--------------|----------|---------|
| `debug` | Everything | Development/Debugging | `npm run dev:debug` |
| `http` | HTTP + Info + Warn + Error | API Testing | `LOG_LEVEL=http npm run dev` |
| `info` | Important events + Warn + Error | Staging | `npm run dev:info` |
| `warn` | Warnings + Errors | Production | `npm run dev:warn` |
| `error` | Errors only | Critical issues only | `npm run dev:error` |

## 🔧 Configuration Options

### All Logging Environment Variables

```bash
# .env file
LOG_LEVEL=debug           # Log level
LOG_CONSOLE=true          # Console output
LOG_FILE=true             # File output
LOG_MAX_SIZE=20m          # Max file size
LOG_MAX_FILES=14d         # Retention period
LOG_COMPRESS=true         # Compress old logs
```

### What Each Level Shows

#### `debug` (Most Verbose)
```
✓ Debug messages (cache hits, internal operations)
✓ HTTP requests (all API calls)
✓ Info messages (user actions, business events)
✓ Warnings (deprecated features, issues)
✓ Errors (failures, exceptions)
```

#### `http`
```
✓ HTTP requests (all API calls)
✓ Info messages (user actions, business events)
✓ Warnings (deprecated features, issues)
✓ Errors (failures, exceptions)
```

#### `info`
```
✓ Info messages (user actions, business events)
✓ Warnings (deprecated features, issues)
✓ Errors (failures, exceptions)
```

#### `warn`
```
✓ Warnings (deprecated features, issues)
✓ Errors (failures, exceptions)
```

#### `error` (Least Verbose)
```
✓ Errors only (failures, exceptions)
```

## 📁 Where Logs Go

### Console Output
Visible in your terminal when `LOG_CONSOLE=true` (default)

### File Output
Located in `logs/` directory when `LOG_FILE=true` (default):
- `logs/combined-YYYY-MM-DD.log` - All logs
- `logs/error-YYYY-MM-DD.log` - Errors only

## 💡 Recommended Settings

### Development
```bash
LOG_LEVEL=debug
LOG_CONSOLE=true
LOG_FILE=true
```

### Staging
```bash
LOG_LEVEL=info
LOG_CONSOLE=false
LOG_FILE=true
```

### Production
```bash
LOG_LEVEL=warn
LOG_CONSOLE=false
LOG_FILE=true
LOG_COMPRESS=true
```

## 🚀 Examples

### Example 1: Maximum Logging (Development)
```bash
npm run dev:debug
```
See everything in console + files

### Example 2: Quiet Development
```bash
npm run dev:warn
```
Only see problems

### Example 3: Test Production Logging
```bash
npm run start:prod
```
Production mode with minimal logging

### Example 4: Custom Configuration
```bash
LOG_LEVEL=info LOG_CONSOLE=true LOG_FILE=false npm run dev
```
Info level, console only, no files

### Example 5: Different Port
```bash
PORT=4000 LOG_LEVEL=debug npm run dev
```
Run on port 4000 with debug logs

## 🔍 Checking Current Configuration

When the app starts, you'll see:
```
[info]: Logger initialized {
  level: 'debug',
  consoleEnabled: true,
  fileEnabled: true,
  environment: 'development'
}
```

## 📚 More Information

- **Full Configuration Guide**: [CONFIGURATION.md](CONFIGURATION.md)
- **Logging Details**: [LOGGING.md](LOGGING.md)
- **Implementation**: [LOGGING_IMPLEMENTATION.md](LOGGING_IMPLEMENTATION.md)

## ⚡ Quick Commands Reference

```bash
# Standard
npm run dev              # Uses .env settings

# With specific log levels
npm run dev:debug        # All logs
npm run dev:info         # Info+
npm run dev:warn         # Warn+
npm run dev:error        # Errors only

# Production
npm run start:prod       # Production mode

# Custom
LOG_LEVEL=http npm run dev           # HTTP level
LOG_CONSOLE=false npm run dev        # No console
PORT=4000 npm run dev                # Different port
```

## 🎓 Tips

1. **Start with `debug`** in development to see everything
2. **Use `info`** in staging to see important events
3. **Use `warn`** in production to minimize noise
4. **Use `error`** only when troubleshooting specific issues
5. **Check logs/** directory for historical data
6. **Use VS Code debugger** for interactive debugging with logs

---

**Need Help?** See [CONFIGURATION.md](CONFIGURATION.md) for detailed documentation.
