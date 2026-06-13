#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_courses 
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com'})
user.is_superuser = True
user.is_staff = True
user.set_password('$DJANGO_SUPERUSER_PASSWORD')
user.save()
print('Superuser ready:', user.username, 'created=' + str(created))
"