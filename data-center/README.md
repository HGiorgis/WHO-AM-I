# Data Center (Portfolio Backend)

Django API for the portfolio: owner dashboard (key auth), projects CRUD, and visitor analytics.

## Setup

```bash
cd data-center
python -m venv venv
venv\Scripts\activate   # Windows
pip install django djangorestframework django-cors-headers
```

## Environment

- **OWNER_KEY** – Key required to access `/api/owner/*`. Set in env or in `config/settings.py` (default in dev: `owner-dev-key`).

  ```bash
  set OWNER_KEY=your-secret-key
  ```

## Run

```bash
python manage.py migrate
python manage.py runserver 8000
```

API base: `http://localhost:8000/api/`

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/owner/validate` | — | Body: `{ "key": "..." }` → `{ "valid": true }` |
| GET | `/api/owner/projects` | Owner key | List projects |
| POST | `/api/owner/projects` | Owner key | Create project |
| PATCH | `/api/owner/projects/<id>` | Owner key | Update project |
| DELETE | `/api/owner/projects/<id>` | Owner key | Delete project |
| GET | `/api/owner/visitors?period=day\|week\|month\|year` | Owner key | Visitor stats |
| GET | `/api/owner/visitors/events?period=...` | Owner key | Visitor events |
| GET | `/api/projects` | — | Public list of projects (for portfolio site) |
| POST | `/api/track` | — | Track page view or event (body: sessionId, type, path, target) |
| POST | `/api/track/leave` | — | Track leave (body: sessionId, path, durationSeconds) |

Owner key is sent as header: `X-Owner-Key: <key>` or `Authorization: Key <key>`.

## Frontend

In the main app (whoami) set:

```
VITE_OWNER_API_URL=http://localhost:8000/api
```

Then the owner dashboard (`/owner`) and tracking use this backend.
