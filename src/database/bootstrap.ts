import "server-only";

import { getSqlite } from "@/database/client";

let initialized = false;

export function ensureDatabaseReady() {
  if (initialized) {
    return;
  }

  const sqlite = getSqlite();

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      quiz_score INTEGER,
      last_opened_at TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      submitted_at TEXT NOT NULL
    );
  `);

  initialized = true;
}
