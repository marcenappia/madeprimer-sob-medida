import { createApiApp } from "../server/_core/app.js";

// Vercel invokes the exported Express app as a serverless request handler.
// Explicit .js is required for Node ESM resolution in the deployed function.
// Vite's SPA rewrite excludes /api, so API requests reach this handler.
const app = createApiApp();
export default app;
