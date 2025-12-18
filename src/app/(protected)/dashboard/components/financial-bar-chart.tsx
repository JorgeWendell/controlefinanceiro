"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FinancialBarChartProps {
  totalInvestimentos: number;
  saldoDisponivel: number;
}

const COLORS = {
  investimentos: "#3b82f6",
  saldo: "#8b5cf6",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FinancialBarChart({
  totalInvestimentos,
  saldoDisponivel,
}: FinancialBarChartProps) {
  const chartData = [
    {
      name: "Investimentos",
      value: totalInvestimentos,
      color: COLORS.investimentos,
    },
    {
      name: "Saldo Disponível",
      value: saldoDisponivel,
      color: COLORS.saldo,
    },
  ];

  const hasData = totalInvestimentos !== 0 || saldoDisponivel !== 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Patrimônio</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Investimentos e saldo disponível
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
        <CardTitle className="text-base md:text-lg">Patrimônio</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Investimentos e saldo disponível
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              tickFormatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={35}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
