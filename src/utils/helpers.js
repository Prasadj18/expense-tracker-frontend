/**
 * utils/helpers.js
 * Shared utility functions used across the frontend
 */

// ─── Currency formatter ───────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ─── Date formatter ───────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Short date for charts (e.g. "Apr 12")
export const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

// YYYY-MM-DD for <input type="date">
export const toInputDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
};

// ─── Category → colour mapping ────────────────────────────────────────────────
const CAT_COLORS = {
  "Food & Dining":    "#f5c842",
  "Housing":          "#5c9af5",
  "Transportation":   "#a78bfa",
  "Health & Fitness": "#3dd68c",
  "Shopping":         "#f5834a",
  "Entertainment":    "#f25f5c",
  "Education":        "#38bdf8",
  "Travel":           "#fb7185",
  "Utilities":        "#94a3b8",
  "Salary":           "#3dd68c",
  "Freelance":        "#4ade80",
  "Investment":       "#818cf8",
  "Other":            "#64748b",
};

// Returns a consistent hex color for a category (falls back to a hash-based color)
export const categoryColor = (category) => {
  if (CAT_COLORS[category]) return CAT_COLORS[category];
  // Generate a deterministic color from the category string
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 60%)`;
};

// Returns an emoji icon for a category
export const categoryIcon = (category) => {
  const icons = {
    "Food & Dining":    "🍽️",
    "Housing":          "🏠",
    "Transportation":   "🚗",
    "Health & Fitness": "💪",
    "Shopping":         "🛍️",
    "Entertainment":    "🎬",
    "Education":        "📚",
    "Travel":           "✈️",
    "Utilities":        "⚡",
    "Salary":           "💼",
    "Freelance":        "💻",
    "Investment":       "📈",
    "Other":            "📌",
  };
  return icons[category] || "📌";
};

// ─── Predefined categories list ───────────────────────────────────────────────
export const PREDEFINED_CATEGORIES = [
  "Food & Dining",
  "Housing",
  "Transportation",
  "Health & Fitness",
  "Shopping",
  "Entertainment",
  "Education",
  "Travel",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

// ─── Number abbreviation (1200 → 1.2K) ───────────────────────────────────────
export const abbreviateNumber = (n) => {
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toFixed(2)}`;
};

// ─── Month name ───────────────────────────────────────────────────────────────
export const monthName = (monthNum) => {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  return months[(monthNum - 1) % 12];
};
