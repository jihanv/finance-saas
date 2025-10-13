import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

//Creates a strongly typed API client based on your server routes

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
