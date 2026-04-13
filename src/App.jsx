/**
 * App.jsx
 * Root component — sets up providers, router, and the sidebar + main layout
 */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider }  from "./context/ThemeContext";
import { ToastProvider }  from "./context/ToastContext";
import Sidebar            from "./components/Sidebar";
import Dashboard          from "./pages/Dashboard";
import AddTransaction     from "./pages/AddTransaction";
import Transactions       from "./pages/Transactions";
import Insights           from "./pages/Insights";
import Budgets            from "./pages/Budgets";

export default function App() {
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-shell">
            {/* Sidebar */}
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 99,
                  display: "block",
                }}
              />
            )}

            {/* Main content area */}
            <main className="main-content">
              {/* Mobile header bar */}
              <div
                className="flex-between mb-24"
                style={{
                  display: "none",
                  padding: "0 0 16px",
                  borderBottom: "1px solid var(--border)",
                }}
                id="mobile-header"
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    color: "var(--gold)",
                  }}
                >
                  💰 ExpenseIQ
                </span>
                <button
                  className="btn btn-secondary btn-sm mobile-menu-btn"
                  onClick={() => setSidebarOpen(true)}
                  style={{ display: "flex" }}
                >
                  ☰ Menu
                </button>
              </div>

              <Routes>
                <Route path="/"             element={<Dashboard />}       />
                <Route path="/add"          element={<AddTransaction />}  />
                <Route path="/transactions" element={<Transactions />}    />
                <Route path="/insights"     element={<Insights />}        />
                <Route path="/budgets"      element={<Budgets />}         />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
