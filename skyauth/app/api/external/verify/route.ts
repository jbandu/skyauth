import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { verifyExternalToken } from "@/lib/api/tokens";
import { getDb, employees } from "@/lib/db";

export async function GET(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ valid: false, error: "Missing bearer token" }, { status: 401 });
  }

  const payload = verifyExternalToken(token);

  if (!payload) {
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 });
  }

  const db = getDb();
  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, payload.employeeId),
  });

  return NextResponse.json({
    valid: Boolean(employee),
    employee: employee
      ? {
          id: employee.id,
          email: employee.email,
          name: employee.displayName ?? `${employee.firstName} ${employee.lastName}`,
          airlineId: employee.airlineId,
          status: employee.status,
        }
      : null,
  });
}
