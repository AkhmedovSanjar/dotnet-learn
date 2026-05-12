import "server-only";

import { eq } from "drizzle-orm";

import { ensureDatabaseReady } from "@/database/bootstrap";
import { getDatabase } from "@/database/client";
import { usersTable } from "@/database/schema";

export const defaultUser = {
  id: "local-learner",
  name: "Local Learner",
};

export async function getOrCreateDefaultUser() {
  ensureDatabaseReady();
  const db = getDatabase();

  const existing = db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, defaultUser.id))
    .get();

  if (existing) {
    return existing;
  }

  const createdAt = new Date().toISOString();
  db.insert(usersTable).values({
    id: defaultUser.id,
    name: defaultUser.name,
    createdAt,
  }).run();

  return {
    ...defaultUser,
    createdAt,
  };
}
