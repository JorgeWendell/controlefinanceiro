import { getDespesasVariaveisAction } from "../actions";
import { DespesaVariavelTable } from "./despesa-variavel-table";

interface DespesaVariavelListProps {
  mes?: number;
  ano?: number;
}

export async function DespesaVariavelList({
  mes,
  ano,
}: DespesaVariavelListProps) {
  const despesas = await getDespesasVariaveisAction(mes, ano);

  if (despesas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Nenhuma despesa variável cadastrada para este período.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em &quot;+ Despesa Variável&quot; para adicionar uma despesa.
        </p>
      </div>
    );
  }

  return <DespesaVariavelTable despesas={despesas} />;
}
