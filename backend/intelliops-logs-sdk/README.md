# 🧠 IntelliOps Logs SDK

A lightweight and developer-friendly Node.js SDK to send logs directly to your **IntelliOps Log Service**.  
Just install, initialize with your API key, and start logging instantly.

---

## 🚀 Installation

```bash
npm install intelliops-logs-sdk
```

or using yarn:

```bash
yarn add intelliops-logs-sdk
```

---

## 🛠️ Setup

Import and initialize the SDK with your IntelliOps API key.

```javascript
import { IntelliOpsLogger } from "intelliops-logs-sdk";

const logger = new IntelliOpsLogger(process.env.INTELLIOPS_API_KEY);
```

⚠️ Make sure your environment variable `INTELLIOPS_API_KEY` is set with a valid API key.

---

## 💬 Sending Logs

Send a log using the `sendLog()` function. Only `projectId`, `level`, and `message` are required. All other fields (like timestamp, source, environment) are auto-handled by the SDK.

```javascript
await logger.sendLog({
  projectId: "Project A",
  level: "error", // "info" | "warn" | "error" | "critical"
  message: "Database connection failed",
  meta: { retryCount: 3 },
});
```

### Example Output

```javascript
Log sent: { success: true, id: "log_123456", message: "Database connection failed" }
```

---

## ⚙️ Log Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | `string` | ✅ | Unique project identifier |
| `level` | `"info" \| "warn" \| "error" \| "critical"` | ✅ | Log level |
| `message` | `string` | ✅ | Log message |
| `source` | `string` | ❌ | Source of the log (default: `"unknown"`) |
| `meta` | `Record<string, any>` | ❌ | Additional metadata |
| `environment` | `"production" \| "staging" \| "development"` | ❌ | Environment (auto-detected) |
| `timestamp` | `string (ISO)` | Auto | Automatically added by SDK |

---

## 🧩 Advanced Usage

### 1. Custom Source

```javascript
logger.sendLog({
  projectId: "Project A",
  level: "info",
  message: "User signed in",
  source: "auth-service",
});
```

### 2. Environment Auto-Detection

If your `process.env.NODE_ENV` is set, SDK automatically sets `environment`.

---

## 🧑‍💻 Contributing

1. Clone this repository
2. Install dependencies

```bash
npm install
```

3. Build the SDK

```bash
npm run build
```

4. Run example usage locally

---

## 📦 Publishing (for maintainers)

Build and publish to npm:

```bash
npm login
npm run build
npm publish
```

---

## 📜 License

MIT License © 2025 IntelliOps

---

## 🌐 Links

* **IntelliOps Platform**: coming soon
* **API Docs**: coming soon
* **NPM Package**: https://www.npmjs.com/package/intelliops-logs-sdk
