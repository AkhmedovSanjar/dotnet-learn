import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const lessonProgressTable = sqliteTable(
  "lesson_progress",
  {
    userId: text("user_id").notNull(),
    lessonId: text("lesson_id").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    quizScore: integer("quiz_score"),
    lastOpenedAt: text("last_opened_at"),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.lessonId] }),
  }),
);

export const quizAttemptsTable = sqliteTable("quiz_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  submittedAt: text("submitted_at").notNull(),
});
