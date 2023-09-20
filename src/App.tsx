import AppRoute from "./application/routes/AppRoute";
import { Provider as ReduxProvider } from "react-redux";
import store from "./application/stores/appStore";
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
          <AppRoute />
        </React.Suspense>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
export default App;
