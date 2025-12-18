import { getDespesasFixasAction } from "../actions";
import { DespesaFixaTable } from "./despesa-fixa-table";

interface DespesaFixaListProps {
  mes?: number;
  ano?: number;
}

export async function DespesaFixaList({ mes, ano }: DespesaFixaListProps) {
  const despesasFixas = await getDespesasFixasAction(mes, ano);

  if (despesasFixas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Nenhuma despesa fixa cadastrada para este período.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em &quot;+ Despesa Fixa&quot; para adicionar uma despesa.
        </p>
      </div>
    );
  }

  return <DespesaFixaTable despesas={despesasFixas} />;
}
