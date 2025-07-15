#!/bin/sh

echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo "from django.contrib.auth import get_user_model; \
User = get_user_model(); \
User.objects.filter(username='admin').exists() or \
User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" \
| python manage.py shell
# python manage.py createsuperuser --noinput --username admin --email admin@example.com || true

exec "$@"
