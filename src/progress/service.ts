import "server-only";

import { and, desc, eq } from "drizzle-orm";

import type { ProgressRecord } from "@/lessons/contracts";
import { ensureDatabaseReady } from "@/database/bootstrap";
import { getDatabase } from "@/database/client";
import { lessonProgressTable, quizAttemptsTable } from "@/database/schema";
import type { QuizAttemptResult } from "@/quizzes/logic";
import { getOrCreateDefaultUser } from "@/users/service";

export async function listProgressForDefaultUser(): Promise<ProgressRecord[]> {
  ensureDatabaseReady();
  const user = await getOrCreateDefaultUser();
  const db = getDatabase();

  return db
    .select()
    .from(lessonProgressTable)
    .where(eq(lessonProgressTable.userId, user.id))
    .orderBy(desc(lessonProgressTable.updatedAt))
    .all()
    .map((entry) => ({
      lessonId: entry.lessonId,
      completed: Boolean(entry.completed),
      quizScore: entry.quizScore ?? null,
      lastOpenedAt: entry.lastOpenedAt ?? null,
    }));
}

export async function saveLessonProgress(input: {
  lessonId: string;
  completed: boolean;
}) {
  ensureDatabaseReady();
  const user = await getOrCreateDefaultUser();
  const db = getDatabase();
  const now = new Date().toISOString();

  const existing = db
    .select()
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, user.id),
        eq(lessonProgressTable.lessonId, input.lessonId),
      ),
    )
    .get();

  db.insert(lessonProgressTable)
    .values({
      userId: user.id,
      lessonId: input.lessonId,
      completed: input.completed,
      quizScore: existing?.quizScore ?? null,
      lastOpenedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [lessonProgressTable.userId, lessonProgressTable.lessonId],
      set: {
        completed: input.completed,
        lastOpenedAt: now,
        updatedAt: now,
      },
    })
    .run();
}

export async function saveQuizAttempt(
  lessonId: string,
  result: QuizAttemptResult,
) {
  ensureDatabaseReady();
  const user = await getOrCreateDefaultUser();
  const db = getDatabase();
  const now = new Date().toISOString();

  db.insert(quizAttemptsTable)
    .values({
      userId: user.id,
      lessonId,
      score: result.score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      submittedAt: now,
    })
    .run();

  const existing = db
    .select()
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, user.id),
        eq(lessonProgressTable.lessonId, lessonId),
      ),
    )
    .get();

  const bestScore = Math.max(existing?.quizScore ?? 0, result.score);

  db.insert(lessonProgressTable)
    .values({
      userId: user.id,
      lessonId,
      completed: existing?.completed ?? false,
      quizScore: bestScore,
      lastOpenedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [lessonProgressTable.userId, lessonProgressTable.lessonId],
      set: {
        quizScore: bestScore,
        lastOpenedAt: now,
        updatedAt: now,
      },
    })
    .run();
}
