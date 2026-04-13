/**
 * components/TransactionForm.jsx
 * Form to add a new income or expense transaction
 */

import { useState } from "react";
import { createTransaction } from "../api/api";
import { useToast } from "../context/ToastContext";
import { PREDEFINED_CATEGORIES } from "../utils/helpers";

const DEFAULT_FORM = {
  type:        "expense",
  amount:      "",
  category:    "",
  customCat:   "",
  date:        new Date().toISOString().split("T")[0],
  note:        "",
  isRecurring: false,
};

export default function TransactionForm({ onSuccess }) {
  const [form, setForm]         = useState(DEFAULT_FORM);
  const [loading, setLoading]   = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resolve final category (custom overrides dropdown)
    const finalCategory =
      form.category === "__custom__"
        ? form.customCat.trim()
        : form.category;

    if (!finalCategory) {
      addToast("Please select or enter a category", "error");
      return;
    }

    if (!form.amount || parseFloat(form.amount) <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        amount:      parseFloat(form.amount),
        category:    finalCategory,
        type:        form.type,
        date:        form.date,
        note:        form.note,
        isRecurring: form.isRecurring,
      });
      addToast("Transaction added successfully!", "success");
      setForm(DEFAULT_FORM);   // reset form
      onSuccess?.();           // notify parent (e.g. refetch data)
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add transaction", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Income / Expense toggle */}
      <div className="type-toggle">
        <button
          type="button"
          className={`type-btn income ${form.type === "income" ? "active" : ""}`}
          onClick={() => setForm((p) => ({ ...p, type: "income" }))}
        >
          ↑ Income
        </button>
        <button
          type="button"
          className={`type-btn expense ${form.type === "expense" ? "active" : ""}`}
          onClick={() => setForm((p) => ({ ...p, type: "expense" }))}
        >
          ↓ Expense
        </button>
      </div>

      {/* Amount + Date row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            className="form-input"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          name="category"
          value={form.category}
          onChange={handleChange}
          required={form.category !== "__custom__"}
        >
          <option value="">Select category…</option>
          {PREDEFINED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="__custom__">+ Custom category</option>
        </select>
      </div>

      {/* Custom category input — shown only when Custom selected */}
      {form.category === "__custom__" && (
        <div className="form-group">
          <label className="form-label">Custom Category Name</label>
          <input
            className="form-input"
            type="text"
            name="customCat"
            value={form.customCat}
            onChange={handleChange}
            placeholder="e.g. Pet Care"
            required
          />
        </div>
      )}

      {/* Note */}
      <div className="form-group">
        <label className="form-label">Note (optional)</label>
        <textarea
          className="form-textarea"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a description…"
          rows={2}
        />
      </div>

      {/* Recurring checkbox */}
      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          id="isRecurring"
          name="isRecurring"
          checked={form.isRecurring}
          onChange={handleChange}
          style={{ width: 16, height: 16, accentColor: "var(--gold)", cursor: "pointer" }}
        />
        <label
          htmlFor="isRecurring"
          style={{ fontSize: "0.875rem", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          🔁 Mark as recurring (monthly)
        </label>
      </div>

      <button
        className="btn btn-primary full-width"
        type="submit"
        disabled={loading}
        style={{ marginTop: "8px", padding: "13px" }}
      >
        {loading ? "Saving…" : `Add ${form.type === "income" ? "Income" : "Expense"}`}
      </button>
    </form>
  );
}
