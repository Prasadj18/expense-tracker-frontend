/**
 * components/LineChart.jsx
 * Daily income vs expense trend line chart
 */

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

export default function TrendLineChart({ dailyData = [], monthLabel = "" }) {
  // Only show days that have had at least one entry OR up to today
  const today = new Date().getDate();
  const relevant = dailyData.slice(0, today);

  const labels   = relevant.map((d) => `${d.day}`);
  const incomes  = relevant.map((d) => d.income);
  const expenses = relevant.map((d) => d.expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomes,
        borderColor: "#3dd68c",
        backgroundColor: "rgba(61,214,140,0.08)",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#3dd68c",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expense",
        data: expenses,
        borderColor: "#f25f5c",
        backgroundColor: "rgba(242,95,92,0.08)",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#f25f5c",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "var(--text-secondary, #8892aa)",
          font: { family: "'Outfit', sans-serif", size: 11 },
          boxWidth: 12,
          boxHeight: 12,
          padding: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
        backgroundColor: "rgba(17,21,32,0.95)",
        titleColor: "#f0f2f8",
        bodyColor: "#8892aa",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "var(--text-muted, #4d566b)", font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid:  { color: "rgba(255,255,255,0.05)" },
        ticks: {
          color: "var(--text-muted, #4d566b)",
          font: { size: 10 },
          callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "K" : v}`,
        },
      },
    },
  };

  if (dailyData.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "40px 20px" }}>
        <div className="emoji">📉</div>
        <p>No trend data yet</p>
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
}
