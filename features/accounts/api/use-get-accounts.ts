// First Hook
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// This is a **custom React hook** used to fetch accounts from the server.
export const useGetAccounts = () => {
  // We call `useQuery` to fetch data from `/api/accounts`
  // and keep it cached + reactive in the UI.
  const query = useQuery({
    // `queryKey` is like a unique ID for this query.
    // React Query uses it for caching and refetching.
    queryKey: ["accounts"],

    // `queryFn` is the function React Query will run
    // to actually fetch the accounts from the server.
    queryFn: async () => {
      // This makes a GET request to /api/accounts on our backend
      // using the Hono client.
      const response = await client.api.accounts.$get();

      // `.ok` means HTTP status is 200-299.
      // If it's not okay, we throw an error and React Query will handle it.
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      // Convert the response body from JSON.
      // We assume the API returns something like: { data: [...] }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
