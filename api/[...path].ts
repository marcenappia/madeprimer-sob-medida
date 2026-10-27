import { createApiApp } from "../server/_core/app";

// Vercel expects the exported handler to be the Express application itself.
// app.ts exports a factory, not a default app instance.
const app = createApiApp();

export default app;
