import React from 'react';

export default function Summary({ summary }) {
  return (
    <div className="summary">
      <h2>Summary</h2>
      <p className="summary-total">Total: ${summary.total.toFixed(2)}</p>
      <ul className="summary-breakdown">
        {summary.byCategory.map((c) => (
          <li key={c.category}>
            <span>{c.category}</span>
            <span>${c.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
