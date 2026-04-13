/**
 * pages/Budgets.jsx
 * Budget management page — set limits per category and view usage
 */

import BudgetPanel from "../components/BudgetPanel";

export default function Budgets() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎯 Budgets</h1>
      </div>

      {/* Explainer */}
      <div
        className="card-sm mb-24"
        style={{ background: "var(--gold-dim)", borderColor: "rgba(245,200,66,0.2)" }}
      >
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Set monthly spending limits per category. You'll see a warning when you reach 80%
          of a budget and an alert when you exceed it. Limits reset at the start of each month.
        </p>
      </div>

      <BudgetPanel />
    </div>
  );
}
