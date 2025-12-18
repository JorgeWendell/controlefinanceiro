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
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Visão geral das suas finanças
          </p>
        </div>
        <PeriodFilter />
      </div>

      <SummaryCards data={data} />

      <div className="grid gap-4 lg:grid-cols-2">
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
