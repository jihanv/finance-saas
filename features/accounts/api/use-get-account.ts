// First Hook
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// This is a **custom React hook** used to fetch an account from the server.
export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],

    queryFn: async () => {
      const response = await client.api.accounts[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
