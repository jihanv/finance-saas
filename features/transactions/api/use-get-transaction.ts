// First Hook
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMilliunits } from "@/lib/utils";

// This is a **custom React hook** used to fetch a transaction from the server.
export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],

    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction.");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
