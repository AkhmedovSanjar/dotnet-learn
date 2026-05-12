import { NextResponse } from "next/server";
import { z } from "zod";

import { saveLessonProgress } from "@/progress/service";

const payloadSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const payload = payloadSchema.parse(body);

  await saveLessonProgress(payload);

  return NextResponse.json({ ok: true });
}
