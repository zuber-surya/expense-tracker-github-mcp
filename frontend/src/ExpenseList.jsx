import React from 'react';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Notes</th>
          <th>Recur</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e.id}>
            <td>{e.expense_date?.slice(0, 10)}</td>
            <td>{e.title}</td>
            <td>{e.category_name || 'Uncategorized'}</td>
            <td>${Number(e.amount).toFixed(2)}</td>
            <td className="notes-cell">{e.notes}</td>
            <td>{e.recurrence_interval !== null ? 'Yes' : ''}</td>
            <td className="row-actions">
              <button onClick={() => onEdit(e)}>Edit</button>
              <button className="danger" onClick={() => onDelete(e.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}