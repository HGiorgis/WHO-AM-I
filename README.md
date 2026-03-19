# Whoami

Portfolio site (React + Vite) with a Django API — backend architect, security, DevOps. One repo; run locally or deploy as a single Docker container.

## What’s in the repo

- **Frontend:** React, Vite, Tailwind — `src/`, `public/`, `index.html`
- **Backend:** Django API — `data-center/` (config, apps, manage.py)
- **Deploy:** One Dockerfile builds frontend and backend; one process serves both.

## Local development

### Frontend

```bash
npm install
npm run dev
```

Runs at http://localhost:5173. Set `VITE_OWNER_API_URL=http://localhost:8000/api` in `.env` so the app talks to the local API.

### Backend

```bash
cd data-center
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Runs at http://localhost:8000. API: http://localhost:8000/api/

Use one `.env` at repo root (or `data-center/.env`) for `SECRET_KEY`, `OWNER_KEY`, optional `TELEGRAM_*`, `SITE_URL`. Copy from `.env.example`.

## Docker (build and run)

```bash
docker build -t whoami .
docker run -p 8000:8000 -e SECRET_KEY=your-secret -e OWNER_KEY=your-owner-key whoami
```

Open http://localhost:8000 (site and API on the same port). Optional: `--env-file .env` instead of `-e`.

## Deploy to Render

1. Push the repo to GitHub and connect it in [Render](https://dashboard.render.com).
2. New **Web Service** → choose the repo → set **Environment** to **Docker**.
3. Add environment variables: `SECRET_KEY`, `OWNER_KEY`; optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SITE_URL`.
4. Deploy. After the first deploy, set `SITE_URL` to your service URL (e.g. `https://whoami-xxxx.onrender.com`).

See **[DEPLOY.md](./DEPLOY.md)** for more detail (Render blueprint, persistent disk, etc.).

## Environment variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `VITE_OWNER_API_URL` | Frontend (build) | API base; use `/api` for Docker/Render (same host). |
| `SECRET_KEY` | Django | Django secret (production). |
| `OWNER_KEY` | Django | Secret for owner dashboard login. |
| `TELEGRAM_BOT_TOKEN` | Django | Optional; Telegram notifications. |
| `TELEGRAM_CHAT_ID` | Django | Optional; Telegram chat/group. |
| `SITE_URL` | Django | Optional; public URL (e.g. for Telegram links). |

Copy `.env.example` to `.env` and fill as needed.

## Scripts

- `npm run dev` — frontend dev server
- `npm run build` — frontend production build
- `npm run preview` — preview production build locally
- `cd data-center && python manage.py runserver` — Django dev server
- `cd data-center && python manage.py seed_data` — seed sample data (optional `--clear`)

## License

Private / your choice.
