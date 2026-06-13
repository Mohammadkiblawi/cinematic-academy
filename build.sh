#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_courses 
python manage.py createsuperuser --noinput --username admin --email admin@example.com || true