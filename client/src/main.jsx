import "./styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";

import App from "./App";

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <APIProvider
      apiKey={MAPS_KEY}
      version="beta"
      libraries={["places", "routes"]}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </APIProvider>
  </React.StrictMode>
);