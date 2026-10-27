import { createApiApp } from "../server/_core/app";

// Vercel invokes this Express-compatible handler for /api/* requests.
// No listener is opened in the serverless function.
const app = createApiApp();
export default app;
