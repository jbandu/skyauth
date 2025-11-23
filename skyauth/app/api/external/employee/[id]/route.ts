import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { validateApiKey } from "@/lib/api/keys";
import { getDb, employees } from "@/lib/db";

type Params = {
  params: { id: string };
};

export async function GET(request: Request, { params }: Params) {
  const apiKey = request.headers.get("x-api-key");
  const airlineCode = request.headers.get("x-airline-code") ?? undefined;

  if (!validateApiKey(apiKey, airlineCode ?? undefined)) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const db = getDb();

  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, params.id),
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({
    employee: {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      displayName: employee.displayName,
      email: employee.email,
      title: employee.title,
      departmentId: employee.departmentId,
      managerId: employee.managerId,
      status: employee.status,
      baseLocation: employee.baseLocation,
      airlineId: employee.airlineId,
    },
  });
}
