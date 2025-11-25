import "server-only";

import { sql } from "drizzle-orm";
import { getDb } from "./index";

export interface DatabaseHealth {
  connected: boolean;
  tablesExist: boolean;
  tableCount: number;
  error?: string;
}

/**
 * Check database health and connectivity
 * Returns information about database connection and table existence
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    const db = getDb();
    
    // Try to query the database to check connectivity
    // Using a simple query first to verify connection
    await db.execute(sql`SELECT 1`);

    // Get table count
    const countResult = await db.execute<{ count: string }>(
      sql`SELECT COUNT(*)::text as count 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'`
    );

    const tableCount = parseInt(countResult.rows[0]?.count || "0", 10);
    const expectedTables = [
      "airlines",
      "departments",
      "employees",
      "roles",
      "employee_roles",
      "org_chart_positions",
      "time_off_requests",
      "employee_documents",
      "onboarding_checklists",
      "auth_sessions",
      "audit_logs",
    ];

    // Check if all expected tables exist
    const tablesResult = await db.execute<{ table_name: string }>(
      sql`SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'`
    );

    const existingTables = tablesResult.rows.map((row) => row.table_name);
    const tablesExist = expectedTables.every((table) =>
      existingTables.includes(table)
    );

    return {
      connected: true,
      tablesExist,
      tableCount,
    };
  } catch (error) {
    return {
      connected: false,
      tablesExist: false,
      tableCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
