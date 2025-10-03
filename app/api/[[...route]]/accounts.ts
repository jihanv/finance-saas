//2:11:00

import { Hono } from "hono";

//That means: “when someone asks for / in this router, return empty accounts.”
const app = new Hono().get("/", (c) => {
  return c.json({ accounts: [] });
});

export default app;
