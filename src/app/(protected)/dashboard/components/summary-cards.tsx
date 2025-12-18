import {
  DollarSign,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { SummaryCard } from "./summary-card";

// TODO: Substituir por dados reais do banco
const mockData = {
  totalGanhos: 12500.0,
  totalDespesas: 4280.5,
  totalDividas: 2500.0,
  totalInvestimentos: 8000.0,
  saldoDisponivel: 5719.5,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <SummaryCard
        title="Total de Ganhos"
        value={formatCurrency(mockData.totalGanhos)}
        icon={TrendingUp}
        description="+12% em relação ao mês anterior"
        descriptionColor="green"
      />
      <SummaryCard
        title="Total de Despesas"
        value={formatCurrency(mockData.totalDespesas)}
        icon={TrendingDown}
        description="-8% em relação ao mês anterior"
        descriptionColor="red"
      />
      <SummaryCard
        title="Total de Dívidas"
        value={formatCurrency(mockData.totalDividas)}
        icon={Wallet}
        description="3 parcelas pendentes"
        descriptionColor="orange"
      />
      <SummaryCard
        title="Total de Investimentos"
        value={formatCurrency(mockData.totalInvestimentos)}
        icon={PiggyBank}
        description="+5.2% de rendimento"
        descriptionColor="blue"
      />
      <SummaryCard
        title="Saldo Disponível"
        value={formatCurrency(mockData.saldoDisponivel)}
        icon={DollarSign}
        description="Atualizado agora"
        descriptionColor="default"
      />
    </div>
  );
}
