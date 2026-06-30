-- Run this against your PostgreSQL database to set up the schema
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name) VALUES
  ('Food'), ('Transport'), ('Housing'), ('Utilities'),
  ('Entertainment'), ('Health'), ('Shopping'), ('Other')
ON CONFLICT (name) DO NOTHING;
