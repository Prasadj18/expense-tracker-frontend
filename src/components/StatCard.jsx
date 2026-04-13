/**
 * components/StatCard.jsx
 * Dashboard summary tile — shows a KPI with label, value, and accent color
 */

import { formatCurrency } from "../utils/helpers";

export default function StatCard({ label, value, sub, accentColor, icon, isCurrency = true }) {
  return (
    <div className="stat-card" style={{ "--accent-color": accentColor }}>
      <div className="flex-between mb-16" style={{ alignItems: "flex-start" }}>
        <div className="stat-label">{label}</div>
        {icon && (
          <span
            style={{
              fontSize: "1.4rem",
              opacity: 0.8,
              background: `${accentColor}18`,
              padding: "6px 8px",
              borderRadius: "8px",
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <div
        className="stat-value mono"
        style={{ color: accentColor || "var(--text-primary)" }}
      >
        {isCurrency ? formatCurrency(value || 0) : (value ?? "—")}
      </div>

      {sub && <div className="stat-sub mt-8">{sub}</div>}
    </div>
  );
}
