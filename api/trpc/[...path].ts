import { createApiApp } from "../../dist/api-app.js";

// Explicit nested route entrypoint: Vercel must route /api/trpc/* to the API
// app, because tRPC procedure paths contain an additional URL segment.
const app = createApiApp();
export default app;
