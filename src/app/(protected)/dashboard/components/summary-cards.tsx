import {
  DollarSign,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { SummaryCard } from "./summary-card";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface SummaryCardsProps {
  data: {
    totalGanhos: number;
    totalDespesas: number;
    totalDividas: number;
    totalInvestimentos: number;
    saldoDisponivel: number;
  };
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <SummaryCard
        title="Total de Ganhos"
        value={formatCurrency(data.totalGanhos)}
        icon={TrendingUp}
        descriptionColor="green"
      />
      <SummaryCard
        title="Total de Despesas"
        value={formatCurrency(data.totalDespesas)}
        icon={TrendingDown}
        descriptionColor="red"
      />
      <SummaryCard
        title="Total de Dívidas"
        value={formatCurrency(data.totalDividas)}
        icon={Wallet}
        descriptionColor="orange"
      />
      <SummaryCard
        title="Total de Investimentos"
        value={formatCurrency(data.totalInvestimentos)}
        icon={PiggyBank}
        descriptionColor="blue"
      />
      <SummaryCard
        title="Saldo Disponível"
        value={formatCurrency(data.saldoDisponivel)}
        icon={DollarSign}
        descriptionColor="default"
      />
    </div>
  );
}
