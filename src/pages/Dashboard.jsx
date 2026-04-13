/**
 * pages/Dashboard.jsx
 * Main overview page: KPI cards, charts, recent transactions, insights
 */

import { useState, useEffect } from "react";
import { getSummary, getInsights } from "../api/api";
import { useToast } from "../context/ToastContext";
import StatCard from "../components/StatCard";
import CategoryPieChart from "../components/PieChart";
import TrendLineChart from "../components/LineChart";
import InsightsPanel from "../components/InsightsPanel";
import { formatCurrency, formatDate, categoryIcon, monthName } from "../utils/helpers";

export default function Dashboard() {
  const [summary, setSummary]   = useState(null);
  const [insights, setInsights] = useState([]);
  const [loadingS, setLoadingS] = useState(true);
  const [loadingI, setLoadingI] = useState(true);

  // Month picker state
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year,  setYear]  = useState(now.getFullYear());

  const { addToast } = useToast();

  // Fetch summary data whenever month/year changes
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingS(true);
        const { data } = await getSummary({ month, year });
        setSummary(data.data);
      } catch {
        addToast("Failed to load summary", "error");
      } finally {
        setLoadingS(false);
      }
    };
    fetchSummary();
  }, [month, year]); // eslint-disable-line

  // Fetch insights once on mount
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoadingI(true);
        const { data } = await getInsights();
        setInsights(data.data);
      } catch {
        addToast("Failed to load insights", "error");
      } finally {
        setLoadingI(false);
      }
    };
    fetchInsights();
  }, []); // eslint-disable-line

  const monthly  = summary?.monthly  || {};
  const allTime  = summary?.allTime  || {};
  const catData  = summary?.categoryBreakdown || [];
  const daily    = summary?.dailyTrend || [];

  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>

        {/* Month / Year picker */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ width: "auto" }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{monthName(i + 1)}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: "auto" }}
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── KPI Stat Cards ───────────────────────────────────────────── */}
      {loadingS ? (
        <div className="loading"><div className="spinner" />Loading summary…</div>
      ) : (
        <>
          {/* Monthly KPIs */}
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 12 }}>
            {monthName(month)} {year}
          </p>
          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <StatCard
              label="Monthly Income"
              value={monthly.income}
              icon="💵"
              accentColor="var(--green)"
              sub={`All-time: ${formatCurrency(allTime.income)}`}
            />
            <StatCard
              label="Monthly Expenses"
              value={monthly.expense}
              icon="💸"
              accentColor="var(--red)"
              sub={`All-time: ${formatCurrency(allTime.expense)}`}
            />
            <StatCard
              label="Monthly Balance"
              value={monthly.balance}
              icon="⚖️"
              accentColor={monthly.balance >= 0 ? "var(--gold)" : "var(--red)"}
              sub={`Net worth: ${formatCurrency(allTime.balance)}`}
            />
            <StatCard
              label="Net Worth"
              value={allTime.balance}
              icon="🏦"
              accentColor="var(--blue)"
              sub="Total income minus total expenses"
            />
          </div>

          {/* ── Charts ─────────────────────────────────────────────── */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-title">Category Breakdown — Expenses</div>
              <CategoryPieChart data={catData} />
            </div>
            <div className="chart-card">
              <div className="chart-title">Daily Trend — {monthName(month)} {year}</div>
              <TrendLineChart dailyData={daily} />
            </div>
          </div>

          {/* ── Category table (top spends) ──────────────────────── */}
          {catData.length > 0 && (
            <div className="card mb-24">
              <div className="chart-title">Top Spending Categories</div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catData.map((c) => {
                      const total = catData.reduce((s, x) => s + x.total, 0);
                      const pct   = ((c.total / total) * 100).toFixed(1);
                      return (
                        <tr key={c._id}>
                          <td>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {categoryIcon(c._id)} {c._id}
                            </span>
                          </td>
                          <td className="text-right amount-negative">
                            {formatCurrency(c.total)}
                          </td>
                          <td className="text-right" style={{ color: "var(--text-muted)" }}>
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Insights ─────────────────────────────────────────────────── */}
      <div className="card">
        <div className="chart-title" style={{ marginBottom: 16 }}>💡 Smart Insights</div>
        <InsightsPanel insights={insights} loading={loadingI} />
      </div>
    </div>
  );
}
