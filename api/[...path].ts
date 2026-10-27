import app from "../server/_core/app.bundle.js";

// Build step bundles the shared Express application so Node ESM can resolve
// the server's internal imports consistently inside Vercel's function runtime.
export default app;
