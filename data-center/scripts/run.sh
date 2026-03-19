#!/bin/sh
set -e
cd /app
python manage.py migrate --noinput
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 2 --timeout 60 --access-logfile - --capture-output
