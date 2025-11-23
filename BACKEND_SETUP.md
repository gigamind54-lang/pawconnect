# PawConnect Backend Setup Guide

## ✅ Completed Steps

1. ✅ Installed backend dependencies
2. ✅ Created database schema (`lib/schema.sql`)
3. ✅ Created database connection (`lib/db.js`)
4. ✅ Created auth utilities (`lib/auth.js`)
5. ✅ Created auth API routes:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET /api/auth/me`

---

## 🚀 Next Steps: Set Up Vercel Postgres

### 1. Create Vercel Postgres Database

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., `pawconnect-db`)
7. Select region (closest to your users)
8. Click **Create**

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Postgres database
vercel postgres create
```

### 2. Get Database Credentials

After creating the database:
1. Go to your database in Vercel Dashboard
2. Click on **".env.local"** tab
3. Copy all the environment variables

### 3. Set Up Local Environment

1. Create `.env.local` file in your project root:
```bash
cp env.example .env.local
```

2. Paste the Vercel Postgres variables into `.env.local`
3. Add a secure JWT secret:
```env
JWT_SECRET="your-super-secret-random-string-here"
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run Database Migrations

**Option A: Using Vercel Postgres SQL Editor**
1. Go to your Postgres database in Vercel Dashboard
2. Click **Query** tab
3. Paste the contents of `lib/schema.sql`
4. Click **Run**

**Option B: Using a PostgreSQL client**
```bash
# Install psql (if not installed)
# macOS: brew install postgresql
# Windows: Download from postgresql.org

# Connect to your database
psql "YOUR_POSTGRES_URL_FROM_ENV"

# Run schema
\i lib/schema.sql
```

**Option C: Programmatically (after .env.local is set up)**
```javascript
// Create a setup script: scripts/setup-db.js
import { sql } from '@vercel/postgres';
import fs from 'fs';

const schema = fs.readFileSync('./lib/schema.sql', 'utf8');
await sql.query(schema);
console.log('Database schema created!');
process.exit(0);
```

Then run:
```bash
node scripts/setup-db.js
```

---

## 🧪 Test the API

### Start Development Server
```bash
npm run dev
```

### Test Endpoints

**1. Register a User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "location": "New York"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Get Current User** (use token from login)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 What's Next

After database setup, I'll create:
1. Posts API routes (GET, POST, UPDATE, DELETE)
2. Likes API
3. Update frontend to use API instead of localStorage
4. Deploy to Vercel

---

## ❗ Important Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- Use the `env.example` file as a template
- JWT_SECRET should be different in production
- Database variables are automatically set in Vercel when you deploy

---

## 🆘 Troubleshooting

**Connection Error:**
- Verify `.env.local` has correct database credentials
- Check if database is active in Vercel Dashboard

**Migration Error:**
- Make sure UUID extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- Run migrations one statement at a time if batch fails

**Auth Error:**
- Verify JWT_SECRET is set in `.env.local`
- Check token format: `Bearer <token>`
