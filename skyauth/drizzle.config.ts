import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  tablesFilter: ["airlines", "departments", "employees", "roles", "employee_roles", "org_chart_positions", "time_off_requests", "employee_documents", "onboarding_checklists", "auth_sessions", "audit_logs"],
});
