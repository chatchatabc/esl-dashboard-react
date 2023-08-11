import ReactDOM from "react-dom/client";
import "./index.css";
import RouteManager from "./application/RouteManager";
import { Provider } from "react-redux";
import store from "./application/redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouteManager />
  </Provider>
);
