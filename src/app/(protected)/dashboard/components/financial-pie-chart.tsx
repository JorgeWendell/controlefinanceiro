"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FinancialPieChartProps {
  totalGanhos: number;
  totalDespesas: number;
  totalDividas: number;
}

const COLORS = {
  ganhos: "#22c55e",
  despesas: "#ef4444",
  dividas: "#f97316",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FinancialPieChart({
  totalGanhos,
  totalDespesas,
  totalDividas,
}: FinancialPieChartProps) {
  const chartData = [
    { name: "Ganhos", value: totalGanhos, color: COLORS.ganhos },
    { name: "Despesas", value: totalDespesas, color: COLORS.despesas },
    { name: "Dívidas", value: totalDividas, color: COLORS.dividas },
  ].filter((item) => item.value > 0);

  const total = totalGanhos + totalDespesas + totalDividas;

  if (total === 0) {
    return (
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Distribuição Financeira
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Visão geral de ganhos, despesas e dívidas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 md:py-12">
          <p className="text-sm text-muted-foreground">
            Nenhum dado disponível para este período
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">
          Distribuição Financeira
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Visão geral de ganhos, despesas e dívidas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-foreground md:text-sm">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
