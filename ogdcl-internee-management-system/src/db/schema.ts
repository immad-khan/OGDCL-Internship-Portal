import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["intern", "supervisor"]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "done",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull(),
  employeeNo: varchar("employee_no", { length: 40 }),
  department: varchar("department", { length: 120 }),
  designation: varchar("designation", { length: 120 }),
  institution: varchar("institution", { length: 160 }),
  supervisorId: integer("supervisor_id"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  internId: integer("intern_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  supervisorId: integer("supervisor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: taskStatusEnum("status").notNull().default("todo"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
