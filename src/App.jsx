import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import TransactionsPage from "./features/transactions/TransactionsPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const handleLoginSuccess = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <div
        style={{
          background: "#0f172a",
          color: "white",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Logged in as: {localStorage.getItem("username") || "admin"}</span>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}