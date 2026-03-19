# Whoami — single Docker image: frontend (Vite/React) + backend (Django).
# Build: docker build -t whoami .
# Run:   docker run -p 8000:8000 -e SECRET_KEY=xxx -e OWNER_KEY=xxx whoami
# Render: set env vars in dashboard; PORT is set automatically.

# -----------------------------------------------------------------------------
# Stage 1: Build frontend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# API base URL for same-origin deployment (Django serves both)
ARG VITE_OWNER_API_URL=/api
ENV VITE_OWNER_API_URL=${VITE_OWNER_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Backend + serve frontend
# -----------------------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install backend dependencies
COPY data-center/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY data-center/config ./config
COPY data-center/apps ./apps
COPY data-center/scripts ./scripts
COPY data-center/manage.py ./

# Copy built frontend into Django's frontend_dist (served at / and /assets/)
COPY --from=frontend-build /app/frontend/dist ./frontend_dist

# Collect Django static (admin, etc.)
RUN python manage.py collectstatic --noinput 2>/dev/null || true

# Startup: run migrations then gunicorn
RUN chmod +x /app/scripts/run.sh

EXPOSE 8000

CMD ["/app/run.sh"]
