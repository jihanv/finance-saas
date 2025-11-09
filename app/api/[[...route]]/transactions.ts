import { Hono } from "hono";

import { db } from "@/db/drizzle";

import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { eq, and, inArray, gte, lte, desc, sql } from "drizzle-orm";

import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { createId } from "@paralleldrive/cuid2";

import { parse, subDays } from "date-fns";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      // Get logged in user info
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;

      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      // Query the database:
      // select "id" and "name" columns from the "accounts" table
      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
          account: accounts.name,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id)) //Keep all the transactions, and fill in category details only when they exist.
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined, //If the user gave me a specific account ID, only show that account’s transactions.If not, just skip that filter.
            eq(accounts.userId, auth.userId), // only show transactions that belong to this user.
            gte(transactions.date, startDate), // only include transactions that happened after or on the start date.
            lte(transactions.date, endDate) // only include ones before or on the end date.
          )
        )
        .orderBy(desc(transactions.date));

      // Return the query results as JSON to the client
      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions) //add something new to the transactions table
        .values({
          //what data to put into that new row.
          id: createId(), //makes a new unique ID (like “tx_abc123”) for the transaction.
          ...values, //spreads in (copies over) the rest of the transaction data that came from the user’s form or API request.
        })
        .returning(); //After you insert the new row, give me back the data you just added.

      return c.json({ data: data[0] });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()), //zValidator("json", z.object({ ids: z.array(z.string()) })): require a JSON body shaped like: { "ids": ["tx_1", "tx_2", "tx_3"] }
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //saving is a “temporary list” of transaction IDs that we’re allowed to delete.
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id)) //For each transaction, find its account by matching the transaction’s accountId to the account’s id.
          .where(
            and(
              inArray(transactions.id, values.ids), //Only keep transactions whose id is one of the ids the user sent in the request.”
              eq(accounts.userId, auth.userId) //“Only keep transactions whose account owner is the currently logged-in user.”
            )
          )
      );
      const data = await db
        .with(transactionsToDelete) //load that list of safe IDs I made earlier.
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})` //delete transactions where the transactions.id is inside transactionsToDelete list.
          )
        )
        .returning({
          id: transactions.id, //After you delete those rows, tell me which ones you deleted
        });

      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .patch(
    "/:id", //This handles requests like PATCH /api/transactions/tx_123. The :id part is the transaction id in the URL.
    clerkMiddleware(),
    zValidator(
      //validate the URL path parameters (the :id in PATCH /transactions/:id). “id" must be a string if it exists, but it’s okay if it’s missing
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      //make sure the incoming JSON body looks like a valid transaction. It is from a form.
      // Zod will look at whatever the user sent in their request body and check that it matches the rules you’re about to describe.
      "json",
      insertTransactionSchema.omit({
        //: you can update fields like date, payee, amount, notes, accountId, categoryId, etc., but not the primary key id.
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Make a one-row, temporary table containing this transaction’s id if and only if the user owns it. Otherwise that table is empty.
      const transactionsToupdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id)) //for every transaction, this finds the account it belongs to.
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
        // eq(transactions.id, id) transaction whose id equals the one in the URL.
        // eq(accounts.userId, auth.userId) ensures that the transaction is part of an account owned by user
      );

      // update the transactions table, but only the rows whose IDs are in (transactions_to_update).”
      const [data] = await db
        .with(transactionsToupdate) // Include the temporary list I just defined (named transactions_to_update) in this database command, because I’m about to use it.
        .update(transactions)
        .set(values) // values is the cleaned, validated JSON you accepted from the client (e.g., from a form). Apply these new values to the row(s) we end up targeting.
        .where(
          inArray(
            // Only update the transaction if its transactions.id is in the safe list transactions_to_update
            transactions.id,
            sql`(select id from ${transactionsToupdate})`
          )
        )
        .returning(); //After you perform the update, give me back the row(s) you changed.

      if (!data) {
        return c.json({ error: "Not found" });
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id", //This handles requests like PATCH /api/transactions/tx_123. The :id part is the transaction id in the URL.
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json({ error: "Not found" });
      }

      return c.json({ data });
    }
  );
// Export the app so it can be mounted in your main router
export default app;
