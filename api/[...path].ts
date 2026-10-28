import { createApiApp } from "../dist/api-app.js";

// Load the pre-bundled Express API so path aliases and local TypeScript modules
// are resolved at build time, not by the Vercel Node runtime.
const app = createApiApp();
export default app;
