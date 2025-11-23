import { NextResponse } from "next/server";

import { authorizeWithCredentials, credentialsSchema, logAudit } from "@/lib/auth/config";
import { signExternalToken } from "@/lib/api/tokens";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  const parsed = credentialsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const employee = await authorizeWithCredentials(parsed.data);

  if (!employee) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signExternalToken({
    employeeId: employee.id,
    airlineId: employee.airlineId,
    email: employee.email,
  });

  await logAudit({
    airlineId: employee.airlineId,
    employeeId: employee.id,
    action: "external_auth_token_issued",
  });

  return NextResponse.json({
    token,
    employee: {
      id: employee.id,
      email: employee.email,
      name: employee.name,
      airlineId: employee.airlineId,
      airlineCode: employee.airlineCode,
      roles: employee.roles,
    },
  });
}
