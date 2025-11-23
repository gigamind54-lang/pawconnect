# Deploy PawConnect to Vercel

Complete guide to deploy PawConnect to your Vercel account with PostgreSQL database.

---

## Step 1: Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

---

## Step 2: Login to Your Vercel Account

```bash
vercel login
```

This will open your browser. **Login with your desired Vercel account** (the one you want to use for this project).

---

## Step 3: Link Project to Vercel

```bash
cd /Users/anupam/.gemini/antigravity/scratch/pet-community
vercel link
```

**Follow the prompts:**
1. **Set up and deploy?** → Yes
2. **Which scope?** → Choose your account/team
3. **Link to existing project?** → No (create new)
4. **Project name?** → `pawconnect` (or your preferred name)
5. **Directory?** → `.` (current directory)

---

## Step 4: Create Neon PostgreSQL Database in Vercel

### Option A: Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **pawconnect** project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Neon** (Serverless Postgres)
6. Name it: `pawconnect-production-db`
7. Choose region closest to your users
8. Click **Create**

### Option B: Via CLI
```bash
vercel postgres create pawconnect-production-db
```

---

## Step 5: Connect Database to Your Project

In the Vercel dashboard:
1. Go to your **pawconnect** project
2. Click **Storage** tab
3. Click your database name
4. Click **Connect Project**
5. Select your **pawconnect** project
6. Click **Connect**

This automatically adds all `POSTGRES_*` environment variables to your project!

---

## Step 6: Set JWT Secret Environment Variable

You need to manually add the JWT secret:

### Via Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Key**: `JWT_SECRET`
   - **Value**: `a263315a2d1bdf8021b88974ed7e0bb451c3a3000ebfc6257a11d31a0c3f2acd`
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### Via CLI:
```bash
vercel env add JWT_SECRET
# Paste: a263315a2d1bdf8021b88974ed7e0bb451c3a3000ebfc6257a11d31a0c3f2acd
# Select all environments
```

---

## Step 7: Run Database Schema

After database is created, run the schema:

1. Go to Vercel Dashboard → Your database
2. Click **Query** tab
3. Open `lib/schema.sql` in your code editor
4. Copy ALL contents
5. Paste into the Query editor
6. Click **Run**

You should see: "Query executed successfully"

---

## Step 8: Deploy to Vercel

### Deploy to Production:
```bash
vercel --prod
```

**OR** just push to GitHub and Vercel will auto-deploy (if you set up Git integration).

### Deploy to Preview:
```bash
vercel
```

---

## Step 9: Test Your Deployment

After deployment, you'll get a URL like:
- Production: `https://pawconnect.vercel.app`
- Preview: `https://pawconnect-xyz123.vercel.app`

### Test the deployed app:
1. Open the URL in your browser
2. Click **Login / Register**
3. Create a new account
4. Try creating a post
5. Verify it's saved to the database

---

## Environment Variables Summary

Your Vercel project should have these environment variables (auto-added by connecting database):

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

Plus manually added:
```
JWT_SECRET
JWT_EXPIRES_IN (optional, defaults to "7d")
```

---

## Verify Environment Variables

```bash
vercel env ls
```

Should show all variables for Production, Preview, and Development.

---

## Pull Environment Variables Locally (Optional)

If you want to sync Vercel's env vars to your local `.env.local`:

```bash
vercel env pull .env.local
```

---

## Troubleshooting

### Database Connection Error
- Check env variables are set in Vercel dashboard
- Verify database is connected to your project
- Check database is active (not paused)

### Deployment Failed
```bash
# Check deployment logs
vercel logs
```

### Schema Migration Failed
- Run schema in smaller chunks
- Check for syntax errors in `lib/schema.sql`

---

## Next Steps After Deployment

1. ✅ Test user registration
2. ✅ Test creating posts
3. ✅ Test likes functionality
4. ✅ Share your live URL!

Your app will be live at: `https://pawconnect.vercel.app` (or your custom domain)
