/**
 * hooks/useTransactions.js
 * Custom hook — fetches, filters, and manages transaction state
 */

import { useState, useEffect, useCallback } from "react";
import { getTransactions, deleteTransaction } from "../api/api";
import { useToast } from "../context/ToastContext";

export function useTransactions(initialFilters = {}) {
  const [transactions, setTransactions]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [filters, setFilters]             = useState(initialFilters);
  const { addToast } = useToast();

  // Fetch transactions whenever filters change
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTransactions(filters);
      setTransactions(data.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load transactions";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [filters]); // eslint-disable-line

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Delete a transaction and refresh list
  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      addToast("Transaction deleted", "success");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  return {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchTransactions,
    removeTransaction,
  };
}
