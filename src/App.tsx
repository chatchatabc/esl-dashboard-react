import RouteManager from "./application/RouteManager";
import { Provider as ReduxProvider } from "react-redux";
import store from "./application/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import LoadingComp from "./application/components/loading/LoadingComp";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <React.Suspense fallback={<LoadingComp />}>
          <RouteManager />
        </React.Suspense>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
export default App;
