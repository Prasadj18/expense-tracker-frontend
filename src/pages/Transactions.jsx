/**
 * pages/Transactions.jsx
 * Full transaction list with search, filter, delete, and CSV export
 */

import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import TransactionTable from "../components/TransactionTable";

export default function Transactions() {
  const navigate = useNavigate();

  const {
    transactions,
    loading,
    filters,
    setFilters,
    removeTransaction,
  } = useTransactions();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add")}
        >
          + Add New
        </button>
      </div>

      <div className="card">
        <TransactionTable
          transactions={transactions}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
          onDelete={removeTransaction}
        />
      </div>
    </div>
  );
}
