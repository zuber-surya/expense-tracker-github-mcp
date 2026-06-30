import React, { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  amount: '',
  category_id: '',
  expense_date: new Date().toISOString().slice(0, 10),
  notes: '',
  recurrence_interval: '',
  recurrence_period: '',
  recurrence_end_date: '',
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
        recurrence_interval: initialData.recurrence_interval ?? '',
        recurrence_period: initialData.recurrence_period || '',
        recurrence_end_date: initialData.recurrence_end_date || '',
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
      const submitData = {
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id || null,
        recurrence_interval: form.recurrence_interval ? parseInt(form.recurrence_interval, 10) : null,
        recurrence_period: form.recurrence_period || null,
        recurrence_end_date: form.recurrence_end_date || null,
      };
      await onSave(submitData);
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

      <fieldset className="recurrence-fields">
        <legend>Recurrence (optional)</legend>
        <div>
          <label>
            Repeats every:
            <input
              name="recurrence_interval"
              type="number"
              min="1"
              value={form.recurrence_interval}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Period:
            <select name="recurrence_period" value={form.recurrence_period} onChange={handleChange}>
              <option value="">None</option>
              <option value="day">Day(s)</option>
              <option value="week">Week(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Ends on:
            <input
              name="recurrence_end_date"
              type="date"
              value={form.recurrence_end_date}
              onChange={handleChange}
            />
          </label>
        </div>
      </fieldset>

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