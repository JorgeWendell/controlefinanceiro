import { getMetasAction } from "../actions";
import { MetaCard } from "./meta-card";

export async function MetaList() {
  const metas = await getMetasAction();

  if (metas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma meta cadastrada</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metas.map((meta) => (
        <MetaCard key={meta.id} meta={meta} />
      ))}
    </div>
  );
}
