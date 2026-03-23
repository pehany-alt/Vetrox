# Vetrox PPF Website - Self-Hosting Deployment Guide

This guide provides step-by-step instructions to deploy the Vetrox PPF website on your own server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Option A: Deploy on VPS (Ubuntu/Debian)](#option-a-deploy-on-vps-ubuntudebian)
4. [Option B: Deploy on cPanel/Shared Hosting](#option-b-deploy-on-cpanelshared-hosting)
5. [Option C: Deploy with Docker](#option-c-deploy-with-docker)
6. [Environment Variables](#environment-variables)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** and **Yarn** (for frontend)
- **MongoDB** (local or cloud like MongoDB Atlas)
- **Domain name** (optional but recommended)
- **SSL certificate** (for HTTPS)

---

## Project Structure

```
vetrox-ppf/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment variables
├── frontend/
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── .env                # Frontend environment variables
└── README.md
```

---

## Option A: Deploy on VPS (Ubuntu/Debian)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx certbot python3-certbot-nginx

# Install Yarn
npm install -g yarn

# Install MongoDB (or use MongoDB Atlas cloud)
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 2: Upload Your Code

```bash
# Create application directory
sudo mkdir -p /var/www/vetrox
cd /var/www/vetrox

# Upload your code via SCP, FTP, or Git
# Example with SCP:
# scp -r ./backend ./frontend user@your-server:/var/www/vetrox/
```

### Step 3: Setup Backend

```bash
cd /var/www/vetrox/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create/Edit environment file
nano .env
```

Add to `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=vetrox_db
CORS_ORIGINS=https://yourdomain.com
GMAIL_ADDRESS=rashaysharbour@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
ADMIN_EMAIL=admin@vetrox.com
```

### Step 4: Setup Frontend

```bash
cd /var/www/vetrox/frontend

# Install dependencies
yarn install

# Edit environment file
nano .env
```

Add to `.env`:
```
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Build for production:
```bash
yarn build
```

### Step 5: Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/vetrox-backend.service
```

Add:
```ini
[Unit]
Description=Vetrox PPF Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vetrox/backend
Environment="PATH=/var/www/vetrox/backend/venv/bin"
ExecStart=/var/www/vetrox/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable vetrox-backend
sudo systemctl start vetrox-backend
```

### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/vetrox
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/vetrox/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/vetrox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to complete SSL setup.

---

## Option B: Deploy on cPanel/Shared Hosting

**Note:** Shared hosting has limitations. You may need a VPS for full functionality.

### Step 1: Build Frontend Locally

```bash
cd frontend

# Edit .env with your backend URL
echo "REACT_APP_BACKEND_URL=https://yourdomain.com" > .env

# Build
yarn install
yarn build
```

### Step 2: Upload Frontend

1. Log into cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Upload contents of `frontend/build/` folder

### Step 3: Setup Backend (if Python supported)

1. In cPanel, go to **Setup Python App**
2. Create new application:
   - Python version: 3.9+
   - Application root: `backend`
   - Application URL: `api.yourdomain.com` or `yourdomain.com/api`
3. Upload backend files
4. Install requirements via terminal or cPanel

### Step 4: Configure .htaccess for React Router

Create `.htaccess` in `public_html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Option C: Deploy with Docker

### Step 1: Create Dockerfile for Backend

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Step 2: Create Dockerfile for Frontend

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 3: Create Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    restart: always

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=vetrox_db
      - CORS_ORIGINS=http://localhost,https://yourdomain.com
      - GMAIL_ADDRESS=rashaysharbour@gmail.com
      - GMAIL_APP_PASSWORD=your_app_password
      - ADMIN_EMAIL=admin@vetrox.com
    depends_on:
      - mongodb
    restart: always

  frontend:
    build: 
      context: ./frontend
      args:
        - REACT_APP_BACKEND_URL=https://yourdomain.com
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  mongo_data:
```

### Step 4: Deploy with Docker

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `vetrox_db` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `https://vetrox.com.au` |
| `GMAIL_ADDRESS` | Gmail for sending emails | `rashaysharbour@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |
| `ADMIN_EMAIL` | Email to receive enquiries | `admin@vetrox.com` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://vetrox.com.au` |

---

## Domain & SSL Setup

### DNS Configuration

Add these DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | Your server IP |
| A | www | Your server IP |
| CNAME | www | yourdomain.com |

### SSL with Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs automatically)
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Backend not starting
```bash
# Check logs
sudo journalctl -u vetrox-backend -f

# Check if port is in use
sudo lsof -i :8001
```

### Frontend not loading
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t
```

### Emails not sending
1. Verify Gmail App Password is correct (16 characters, no spaces in .env)
2. Ensure "Less secure apps" or App Passwords are enabled
3. Check backend logs for SMTP errors

### MongoDB connection issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Test connection
mongosh
```

### CORS errors
- Ensure `CORS_ORIGINS` in backend `.env` includes your frontend domain
- Include both `http://` and `https://` versions if needed

---

## Quick Commands Reference

```bash
# Restart backend
sudo systemctl restart vetrox-backend

# Restart Nginx
sudo systemctl restart nginx

# View backend logs
sudo journalctl -u vetrox-backend -f

# Rebuild frontend
cd /var/www/vetrox/frontend && yarn build

# Check services status
sudo systemctl status vetrox-backend nginx mongodb
```

---

## Support

For issues with this deployment guide, refer to:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Vetrox PPF** - Premium Paint Protection Film | Made in Australia 🇦🇺
