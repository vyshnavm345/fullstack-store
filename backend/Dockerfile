FROM python:3.11-slim

# Install dependencies for psycopg2 and netcat
RUN apt-get update && apt-get install -y \
    netcat-openbsd gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Ensure entrypoint script has execution permission
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Default command
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
