# Getting Started

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (`npm install -g pnpm`)
- A **Supabase** account (free tier)
- A **Google AI Studio** account (free tier)
- A **Sentry** account (free tier, optional)

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd resona
pnpm install
```

## Step 2: Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Auth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Supabase (from dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
GEMINI_API_KEY=AIzaSy...

# Monitoring (optional)
SENTRY_DSN=https://...
```

See [INFRASTRUCTURE_SETUP.md](./INFRASTRUCTURE_SETUP.md) for detailed instructions on obtaining each key.

## Step 3: Database Setup

1. Open your Supabase dashboard → **SQL Editor**
2. Copy the contents of `db/migrations/0000_supabase_setup.sql`
3. Paste and run
4. Verify with:
   ```sql
   SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```

## Step 4: Run the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Step 5: Verify

```bash
# Build check
pnpm build

# Test suite
pnpm test
```

Both should pass with no errors.

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the data pipeline
- Read [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) to customize the UI
- Read [API_REFERENCE.md](./API_REFERENCE.md) for API endpoint details
