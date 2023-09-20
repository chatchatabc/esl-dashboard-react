import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { TrpcRouter } from "../../../../esl-backend-workers/src/application/trpc/index";

export const trpcClient = createTRPCProxyClient<TrpcRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8787/trpc",
      // url: "https://esl-trpc.bonjomontes.workers.dev/trpc",
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
