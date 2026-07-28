import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import AuthProvider
import "./index.css";
import "./i18n/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* Phải bọc ở đây thì useAuth mới hoạt động */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
