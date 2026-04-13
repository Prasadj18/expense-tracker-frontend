/**
 * api/api.js
 * Centralised Axios instance — all backend calls go through here
 */

import axios from "axios";

// ✅ Backend URL from environment variable
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://expense-tracker-backend-fs20.onrender.com"; // fallback (important)

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Transaction APIs ─────────────────────────────────────────
export const createTransaction = (data) =>
  api.post("/transactions", data);

export const getTransactions = (params = {}) =>
  api.get("/transactions", { params });

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

export const getCategories = () =>
  api.get("/transactions/meta/categories");

// ─── Summary API ──────────────────────────────────────────────
export const getSummary = (params = {}) =>
  api.get("/summary", { params });

// ─── Insights API ─────────────────────────────────────────────
export const getInsights = () =>
  api.get("/insights");

// ─── Budget APIs ──────────────────────────────────────────────
export const getBudgets = () =>
  api.get("/budget");

export const saveBudget = (data) =>
  api.post("/budget", data);

export const deleteBudget = (id) =>
  api.delete(`/budget/${id}`);

// ─── CSV Export helper ────────────────────────────────────────
export const exportCSV = (params = {}) => {
  const query = new URLSearchParams({
    ...params,
    export: "csv",
  }).toString();

  window.location.href = `${BASE_URL}/api/transactions?${query}`;
};

export default api;