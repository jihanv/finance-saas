import { Hono } from "hono";
import { handle } from "hono/vercel";
// import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import accounts from "./accounts";

// Tell Next.js to use the Edge runtime for this route.
// This gives you faster response times, but no Node.js APIs.
export const runtime = "edge";

// Create a new Hono app instance
const app = new Hono().basePath("/api");

// Mount the /accounts router (imported from ./accounts).
// This means any route defined inside ./accounts will be prefixed with /api/accounts
const routes = app.route("/accounts", accounts);

// Export the Hono handler for Vercel.
// This single handler supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
// Next.js will automatically connect it to /app/api/route.ts
export const GET = handle(app);
export const POST = handle(app);

// Optional: export a type for inference in client or server code.
// This helps with type-safe API calls using libraries like hono/client.
export type AppType = typeof routes;

// 2:17 create frontend hook

// Deleted Code

// app.get("/hello", clerkMiddleware(), (c) => {
//   const auth = getAuth(c);

//   // Check if user is authorized
//   if (!auth?.userId) {
//     return c.json({
//       error: "Unauthorized",
//     });
//   }

//   return c.json({
//     message: "Hello Next.js!",
//   });
// });
//

// A client requests /api/accounts.
// Next.js hands the request to your route.ts → your app.
// Your main Hono app looks for a matching route:
