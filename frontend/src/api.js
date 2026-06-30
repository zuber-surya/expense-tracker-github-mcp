const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getCategories: () => fetch(`${BASE}/categories`).then(handle),

  getExpenses: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return fetch(`${BASE}/expenses${qs ? `?${qs}` : ''}`).then(handle);
  },

  getSummary: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return fetch(`${BASE}/expenses/summary${qs ? `?${qs}` : ''}`).then(handle);
  },

  createExpense: (data) =>
    fetch(`${BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handle),

  updateExpense: (id, data) =>
    fetch(`${BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handle),

  deleteExpense: (id) =>
    fetch(`${BASE}/expenses/${id}`, { method: 'DELETE' }).then(handle),
};
