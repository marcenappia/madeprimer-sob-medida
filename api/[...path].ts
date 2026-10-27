import app from "../server/_core/app.bundle.js";

// The build bundles the shared Express app before Vercel packages this handler.
// This avoids Node ESM failing to resolve extensionless TypeScript imports at runtime.
const handler = app;
export default handler;
