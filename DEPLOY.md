# Deploy Whoami (Frontend + Backend in one container)

One repo, one Docker image: Vite/React frontend + Django API. Same env for both.

## Troubleshooting Render

- **Exited with status 128** — often the container had no valid start command. This repo uses `CMD ["/bin/sh", "/app/scripts/run.sh"]`; ensure your `Dockerfile` matches if you customized it.
- If deploy still fails, check logs for `migrate` or `gunicorn` errors (e.g. missing `SECRET_KEY` or **`DATABASE_URL`** when `DEBUG` is off).

## Quick start (local Docker)

```bash
# Build
docker build -t whoami .

# Run (use your own keys)
docker run -p 8000:8000 \
  -e SECRET_KEY=your-secret-key \
  -e OWNER_KEY=your-owner-key \
  whoami
```

Open http://localhost:8000 — site and API at `/api/`.

Optional: copy `.env.example` to `.env` and run with `--env-file .env`.

## Deploy to Render (free tier)

1. Push this repo to GitHub/GitLab and connect it in [Render Dashboard](https://dashboard.render.com/).
2. **New → Web Service**, select the repo.
3. Set **Environment** to **Docker** (Render will use the root `Dockerfile`).
4. Add **Environment Variables** (or use the blueprint):
   - `SECRET_KEY` — generate or set a long random string.
   - `OWNER_KEY` — your secret for the owner dashboard (you choose).
   - **`DATABASE_URL`** — Postgres connection string from [Neon](https://neon.tech) (or Render Postgres). **Required**: on Render, `DEBUG` defaults to off, so Django uses Postgres only when `DATABASE_URL` is set.
   - Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SITE_URL` (e.g. `https://whoami-xxxx.onrender.com`).
   - Optional: `DEBUG=true` for debugging only (uses SQLite; not for production).
5. Deploy. Render sets `PORT` and `RENDER=true` automatically. Migrations run on container start (`run.sh`).

After deploy, set **SITE_URL** to your service URL (e.g. `https://whoami-xxxx.onrender.com`) so Telegram links and CORS work.

### Using the Blueprint

If your repo has `render.yaml`, you can use **Blueprint** when connecting the repo. Then set `OWNER_KEY` (and any optional vars) in the Dashboard; `SECRET_KEY` can be generated.

## One env file

- **Build (frontend):** `VITE_OWNER_API_URL` — use `/api` when frontend and backend are on the same host (Docker/Render). Set in Render env so the Docker build gets it.
- **Runtime (Django):** `SECRET_KEY`, `OWNER_KEY`, `TELEGRAM_*`, `SITE_URL`, etc. Same env in Render; Django reads them at startup.

## Database

- **`DEBUG=true` (local dev):** SQLite at `data-center/db.sqlite3`.
- **`DEBUG=false` (production / Render):** PostgreSQL via **`DATABASE_URL`** (`dj-database-url` + `psycopg2-binary`). Use Neon’s connection string; include `sslmode=require` if Neon shows it. Example:  
  `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
