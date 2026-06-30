require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Categories ----------
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ---------- Expenses ----------

// List expenses (with optional filters: category_id, from, to, search)
app.get('/api/expenses', async (req, res) => {
  try {
    const { category_id, from, to, search } = req.query;
    const conditions = [];
    const values = [];

    if (category_id) {
      values.push(category_id);
      conditions.push(`e.category_id = $${values.length}`);
    }
    if (from) {
      values.push(from);
      conditions.push(`e.expense_date >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      conditions.push(`e.expense_date <= $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`e.title ILIKE $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT e.id, e.title, e.amount, e.expense_date, e.notes,
             e.category_id, c.name AS category_name
      FROM expenses e
      LEFT JOIN categories c ON c.id = e.category_id
      ${where}
      ORDER BY e.expense_date DESC, e.id DESC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Summary: total + breakdown by category (optionally within a date range)
app.get('/api/expenses/summary', async (req, res) => {
  try {
    const { from, to } = req.query;
    const conditions = [];
    const values = [];

    if (from) {
      values.push(from);
      conditions.push(`e.expense_date >= $${values.length}`);
    }
    if (to) {
      values.push(to);
      conditions.push(`e.expense_date <= $${values.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM expenses e ${where}`,
      values
    );

    const byCategoryResult = await pool.query(
      `SELECT c.name AS category, COALESCE(SUM(e.amount), 0) AS total
       FROM expenses e
       LEFT JOIN categories c ON c.id = e.category_id
       ${where}
       GROUP BY c.name
       ORDER BY total DESC`,
      values
    );

    res.json({
      total: Number(totalResult.rows[0].total),
      byCategory: byCategoryResult.rows.map((r) => ({
        category: r.category || 'Uncategorized',
        total: Number(r.total),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Create expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { title, amount, category_id, expense_date, notes } = req.body;
    if (!title || amount === undefined || amount === null) {
      return res.status(400).json({ error: 'title and amount are required' });
    }

    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category_id, expense_date, notes)
       VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5)
       RETURNING *`,
      [title, amount, category_id || null, expense_date || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category_id, expense_date, notes } = req.body;

    const result = await pool.query(
      `UPDATE expenses
       SET title = $1, amount = $2, category_id = $3, expense_date = $4, notes = $5
       WHERE id = $6
       RETURNING *`,
      [title, amount, category_id || null, expense_date, notes || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
