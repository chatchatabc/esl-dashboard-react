import RouteManager from "./application/RouteManager";
import { Provider as ReduxProvider } from "react-redux";
import store from "./application/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <RouteManager />
      </ReduxProvider>
    </QueryClientProvider>
  );
}
export default App;
