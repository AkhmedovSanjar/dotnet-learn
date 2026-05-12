import "server-only";

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "@/database/schema";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "dotnetlearn.db");

declare global {
  var __dotnetlearnDb: ReturnType<typeof drizzle> | undefined;
  var __dotnetlearnSqlite: Database.Database | undefined;
}

function ensureDataDirectory() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
}

function initializeSqlite() {
  ensureDataDirectory();

  if (!globalThis.__dotnetlearnSqlite) {
    globalThis.__dotnetlearnSqlite = new Database(databasePath);
  }

  return globalThis.__dotnetlearnSqlite;
}

export function getDatabase() {
  const sqlite = initializeSqlite();

  if (!globalThis.__dotnetlearnDb) {
    globalThis.__dotnetlearnDb = drizzle(sqlite, { schema });
  }

  return globalThis.__dotnetlearnDb;
}

export function getSqlite() {
  return initializeSqlite();
}
