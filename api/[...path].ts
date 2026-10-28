import { createApiApp } from "../server/_core/app";

// Vercel invokes the exported Express app as a serverless request handler.
// This function serves API routes only; Vite's SPA rewrite excludes /api.
const app = createApiApp();
export default app;
