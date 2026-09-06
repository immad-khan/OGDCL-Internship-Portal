import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { sql } from "drizzle-orm";

let seeded = false;

/**
 * Idempotently seeds demo accounts and sample tasks the first time the
 * application touches the database. Safe to call from any server code path.
 */
export async function ensureSeeded(): Promise<void> {
  if (seeded) return;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);

  if (count > 0) {
    seeded = true;
    return;
  }

  const [supervisor] = await db
    .insert(users)
    .values({
      name: "Engr. Ahmed Raza",
      email: "supervisor@ogdcl.com",
      passwordHash: hashPassword("Supervisor@123"),
      role: "supervisor",
      employeeNo: "OG-10482",
      department: "Reservoir Engineering",
      designation: "Deputy Manager — Reservoir",
    })
    .returning();

  const internSeeds = [
    {
      name: "Ayesha Khan",
      email: "intern@ogdcl.com",
      password: "Intern@123",
      employeeNo: "INT-2026-014",
      department: "Reservoir Engineering",
      institution: "NUST, Islamabad",
      start: "2026-08-03",
      end: "2026-10-30",
    },
    {
      name: "Bilal Ahmed",
      email: "bilal.ahmed@ogdcl.com",
      password: "Intern@123",
      employeeNo: "INT-2026-019",
      department: "Reservoir Engineering",
      institution: "UET, Lahore",
      start: "2026-08-03",
      end: "2026-10-30",
    },
    {
      name: "Sana Malik",
      email: "sana.malik@ogdcl.com",
      password: "Intern@123",
      employeeNo: "INT-2026-022",
      department: "Reservoir Engineering",
      institution: "GIKI, Topi",
      start: "2026-08-17",
      end: "2026-11-13",
    },
    {
      name: "Hamza Tariq",
      email: "hamza.tariq@ogdcl.com",
      password: "Intern@123",
      employeeNo: "INT-2026-027",
      department: "Reservoir Engineering",
      institution: "IBA, Karachi",
      start: "2026-09-01",
      end: "2026-11-27",
    },
  ];

  const interns = await db
    .insert(users)
    .values(
      internSeeds.map((i) => ({
        name: i.name,
        email: i.email,
        passwordHash: hashPassword(i.password),
        role: "intern" as const,
        employeeNo: i.employeeNo,
        department: i.department,
        institution: i.institution,
        supervisorId: supervisor.id,
        startDate: i.start,
        endDate: i.end,
      })),
    )
    .returning();

  const [ayesha, bilal, sana, hamza] = interns;

  await db.insert(tasks).values([
    {
      title: "Well log correlation — Nashpa Block",
      description:
        "Correlate gamma-ray and resistivity logs across three wells and prepare a cross-section.",
      internId: ayesha.id,
      supervisorId: supervisor.id,
      status: "done",
      dueDate: "2026-08-21",
    },
    {
      title: "Decline curve analysis for Qadirpur field",
      description:
        "Fit exponential and hyperbolic decline models to 24 months of production data.",
      internId: ayesha.id,
      supervisorId: supervisor.id,
      status: "done",
      dueDate: "2026-09-04",
    },
    {
      title: "Material balance model setup",
      description: "Build a preliminary MBAL model using provided PVT and production history.",
      internId: ayesha.id,
      supervisorId: supervisor.id,
      status: "in_progress",
      dueDate: "2026-09-18",
    },
    {
      title: "Weekly progress report — Week 6",
      description: "Summarise findings, blockers and next steps in the standard OGDCL template.",
      internId: ayesha.id,
      supervisorId: supervisor.id,
      status: "review",
      dueDate: "2026-09-12",
    },
    {
      title: "HSE induction quiz",
      description: "Complete the mandatory health, safety and environment induction assessment.",
      internId: ayesha.id,
      supervisorId: supervisor.id,
      status: "todo",
      dueDate: "2026-09-25",
    },
    {
      title: "PVT data validation",
      description: "Check consistency of fluid samples and flag outliers.",
      internId: bilal.id,
      supervisorId: supervisor.id,
      status: "in_progress",
      dueDate: "2026-09-16",
    },
    {
      title: "Literature review — EOR screening",
      description: "Review screening criteria for CO2 and polymer flooding relevant to Sindh fields.",
      internId: bilal.id,
      supervisorId: supervisor.id,
      status: "todo",
      dueDate: "2026-09-30",
    },
    {
      title: "Reservoir simulation grid QC",
      description: "Validate grid geometry and property distribution in the static model.",
      internId: sana.id,
      supervisorId: supervisor.id,
      status: "review",
      dueDate: "2026-09-14",
    },
    {
      title: "Production data cleansing",
      description: "Standardise daily production records for the last 18 months.",
      internId: hamza.id,
      supervisorId: supervisor.id,
      status: "todo",
      dueDate: "2026-09-22",
    },
  ]);

  seeded = true;
}
