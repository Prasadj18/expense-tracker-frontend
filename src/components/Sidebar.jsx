/**
 * components/Sidebar.jsx
 * Left navigation sidebar with links and theme toggle
 */

import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard",        path: "/" },
  { icon: "➕", label: "Add Transaction",  path: "/add" },
  { icon: "📋", label: "Transactions",     path: "/transactions" },
  { icon: "💡", label: "Insights",         path: "/insights" },
  { icon: "🎯", label: "Budgets",          path: "/budgets" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleNav = (path) => {
    navigate(path);
    onClose?.(); // close on mobile after nav
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>💰 ExpenseIQ</h2>
        <span>Smart Finance Tracker</span>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ icon, label, path }) => (
          <button
            key={path}
            className={`nav-item ${location.pathname === path ? "active" : ""}`}
            onClick={() => handleNav(path)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Footer: theme toggle */}
      <div className="sidebar-footer">
        <button className="nav-item full-width" onClick={toggleTheme}>
          <span className="nav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
