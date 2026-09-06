import { db } from "@/db";
import { supervisors } from "@/db/schema";
import { count } from "drizzle-orm";

let seeded = false;

export const DEFAULT_PASSWORD_HASH =
  "$2a$12$placeholder_replace_with_real_bcrypt_hash_here_xxxxx";

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const rows = await db.select({ n: count() }).from(supervisors);
  if ((rows[0]?.n ?? 0) > 0) {
    seeded = true;
    return;
  }
  await seedDatabase();
  seeded = true;
}

export async function seedDatabase(): Promise<void> {
  await db.insert(supervisors).values({
    name: "Engr. Ahmed Raza",
    email: "ahmed.raza@ogdcl.com",
    passwordHash: DEFAULT_PASSWORD_HASH,
    designation: "Deputy Manager — HR & Administration",
    department: "Human Resources",
    phone: "+92 51 920 9000",
    region: "Islamabad Head Office",
  });
}