import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n.ts";
import * as amplitude from "@amplitude/analytics-browser";

// Initialize Amplitude analytics
// TODO: Move API key to environment variable for better security
amplitude.init("15b432460b2f012db568163cc4564604", {
  defaultTracking: false, // Manual tracking for better control
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Note: StrictMode is disabled to avoid double-rendering issues with Swiper
root.render(<App />);
