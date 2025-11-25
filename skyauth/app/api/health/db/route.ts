import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/health";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();

    if (!health.connected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          details: health,
        },
        { status: 503 }
      );
    }

    if (!health.tablesExist) {
      return NextResponse.json(
        {
          status: "warning",
          message: "Database connected but tables are missing",
          details: health,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        message: "Database is healthy",
        details: health,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
