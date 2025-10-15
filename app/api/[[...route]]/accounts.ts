import { Hono } from "hono";

// Import the database connection (configured with Drizzle ORM)
import { db } from "@/db/drizzle";

// Import the "accounts" table definition from your schema
import { accounts, insertAccountSchema } from "@/db/schema";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { eq } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";

import { createId } from "@paralleldrive/cuid2";

// Create a new Hono app and define a GET handler for "/"
// clerkMiddleware() runs before the route handler and adds authentication info to `c` (Hono's context).
// It doesn't create `c`—it just enhances it so getAuth(c) can access the logged-in user's data.
const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // Get logged in user info
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Query the database:
    // select "id" and "name" columns from the "accounts" table
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    // Return the query results as JSON to the client
    return c.json({ data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data: data[0] });
    }
  );
// Export the app so it can be mounted in your main router
export default app;
