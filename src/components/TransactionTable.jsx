/**
 * components/TransactionTable.jsx
 * Filterable, searchable table of transactions with delete and CSV export
 */

import { useState } from "react";
import { formatCurrency, formatDate, categoryIcon, PREDEFINED_CATEGORIES } from "../utils/helpers";
import { exportCSV } from "../api/api";

export default function TransactionTable({
  transactions,
  loading,
  filters,
  setFilters,
  onDelete,
}) {
  const [confirmId, setConfirmId] = useState(null); // track which row is awaiting confirm

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      // Auto-cancel confirm after 3 seconds
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  const handleExport = () => exportCSV(filters);

  return (
    <div>
      {/* ── Filters bar ──────────────────────────────────────────────── */}
      <div className="filters-bar">
        {/* Date range */}
        <input
          className="form-input"
          type="date"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleFilterChange}
          title="Start date"
        />
        <input
          className="form-input"
          type="date"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleFilterChange}
          title="End date"
        />

        {/* Category filter */}
        <select
          className="form-select"
          name="category"
          value={filters.category || ""}
          onChange={handleFilterChange}
          style={{ flex: 1, minWidth: 140 }}
        >
          <option value="">All Categories</option>
          {PREDEFINED_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          className="form-select"
          name="type"
          value={filters.type || ""}
          onChange={handleFilterChange}
          style={{ flex: 1, minWidth: 120 }}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Note search */}
        <input
          className="form-input"
          type="text"
          name="search"
          value={filters.search || ""}
          onChange={handleFilterChange}
          placeholder="🔍 Search note…"
          style={{ flex: 2, minWidth: 160 }}
        />

        {/* Clear filters */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setFilters({})}
        >
          Clear
        </button>

        {/* Export CSV */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleExport}
          title="Export as CSV"
        >
          📤 Export
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading transactions…
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📭</div>
          <p>No transactions found.<br />Try adjusting the filters or add a new transaction.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Note</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  {/* Date */}
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {formatDate(t.date)}
                  </td>

                  {/* Category */}
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {categoryIcon(t.category)}
                      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {t.category}
                      </span>
                      {t.isRecurring && (
                        <span className="badge badge-recurring">🔁 recurring</span>
                      )}
                    </span>
                  </td>

                  {/* Type badge */}
                  <td>
                    <span className={`badge badge-${t.type}`}>
                      {t.type === "income" ? "↑" : "↓"} {t.type}
                    </span>
                  </td>

                  {/* Note */}
                  <td style={{ maxWidth: 200 }}>
                    <span
                      title={t.note}
                      style={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.note || <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="text-right">
                    <span className={t.type === "income" ? "amount-positive" : "amount-negative"}>
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </td>

                  {/* Delete button */}
                  <td>
                    <button
                      className={`btn btn-sm ${confirmId === t._id ? "btn-danger" : "btn-secondary"}`}
                      onClick={() => handleDelete(t._id)}
                      title={confirmId === t._id ? "Click again to confirm" : "Delete"}
                    >
                      {confirmId === t._id ? "Confirm?" : "🗑️"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Row count */}
      {!loading && transactions.length > 0 && (
        <div style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
