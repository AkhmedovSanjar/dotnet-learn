import { PlaygroundWorkspace } from "@/components/PlaygroundWorkspace";
import { ProductShell } from "@/components/ProductShell";

export const metadata = { title: "Code Playground" };
export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  return (
    <ProductShell>
      <div className="p-5">
        <PlaygroundWorkspace />
      </div>
    </ProductShell>
  );
}
