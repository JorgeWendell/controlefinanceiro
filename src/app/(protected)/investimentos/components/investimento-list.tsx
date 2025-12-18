import { getInvestimentosAction } from "../actions";
import { InvestimentoTable } from "./investimento-table";

interface InvestimentoListProps {
  mes?: number;
  ano?: number;
}

export async function InvestimentoList({ mes, ano }: InvestimentoListProps) {
  const investimentos = await getInvestimentosAction(mes, ano);

  if (investimentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          Nenhum investimento cadastrado para este período.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em &quot;+ Investimento&quot; para adicionar um investimento.
        </p>
      </div>
    );
  }

  return <InvestimentoTable investimentos={investimentos} />;
}
