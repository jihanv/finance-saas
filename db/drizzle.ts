import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Sets up a database connection using Neon (serverless Postgres)
// and wraps it with Drizzle ORM for type-safe queries.

// - `sql`: low-level Neon client for running raw SQL
export const sql = neon(process.env.DATABASE_URL!);

// - `db`: Drizzle ORM instance for structured, type-safe database access
export const db = drizzle({ client: sql });

// const result = await db.execute("select 1");

//2:08:00
//https://orm.drizzle.team/docs/rqb
