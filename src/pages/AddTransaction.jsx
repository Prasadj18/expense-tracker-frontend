/**
 * pages/AddTransaction.jsx
 * Page that hosts the transaction entry form
 */

import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";

export default function AddTransaction() {
  const navigate = useNavigate();

  // After a successful submission, redirect to Transactions list
  const handleSuccess = () => {
    setTimeout(() => navigate("/transactions"), 800);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Transaction</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Centred card */}
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="card">
          {/* Decorative header strip */}
          <div
            style={{
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h3 style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              Record a new income or expense entry
            </h3>
          </div>

          <TransactionForm onSuccess={handleSuccess} />
        </div>

        {/* Tip card */}
        <div
          className="card-sm mt-16"
          style={{ background: "var(--gold-dim)", borderColor: "rgba(245,200,66,0.2)" }}
        >
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            💡 <strong style={{ color: "var(--gold)" }}>Tip:</strong> Mark transactions as
            recurring to automatically generate monthly entries and keep your records accurate.
          </p>
        </div>
      </div>
    </div>
  );
}
