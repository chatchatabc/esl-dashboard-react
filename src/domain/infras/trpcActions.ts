import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { TrpcRouter } from "../../../../esl-backend-workers/src/application/trpc/index";

export const trpcClient = createTRPCProxyClient<TrpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:5000/trpc",
      // url: "https://esl-trpc.bonjomontes.workers.dev/trpc", // Production
      // url: "https://esl-trpc-test.bonjomontes.workers.dev/trpc", // Test
      async headers() {
        return {};
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
