/**
 * pages/Insights.jsx
 * Dedicated full-page smart insights view
 */

import { useState, useEffect } from "react";
import { getInsights } from "../api/api";
import InsightsPanel from "../components/InsightsPanel";
import { useToast } from "../context/ToastContext";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await getInsights();
        setInsights(data.data);
      } catch {
        addToast("Failed to load insights", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // eslint-disable-line

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💡 Smart Insights</h1>
        <button
          className="btn btn-secondary"
          onClick={() => { setLoading(true); window.location.reload(); }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Explainer banner */}
      <div
        className="card-sm mb-24"
        style={{ background: "var(--blue-dim)", borderColor: "rgba(92,154,245,0.2)" }}
      >
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          🤖 ExpenseIQ analyses your spending behaviour and generates personalised insights.
          Insights are refreshed in real-time based on your latest transactions.
        </p>
      </div>

      <div className="card">
        <InsightsPanel insights={insights} loading={loading} />
      </div>
    </div>
  );
}
