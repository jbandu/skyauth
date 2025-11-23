import { NextResponse } from "next/server";
import { and, eq, ilike, or, type SQL } from "drizzle-orm";

import { validateApiKey } from "@/lib/api/keys";
import { getDb, employees } from "@/lib/db";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  const { searchParams } = new URL(request.url);
  const airlineId = searchParams.get("airline_id") ?? undefined;
  const query = searchParams.get("q") ?? "";

  if (!validateApiKey(apiKey, searchParams.get("airline_code") ?? undefined)) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  if (!query || query.length < 2) {
    return NextResponse.json({ employees: [], total: 0 });
  }

  const db = getDb();

  let whereClause: SQL<unknown> | undefined;

  const appendClause = (clause: SQL<unknown>) => {
    whereClause = whereClause ? and(whereClause, clause) : clause;
  };

  if (airlineId) {
    appendClause(eq(employees.airlineId, airlineId));
  }

  const searchTerm = `%${query}%`;
  const searchFilter = or(
    ilike(employees.firstName, searchTerm),
    ilike(employees.lastName, searchTerm),
    ilike(employees.displayName, searchTerm),
    ilike(employees.email, searchTerm),
    ilike(employees.employeeNumber, searchTerm)
  );
  appendClause(searchFilter);

  const results = await db
    .select({
      id: employees.id,
      firstName: employees.firstName,
      lastName: employees.lastName,
      displayName: employees.displayName,
      email: employees.email,
      title: employees.title,
      airlineId: employees.airlineId,
    })
    .from(employees)
    .where(whereClause!)
    .limit(25);

  return NextResponse.json({
    employees: results,
    total: results.length,
  });
}
