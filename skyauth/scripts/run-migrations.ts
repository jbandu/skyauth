#!/usr/bin/env tsx
/**
 * Migration runner script for Railway deployment
 * Runs pending migrations before starting the application
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const MIGRATIONS_DIR = join(process.cwd(), "lib/db/migrations");

interface MigrationFile {
  name: string;
  path: string;
}

function getMigrationFiles(): MigrationFile[] {
  try {
    const files = readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    return files.map((file) => ({
      name: file,
      path: join(MIGRATIONS_DIR, file),
    }));
  } catch (error) {
    console.error("Error reading migrations directory:", error);
    return [];
  }
}

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔄 Starting database migrations...");

  const sql = neon(databaseUrl);
  const migrationFiles = getMigrationFiles();

  if (migrationFiles.length === 0) {
    console.log("⚠️  No migration files found. Skipping migrations.");
    return;
  }

  console.log(`📦 Found ${migrationFiles.length} migration file(s)`);

  // Check if migrations table exists
  try {
    await sql`SELECT 1 FROM information_schema.tables WHERE table_name = '__drizzle_migrations' LIMIT 1`;
  } catch (error) {
    // Table doesn't exist, create it
    console.log("📋 Creating migrations tracking table...");
    await sql`
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `;
  }

  // Get already applied migrations
  const appliedMigrations = await sql<{ hash: string }[]>`
    SELECT hash FROM __drizzle_migrations ORDER BY created_at
  `;
  const appliedHashes = new Set(appliedMigrations.map((m) => m.hash));

  let appliedCount = 0;

  for (const migration of migrationFiles) {
    const migrationContent = readFileSync(migration.path, "utf-8");
    const migrationHash = migration.name; // Use filename as hash identifier

    if (appliedHashes.has(migrationHash)) {
      console.log(`⏭️  Skipping already applied migration: ${migration.name}`);
      continue;
    }

    console.log(`▶️  Running migration: ${migration.name}`);

    try {
      // Split by statement-breakpoint and execute each statement
      const statements = migrationContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await sql.unsafe(statement);
        }
      }

      // Record migration as applied
      await sql`
        INSERT INTO __drizzle_migrations (hash, created_at)
        VALUES (${migrationHash}, ${Date.now()})
      `;

      appliedCount++;
      console.log(`✅ Successfully applied migration: ${migration.name}`);
    } catch (error) {
      console.error(`❌ Error applying migration ${migration.name}:`, error);
      throw error;
    }
  }

  if (appliedCount === 0) {
    console.log("✨ All migrations are already applied. Database is up to date.");
  } else {
    console.log(`✨ Successfully applied ${appliedCount} migration(s)`);
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log("🎉 Migration process completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration process failed:", error);
    process.exit(1);
  });
