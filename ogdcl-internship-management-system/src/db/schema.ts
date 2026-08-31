import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const internStatus = pgEnum("intern_status", [
  "active",
  "on_hold",
  "completed",
  "pending",
]);
export type InternStatus = (typeof internStatus.enumValues)[number];

export const taskStatus = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "completed",
]);
export type TaskStatus = (typeof taskStatus.enumValues)[number];

export const taskPriority = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export type TaskPriority = (typeof taskPriority.enumValues)[number];

export const reportStatus = pgEnum("report_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
]);
export type ReportStatus = (typeof reportStatus.enumValues)[number];

export const supervisors = pgTable("supervisors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  designation: text("designation").notNull().default("Internship Supervisor"),
  department: text("department").notNull().default("HR & Administration"),
  phone: text("phone"),
  region: text("region").default("Islamabad HQ"),
});

export const interns = pgTable("interns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  department: text("department").notNull(),
  university: text("university"),
  degree: text("degree"),
  cgpa: text("cgpa"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: internStatus("status").notNull().default("active"),
  supervisorId: integer("supervisor_id").references(() => supervisors.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  internId: integer("intern_id").references(() => interns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("General"),
  priority: taskPriority("priority").notNull().default("medium"),
  status: taskStatus("status").notNull().default("todo"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  internId: integer("intern_id")
    .notNull()
    .references(() => interns.id, { onDelete: "cascade" }),
  senderName: text("sender_name").notNull(),
  role: text("role").notNull(), // 'supervisor' | 'intern'
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  internId: integer("intern_id").references(() => interns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  status: reportStatus("status").notNull().default("draft"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
