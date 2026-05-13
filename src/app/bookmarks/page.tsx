import { BookmarksPanel } from "@/components/BookmarksPanel";
import { ProductShell } from "@/components/ProductShell";
import { buildCurriculum } from "@/modules/curriculum/catalog";

export const metadata = { title: "Bookmarks" };
export const dynamic = "force-dynamic";

export default function BookmarksPage() {
  const lessons = buildCurriculum().lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    moduleTitle: lesson.moduleTitle,
    moduleSlug: lesson.moduleSlug,
    slug: lesson.slug,
    difficulty: lesson.difficulty,
    duration: lesson.duration,
  }));

  return (
    <ProductShell>
      <div className="p-5">
        <BookmarksPanel lessons={lessons} />
      </div>
    </ProductShell>
  );
}
