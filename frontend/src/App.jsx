import React, { useEffect, useState, useCallback } from 'react';
import { api } from './api';
import ExpenseForm from './ExpenseForm.jsx';
import ExpenseList from './ExpenseList.jsx';
import Summary from './Summary.jsx';
import Filters from './Filters.jsx';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, byCategory: [] });
  const [filters, setFilters] = useState({ category_id: '', from: '', to: '', search: '' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    const data = await api.getCategories();
    setCategories(data);
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expenseData, summaryData] = await Promise.all([
        api.getExpenses(filters),
        api.getSummary({ from: filters.from, to: filters.to }),
      ]);
      setExpenses(expenseData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories().catch((err) => setError(err.message));
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleSave = async (data) => {
    if (editingExpense) {
      await api.updateExpense(editingExpense.id, data);
    } else {
      await api.createExpense(data);
    }
    setEditingExpense(null);
    await loadExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await api.deleteExpense(id);
    await loadExpenses();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="app-main">
        <section className="panel">
          <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
          <ExpenseForm
            categories={categories}
            initialData={editingExpense}
            onSave={handleSave}
            onCancel={() => setEditingExpense(null)}
          />
        </section>

        <section className="panel">
          <Summary summary={summary} />
        </section>

        <section className="panel panel-wide">
          <h2>Expenses</h2>
          <Filters categories={categories} filters={filters} onChange={setFilters} />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
