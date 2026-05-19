Neon + Drizzle setup

This directory contains minimal scaffolding for using Drizzle ORM with a Neon/Postgres database.

Files:
- migrations/: place migration files here (drizzle will manage)
- schema/: generated schema files can live here

Quick start:
1. Set DATABASE_URL in your .env.local to your Neon connection string.
2. Install Drizzle and Neon client: `npm install drizzle-orm drizzle-kit pg`
3. Configure drizzle in package.json scripts or use the CLI. Migrations dir is db/migrations.
