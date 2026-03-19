// ✅ Core React & ReactDOM Imports
import React from "react";
import ReactDOM from "react-dom/client";

// ✅ App Component & Routing
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// ✅ Global CSS (Optional: Can include Bootstrap, Custom, etc.)
import "./index.css";

// ✅ React 18 Root API - Creating root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Rendering App inside BrowserRouter to enable routing
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
