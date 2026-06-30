# Expense Tracker (React + PostgreSQL)

A full-stack expense tracker: React (Vite) frontend, Express REST API, PostgreSQL database.

## Structure
```
expense-tracker/
  backend/    Express API + PostgreSQL access
  frontend/   React (Vite) UI
```

## Features
- Add, edit, delete expenses
- Categorize expenses, filter by category/date/search text
- Running total and per-category breakdown

## Quick start with Docker

The fastest way to run everything (Postgres + API + UI) is Docker Compose:

```bash
docker compose up --build
```

This will:
- Start PostgreSQL and automatically load `backend/schema.sql` on first run
- Build and start the backend API on `http://localhost:5000`
- Build and start the frontend (served by nginx) on `http://localhost:8080`

The frontend's nginx config proxies `/api` requests to the backend container, so no extra configuration is needed. Stop everything with `Ctrl+C`, or `docker compose down` (add `-v` to also wipe the database volume).

To rebuild after code changes: `docker compose up --build`.

---

## Manual setup (without Docker)

### 1. Database setup

Create a PostgreSQL database and load the schema:

```bash
createdb expense_tracker
psql -d expense_tracker -f backend/schema.sql
```

(Adjust connection details to your environment — host, user, password.)

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # edit with your DB credentials
npm install
npm run dev             # or: npm start
```

The API runs on `http://localhost:5000` by default. Key endpoints:

- `GET /api/categories`
- `GET /api/expenses` (filters: `category_id`, `from`, `to`, `search`)
- `GET /api/expenses/summary` (filters: `from`, `to`)
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend (see `vite.config.js`).

### 4. Production build

```bash
cd frontend
npm run build
```
Serve the resulting `dist/` folder with any static host, or wire it into the Express server with `express.static`.

## Notes
- Amounts are stored as `NUMERIC(10,2)`.
- `category_id` is nullable; deleting a category sets related expenses to "Uncategorized" rather than deleting them.
- For production, set proper `DATABASE_URL`/SSL options for your Postgres host (e.g. add `?sslmode=require` for managed providers like Render/Heroku/Supabase, and pass `ssl: { rejectUnauthorized: false }` in `db.js` if required).

## AI editor + GitHub workflow (branch → PR → review → merge)

This repo ships with a shared MCP config (`.mcp.json`) so any MCP-compatible
AI editor can create branches, open PRs, leave reviews, and merge — directly
from your editor. See [MCP_SETUP.md](./MCP_SETUP.md) for setup steps.
