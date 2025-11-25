#!/usr/bin/env tsx
/**
 * Database seeding script
 * Creates initial airline and admin user for testing/development
 */

import { getDb, airlines, employees, roles, employeeRoles } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

const DEFAULT_AIRLINE_CODE = "DEMO";
const DEFAULT_AIRLINE_NAME = "Demo Airlines";
const DEFAULT_ADMIN_EMAIL = "admin@demo.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";
const DEFAULT_ADMIN_EMPLOYEE_NUMBER = "ADMIN001";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  const db = getDb();

  try {
    // Check if airline already exists
    const existingAirline = await db.query.airlines.findFirst({
      where: (airlines, { eq }) => eq(airlines.code, DEFAULT_AIRLINE_CODE),
    });

    let airlineId: string;

    if (existingAirline) {
      console.log(`✅ Airline '${DEFAULT_AIRLINE_CODE}' already exists`);
      airlineId = existingAirline.id;
    } else {
      console.log(`📦 Creating airline '${DEFAULT_AIRLINE_CODE}'...`);
      const [newAirline] = await db
        .insert(airlines)
        .values({
          code: DEFAULT_AIRLINE_CODE,
          name: DEFAULT_AIRLINE_NAME,
          fullName: `${DEFAULT_AIRLINE_NAME} - Employee Directory`,
          active: true,
        })
        .returning();

      airlineId = newAirline.id;
      console.log(`✅ Created airline with ID: ${airlineId}`);
    }

    // Check if admin user already exists
    const existingAdmin = await db.query.employees.findFirst({
      where: (employees, { eq, and }) =>
        and(
          eq(employees.email, DEFAULT_ADMIN_EMAIL),
          eq(employees.airlineId, airlineId)
        ),
    });

    let adminId: string;

    if (existingAdmin) {
      console.log(`✅ Admin user '${DEFAULT_ADMIN_EMAIL}' already exists`);
      adminId = existingAdmin.id;
    } else {
      console.log(`👤 Creating admin user...`);
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);

      const [newAdmin] = await db
        .insert(employees)
        .values({
          airlineId,
          employeeNumber: DEFAULT_ADMIN_EMPLOYEE_NUMBER,
          email: DEFAULT_ADMIN_EMAIL,
          passwordHash,
          firstName: "Admin",
          lastName: "User",
          displayName: "Admin User",
          title: "System Administrator",
          status: "active",
        })
        .returning();

      adminId = newAdmin.id;
      console.log(`✅ Created admin user with ID: ${adminId}`);
    }

    // Create admin role if it doesn't exist
    let adminRoleId: string;
    const existingRole = await db.query.roles.findFirst({
      where: (roles, { eq, and }) =>
        and(eq(roles.name, "admin"), eq(roles.airlineId, airlineId)),
    });

    if (existingRole) {
      console.log(`✅ Admin role already exists`);
      adminRoleId = existingRole.id;
    } else {
      console.log(`🔐 Creating admin role...`);
      const [newRole] = await db
        .insert(roles)
        .values({
          airlineId,
          name: "admin",
          displayName: "Administrator",
          description: "Full system access",
          dashboardType: "admin",
          level: 100,
          permissions: {
            "*": "*", // Full permissions
          },
        })
        .returning();

      adminRoleId = newRole.id;
      console.log(`✅ Created admin role with ID: ${adminRoleId}`);
    }

    // Assign admin role to admin user
    const existingAssignment = await db.query.employeeRoles.findFirst({
      where: (employeeRoles, { eq, and }) =>
        and(
          eq(employeeRoles.employeeId, adminId),
          eq(employeeRoles.roleId, adminRoleId)
        ),
    });

    if (!existingAssignment) {
      console.log(`🔗 Assigning admin role to admin user...`);
      await db.insert(employeeRoles).values({
        employeeId: adminId,
        roleId: adminRoleId,
        assignedBy: adminId,
      });
      console.log(`✅ Admin role assigned`);
    } else {
      console.log(`✅ Admin role already assigned`);
    }

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📋 Login credentials:");
    console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log(`   Airline Code: ${DEFAULT_AIRLINE_CODE}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding
seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });
