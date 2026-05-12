import type { LessonContent, ModuleContent } from "./types";

import { oopContent } from "./oop.content";
import { dtosContent } from "./dtos.content";
import { apiRequestsContent } from "./api-requests.content";
import { databaseContent } from "./database.content";
import { frameworkContent } from "./framework.content";

const moduleContents: Record<string, ModuleContent> = {
  oop: oopContent,
  dtos: dtosContent,
  "api-requests": apiRequestsContent,
  database: databaseContent,
  framework: frameworkContent,
};

export function getAuthoredLessonContent(
  moduleId: string,
  slug: string,
): LessonContent | undefined {
  return moduleContents[moduleId]?.[slug];
}

export function getAuthoredModuleIds(): string[] {
  return Object.keys(moduleContents);
}

export type { LessonContent, ModuleContent } from "./types";
