import { Bookmark } from "lucide-react";

import { ComingSoonShell } from "@/components/ComingSoonShell";

export const metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <ComingSoonShell
      icon={Bookmark}
      eyebrow="Bookmarks"
      title="Save the lessons you want to revisit"
      description="A focused list of bookmarked lessons - the ones you flagged during quizzes or wanted to come back to before the next interview. Bookmarks will sync to your account once profiles ship."
      bullets={[
        "One-click bookmark from any lesson page.",
        "Filter by module, difficulty, or tag.",
        "Export to a markdown checklist for your study log.",
        "Pin a bookmark to the dashboard for quick access.",
      ]}
    />
  );
}
