import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Provide helpful error message with context
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PHASE: process.env.NEXT_PHASE,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT ? "set" : "not set",
      VERCEL: process.env.VERCEL ? "set" : "not set",
    };
    
    const errorMessage = 
      "DATABASE_URL is not set in the current environment.\n" +
      `Environment context: ${JSON.stringify(envInfo, null, 2)}\n` +
      "Please ensure DATABASE_URL is set in your environment variables.\n" +
      "For Railway deployments, make sure DATABASE_URL is configured in your service settings.";
    
    throw new Error(errorMessage);
  }

  const sql = neon(databaseUrl);
  cachedDb = drizzle(sql, { schema });
  return cachedDb;
}

export type DatabaseInstance = ReturnType<typeof getDb>;
export * from "./schema";
