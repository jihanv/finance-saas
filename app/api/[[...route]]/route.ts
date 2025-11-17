import { Hono } from "hono";
import { handle } from "hono/vercel";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";

// Tell Next.js to use the Edge runtime for this route.
// This gives you faster response times, but no Node.js APIs.
export const runtime = "edge";

// Create a new Hono app instance
const app = new Hono().basePath("/api");

// Hono automatically calls .onError() if any route throws an error
// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json({ error: "Internal Server Error" }, 500);
// });

// Mount the /accounts router (imported from ./accounts).
// This means any route defined inside ./accounts will be prefixed with /api/accounts
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);

// Export the Hono handler for Vercel.
// This single handler supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
// Next.js will automatically connect it to /app/api/route.ts
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
// Optional: export a type for inference in client or server code.
// This helps with type-safe API calls using libraries like hono/client.
export type AppType = typeof routes;
