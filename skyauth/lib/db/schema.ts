import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  index,
  inet,
} from "drizzle-orm/pg-core";

export const airlines = pgTable(
  "airlines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 3 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    fullName: varchar("full_name", { length: 200 }),
    logoUrl: text("logo_url"),
    primaryColor: varchar("primary_color", { length: 7 }),
    secondaryColor: varchar("secondary_color", { length: 7 }),
    domain: varchar("domain", { length: 100 }),
    headquarters: varchar("headquarters", { length: 200 }),
    foundedYear: integer("founded_year"),
    fleetSize: integer("fleet_size"),
    employeesCount: integer("employees_count"),
    active: boolean("active").notNull().default(true),
    settings: jsonb("settings").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    airlineCodeUnique: uniqueIndex("airlines_code_unique").on(table.code),
  })
);

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    airlineId: uuid("airline_id")
      .references(() => airlines.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 20 }),
    parentDepartmentId: uuid("parent_department_id").references(() => departments.id),
    headEmployeeId: uuid("head_employee_id"),
    description: text("description"),
    costCenter: varchar("cost_center", { length: 50 }),
    location: varchar("location", { length: 100 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    employeeCount: integer("employee_count").default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    airlineIndex: index("departments_airline_idx").on(table.airlineId, table.active),
  })
);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    airlineId: uuid("airline_id")
      .references(() => airlines.id, { onDelete: "cascade" })
      .notNull(),
    employeeNumber: varchar("employee_number", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }),
    displayName: varchar("display_name", { length: 200 }),
    preferredName: varchar("preferred_name", { length: 100 }),
    title: varchar("title", { length: 200 }),
    departmentId: uuid("department_id").references(() => departments.id),
    managerId: uuid("manager_id").references(() => employees.id),
    reportsToId: uuid("reports_to_id").references(() => employees.id),
    baseLocation: varchar("base_location", { length: 50 }),
    officeLocation: varchar("office_location", { length: 200 }),
    hireDate: date("hire_date"),
    birthDate: date("birth_date"),
    status: varchar("status", { length: 20 }).default("active"),
    employmentType: varchar("employment_type", { length: 50 }),
    seniorityDate: date("seniority_date"),
    avatarUrl: text("avatar_url"),
    phone: varchar("phone", { length: 50 }),
    mobile: varchar("mobile", { length: 50 }),
    emergencyContact: jsonb("emergency_contact").$type<Record<string, unknown>>(),
    address: jsonb("address").$type<Record<string, unknown>>(),
    nationality: varchar("nationality", { length: 100 }),
    passportNumber: varchar("passport_number", { length: 50 }),
    licenseNumber: varchar("license_number", { length: 50 }),
    licenseExpiry: date("license_expiry"),
    bio: text("bio"),
    linkedinUrl: text("linkedin_url"),
    socialLinks: jsonb("social_links").$type<Record<string, unknown>>(),
    employeeMetadata: jsonb("employee_metadata").$type<Record<string, unknown>>(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    employeeAirlineUnique: uniqueIndex("unique_employee_per_airline").on(table.airlineId, table.employeeNumber),
    emailAirlineUnique: uniqueIndex("unique_email_per_airline").on(table.airlineId, table.email),
    employeeAirlineIdx: index("employees_airline_idx").on(table.airlineId, table.status),
    employeeManagerIdx: index("employees_manager_idx").on(table.managerId),
  })
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 50 }).notNull(),
    displayName: varchar("display_name", { length: 100 }),
    description: text("description"),
    permissions: jsonb("permissions").$type<Record<string, unknown>>(),
    dashboardType: varchar("dashboard_type", { length: 50 }),
    level: integer("level").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    roleAirlineUnique: uniqueIndex("unique_role_per_airline").on(table.airlineId, table.name),
  })
);

export const employeeRoles = pgTable(
  "employee_roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),
    roleId: uuid("role_id")
      .references(() => roles.id, { onDelete: "cascade" })
      .notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
    assignedBy: uuid("assigned_by").references(() => employees.id),
  },
  (table) => ({
    employeeRoleUnique: uniqueIndex("unique_employee_role").on(table.employeeId, table.roleId),
  })
);

export const orgChartPositions = pgTable("org_chart_positions", {
  id: uuid("id").defaultRandom().primaryKey(),
  airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  positionX: numeric("position_x"),
  positionY: numeric("position_y"),
  level: integer("level"),
  orderInLevel: integer("order_in_level"),
  visible: boolean("visible").default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const timeOffRequests = pgTable(
  "time_off_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    daysRequested: numeric("days_requested", { precision: 4, scale: 1 }),
    status: varchar("status", { length: 20 }).default("pending"),
    reason: text("reason"),
    approvedBy: uuid("approved_by").references(() => employees.id),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    denialReason: text("denial_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    timeOffAirlineIdx: index("time_off_airline_idx").on(table.airlineId),
  })
);

export const employeeDocuments = pgTable("employee_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  documentType: varchar("document_type", { length: 50 }),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  uploadedBy: uuid("uploaded_by").references(() => employees.id),
  expiryDate: date("expiry_date"),
  isConfidential: boolean("is_confidential").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const onboardingChecklists = pgTable("onboarding_checklists", {
  id: uuid("id").defaultRandom().primaryKey(),
  airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  taskName: varchar("task_name", { length: 200 }),
  description: text("description"),
  assignedTo: uuid("assigned_to").references(() => employees.id),
  dueDate: date("due_date"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  orderIndex: integer("order_index"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  token: varchar("token", { length: 500 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 500 }),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  deviceInfo: jsonb("device_info").$type<Record<string, unknown>>(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    airlineId: uuid("airline_id").references(() => airlines.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").references(() => employees.id),
    action: varchar("action", { length: 100 }).notNull(),
    resourceType: varchar("resource_type", { length: 50 }),
    resourceId: uuid("resource_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    severity: varchar("severity", { length: 20 }).default("info"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    auditAirlineIdx: index("idx_audit_logs_airline").on(table.airlineId, table.createdAt),
    auditEmployeeIdx: index("idx_audit_logs_employee").on(table.employeeId, table.createdAt),
  })
);
