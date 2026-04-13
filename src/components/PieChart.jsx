/**
 * components/PieChart.jsx
 * Category-wise expense pie chart using Chart.js
 */

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { categoryColor } from "../utils/helpers";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "40px 20px" }}>
        <div className="emoji">🥧</div>
        <p>No expense data for this period</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => categoryColor(d._id) + "cc"), // add alpha
        borderColor:     data.map((d) => categoryColor(d._id)),
        borderWidth: 1.5,
        hoverBorderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text-secondary, #8892aa)",
          font: { family: "'Outfit', sans-serif", size: 11 },
          padding: 14,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ₹${ctx.parsed.toLocaleString("en-IN")} (${pct}%)`;
          },
        },
        backgroundColor: "rgba(17,21,32,0.95)",
        titleColor: "#f0f2f8",
        bodyColor: "#8892aa",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}
