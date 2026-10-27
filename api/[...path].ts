import { createApiApp } from "../server/_core/app.bundle.js";

// Use the build-generated bundle so Vercel resolves the server's internal
// modules consistently in its serverless Node runtime.
export default createApiApp();
