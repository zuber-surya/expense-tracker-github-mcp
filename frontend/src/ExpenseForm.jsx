import React, { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  amount: '',
  category_id: '',
  expense_date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function ExpenseForm({ categories, initialData, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount,
        category_id: initialData.category_id || '',
        expense_date: initialData.expense_date?.slice(0, 10) || emptyForm.expense_date,
        notes: initialData.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id || null,
      });
      if (!initialData) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Amount
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category
        <select name="category_id" value={form.category_id} onChange={handleChange}>
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          name="expense_date"
          type="date"
          value={form.expense_date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {initialData ? 'Update' : 'Add'} Expense
        </button>
        {initialData && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
