import { getDividasAction } from "../actions";
import { DividaTable } from "./divida-table";

interface DividaListProps {
  mes?: number;
  ano?: number;
}

export async function DividaList({ mes, ano }: DividaListProps) {
  const dividas = await getDividasAction(mes, ano);

  if (dividas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Nenhuma dívida cadastrada para este período.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em &quot;+ Dívida&quot; para adicionar uma dívida.
        </p>
      </div>
    );
  }

  return <DividaTable dividas={dividas} />;
}
