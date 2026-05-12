import { NextResponse } from "next/server";
import { z } from "zod";

import { getLessonBySlugs } from "@/modules/curriculum/catalog";
import { saveQuizAttempt } from "@/progress/service";
import { scoreQuizAttempt } from "@/quizzes/logic";

const payloadSchema = z.object({
  moduleSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = payloadSchema.parse(body);

  const lesson = getLessonBySlugs(payload.moduleSlug, payload.lessonSlug);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const result = scoreQuizAttempt(lesson.quiz, payload.answers);
  await saveQuizAttempt(lesson.id, result);

  return NextResponse.json(result);
}
