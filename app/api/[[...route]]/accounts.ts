//2:11:00

import { Hono } from "hono";

const app = new Hono();

//That means: “when someone asks for / in this router, return empty accounts.”
app.get("/", (c) => {
  return c.json({ accounts: [] });
});

export default app;
