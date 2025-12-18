import { getCategoriasAction } from "../actions";
import { CategoriaTable } from "./categoria-table";

export async function CategoriaList() {
  const categorias = await getCategoriasAction();

  return <CategoriaTable categorias={categorias} />;
}
