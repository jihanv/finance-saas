import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import accounts from "./accounts";

export const runtime = "edge";

const app = new Hono().basePath("/api");

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
app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);
