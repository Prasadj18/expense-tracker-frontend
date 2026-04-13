/**
 * components/InsightsPanel.jsx
 * Renders AI-generated spending insights from /api/insights
 */

export default function InsightsPanel({ insights = [], loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Analysing your spending…
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="empty-state">
        <div className="emoji">🔍</div>
        <p>No insights available yet. Add more transactions to get started.</p>
      </div>
    );
  }

  return (
    <div className="insights-list">
      {insights.map((insight, i) => (
        <div key={i} className={`insight-item ${insight.severity}`}>
          <div className="insight-icon">{insight.icon}</div>
          <div>
            <div className="insight-title">{insight.title}</div>
            <div className="insight-msg">{insight.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
