// Main React imports
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

// Main App Component
function App() {
  return (
    <AuthProvider>
      {/* Toast messages */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Application routes */}
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
