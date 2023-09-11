import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import store from "./application/redux/store";
import React from "react";
import RouteManager from "./application/RouteManager";
import { trpc } from "./domain/infras/trpcActions";
import { httpBatchLink } from "@trpc/client";

function App() {
  const [queryClient] = React.useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60000,
        },
      },
    });
  });
  const [trpcClient] = React.useState(() => {
    return trpc.createClient({
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
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <RouteManager />
        </ReduxProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
