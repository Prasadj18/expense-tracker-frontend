/**
 * components/BudgetPanel.jsx
 * Displays budget vs actual spending progress bars per category,
 * and provides a form to add/update budgets.
 */

import { useState, useEffect, useCallback } from "react";
import { getBudgets, saveBudget, deleteBudget } from "../api/api";
import { PREDEFINED_CATEGORIES, formatCurrency, categoryIcon } from "../utils/helpers";
import { useToast } from "../context/ToastContext";

export default function BudgetPanel() {
  const [budgets, setBudgets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ category: "", limit: "" });
  const [saving, setSaving]     = useState(false);
  const { addToast } = useToast();

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getBudgets();
      setBudgets(data.data);
    } catch {
      addToast("Failed to load budgets", "error");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      addToast("Category and limit are required", "error");
      return;
    }
    try {
      setSaving(true);
      await saveBudget({ category: form.category, limit: parseFloat(form.limit) });
      addToast("Budget saved!", "success");
      setForm({ category: "", limit: "" });
      fetchBudgets();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save budget", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      addToast("Budget removed", "success");
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch {
      addToast("Failed to delete budget", "error");
    }
  };

  // Status → colour map
  const statusColor = { ok: "var(--green)", warning: "var(--gold)", exceeded: "var(--red)" };

  return (
    <div>
      {/* ── Add / Update Budget Form ──────────────────────────────────── */}
      <div className="card mb-24">
        <h3 style={{ marginBottom: 18, fontSize: "1rem", color: "var(--text-secondary)" }}>
          🎯 Set Monthly Budget
        </h3>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
              >
                <option value="">Select…</option>
                {PREDEFINED_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Limit (₹)</label>
              <input
                className="form-input"
                type="number"
                min="1"
                step="0.01"
                value={form.limit}
                onChange={(e) => setForm((p) => ({ ...p, limit: e.target.value }))}
                placeholder="e.g. 5000"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Budget"}
          </button>
        </form>
      </div>

      {/* ── Budget Progress Bars ──────────────────────────────────────── */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading…</div>
      ) : budgets.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🎯</div>
          <p>No budgets set. Add one above to start tracking.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {budgets.map((b) => (
            <div key={b._id} className="card-sm">
              {/* Header row */}
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{categoryIcon(b.category)}</span>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{b.category}</span>
                  {/* Status badge */}
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: `${statusColor[b.status]}18`,
                      color: statusColor[b.status],
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {b.status}
                  </span>
                </div>

                <button
                  className="btn btn-secondary btn-sm btn-icon"
                  onClick={() => handleDelete(b._id)}
                  title="Remove budget"
                >
                  ✕
                </button>
              </div>

              {/* Amounts row */}
              <div className="flex-between" style={{ marginBottom: 6, fontSize: "0.82rem" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Spent: <strong style={{ color: statusColor[b.status] }}>
                    {formatCurrency(b.spent)}
                  </strong>
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  Limit: <strong style={{ color: "var(--text-secondary)" }}>
                    {formatCurrency(b.limit)}
                  </strong>
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  Left: <strong style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(b.remaining)}
                  </strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="budget-bar-wrap">
                <div className="budget-bar-track">
                  <div
                    className={`budget-bar-fill ${b.status}`}
                    style={{ width: `${Math.min(b.usagePct, 100)}%` }}
                  />
                </div>
                <div style={{ marginTop: 4, fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "right" }}>
                  {b.usagePct}% used
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
