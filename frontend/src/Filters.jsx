import React from 'react';

export default function Filters({ categories, filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters">
      <input
        name="search"
        placeholder="Search title..."
        value={filters.search}
        onChange={handleChange}
      />
      <select name="category_id" value={filters.category_id} onChange={handleChange}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input name="from" type="date" value={filters.from} onChange={handleChange} />
      <input name="to" type="date" value={filters.to} onChange={handleChange} />
    </div>
  );
}
