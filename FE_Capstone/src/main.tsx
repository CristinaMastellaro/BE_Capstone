import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/index.ts";
// import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* <PersistGate per> */}
    <App />
    {/* </PersistGate> */}
  </Provider>
);
