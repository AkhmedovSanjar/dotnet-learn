import { NotesWorkspace } from "@/components/NotesWorkspace";
import { ProductShell } from "@/components/ProductShell";

export const metadata = { title: "Notes" };
export const dynamic = "force-dynamic";

export default function NotesPage() {
  return (
    <ProductShell>
      <div className="p-5">
        <NotesWorkspace />
      </div>
    </ProductShell>
  );
}
