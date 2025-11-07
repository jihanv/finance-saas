import { useQueryClient, useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

// These create TypeScript types automatically based on your API.

// looks at what the API endpoint returns as output. Figure out what data the server sends back when I create an category
type ResponseType = InferResponseType<typeof client.api.categories.$post>;

// looks at what the API endpoint expects as input. Figure out what data I need to send to the server when I create an category. API expects JSON data, so we grab just that part.
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

// This is a **custom React hook** used to fetch categories from the server.
export const useCreateCategory = () => {
  // queryClient helps refresh or update cached category lists later.
  const queryClient = useQueryClient();

  // This creates the mutation object that you’ll use in your form.
  // Think of a mutation as: "do something async and track its loading/error/success state".
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // This is the function that actually runs when you call mutation.mutate(values).
    // It sends a POST request to your /api/categories endpoint with form data.
    // It returns the server response.
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created");

      // Refetch all categories and update the cache data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  return mutation;
  // When you return `mutation`, you're giving your component access to:
  //
  // - A function to start the mutation (`mutate`)
  // - A bunch of status flags (`isPending`, `isError`, etc.)
  // - The results (`data`, `error`)
  // - Handy tools like `reset()`
  //
  // So `mutation` is like a mini state machine for an async action:
  // It knows when it started, if it’s loading, if it succeeded or failed,
  // and what data or error came back.
};
