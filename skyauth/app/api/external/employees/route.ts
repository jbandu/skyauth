import { NextResponse } from "next/server";
import { and, eq, sql, type SQL } from "drizzle-orm";

import { validateApiKey } from "@/lib/api/keys";
import { getDb, employees } from "@/lib/db";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  const { searchParams } = new URL(request.url);

  const airlineId = searchParams.get("airline_id") ?? undefined;
  const departmentId = searchParams.get("department") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") ?? 50), 100);
  const offset = (Math.max(page, 1) - 1) * pageSize;

  if (!validateApiKey(apiKey, searchParams.get("airline_code") ?? undefined)) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const db = getDb();
  let whereClause: SQL<unknown> | undefined;

  const appendClause = (clause: SQL<unknown>) => {
    whereClause = whereClause ? and(whereClause, clause) : clause;
  };

  if (airlineId) {
    appendClause(eq(employees.airlineId, airlineId));
  }
  if (departmentId) {
    appendClause(eq(employees.departmentId, departmentId));
  }
  if (status) {
    appendClause(eq(employees.status, status));
  }

  let listQuery = db
    .select({
      id: employees.id,
      firstName: employees.firstName,
      lastName: employees.lastName,
      displayName: employees.displayName,
      email: employees.email,
      title: employees.title,
      status: employees.status,
      departmentId: employees.departmentId,
      airlineId: employees.airlineId,
      baseLocation: employees.baseLocation,
    })
    .from(employees);

  let countQuery = db.select({ count: sql<number>`count(*)` }).from(employees);

  if (whereClause) {
    listQuery = listQuery.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const results = await listQuery.limit(pageSize).offset(offset);
  const [{ count }] = await countQuery;

  return NextResponse.json({
    employees: results,
    total: Number(count ?? 0),
    page: Math.max(page, 1),
    pageSize,
  });
}
