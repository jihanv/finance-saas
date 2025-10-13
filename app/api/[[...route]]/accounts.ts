import { Hono } from "hono";

// Import the database connection (configured with Drizzle ORM)
import { db } from "@/db/drizzle";

// Import the "accounts" table definition from your schema
import { accounts } from "@/db/schema";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { HTTPException } from "hono/http-exception";

// Create a new Hono app and define a GET handler for "/"
const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  // Get logged in user info
  const auth = getAuth(c);

  // If not authenticated, return error
  if (!auth?.userId) {
    throw new HTTPException(401, {
      res: c.json({ error: "Unauthorized" }, 401),
    });
  }

  // Query the database:
  // select "id" and "name" columns from the "accounts" table
  const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts);

  // Return the query results as JSON to the client
  return c.json({ data });
});

// Export the app so it can be mounted in your main router
export default app;
