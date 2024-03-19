import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n.ts";
import * as amplitude from "@amplitude/analytics-browser";

amplitude.init("15b432460b2f012db568163cc4564604", {
  defaultTracking: false,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
