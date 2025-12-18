import { PeriodFilter } from "@/components/ui/period-filter";

import { getDashboardSummary } from "./actions";
import { FinancialBarChart } from "./components/financial-bar-chart";
import { FinancialPieChart } from "./components/financial-pie-chart";
import { SummaryCards } from "./components/summary-cards";

interface DashboardProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const Dashboard = async ({ searchParams }: DashboardProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  const data = await getDashboardSummary(mes, ano);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <PeriodFilter />
      </div>

      <SummaryCards data={data} />

      <div className="grid gap-4 md:grid-cols-2">
        <FinancialPieChart
          totalGanhos={data.totalGanhos}
          totalDespesas={data.totalDespesas}
          totalDividas={data.totalDividas}
        />
        <FinancialBarChart
          totalInvestimentos={data.totalInvestimentos}
          saldoDisponivel={data.saldoDisponivel}
        />
      </div>
    </div>
  );
};

export default Dashboard;
