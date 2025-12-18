"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatorioData {
  mes: number;
  ano: number;
  ganhos: { total: number; count: number };
  despesasFixas: { total: number; count: number };
  despesasVariaveis: { total: number; count: number };
  totalDespesas: number;
  dividas: { total: number; count: number };
  investimentos: { total: number; count: number };
  saldoDisponivel: number;
}

interface RelatorioMensalContentProps {
  data: RelatorioData;
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const COLORS = {
  ganhos: "#22c55e",
  despesasFixas: "#ef4444",
  despesasVariaveis: "#f97316",
  dividas: "#eab308",
  investimentos: "#3b82f6",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RelatorioMensalContent({ data }: RelatorioMensalContentProps) {
  const pieData = [
    { name: "Ganhos", value: data.ganhos.total, color: COLORS.ganhos },
    {
      name: "Despesas Fixas",
      value: data.despesasFixas.total,
      color: COLORS.despesasFixas,
    },
    {
      name: "Despesas Variáveis",
      value: data.despesasVariaveis.total,
      color: COLORS.despesasVariaveis,
    },
    { name: "Dívidas", value: data.dividas.total, color: COLORS.dividas },
  ].filter((item) => item.value > 0);

  const barData = [
    { name: "Ganhos", valor: data.ganhos.total, fill: COLORS.ganhos },
    {
      name: "Desp. Fixas",
      valor: data.despesasFixas.total,
      fill: COLORS.despesasFixas,
    },
    {
      name: "Desp. Variáveis",
      valor: data.despesasVariaveis.total,
      fill: COLORS.despesasVariaveis,
    },
    { name: "Dívidas", valor: data.dividas.total, fill: COLORS.dividas },
    {
      name: "Investimentos",
      valor: data.investimentos.total,
      fill: COLORS.investimentos,
    },
  ];

  const comparativoData = [
    { name: "Entradas", valor: data.ganhos.total, fill: COLORS.ganhos },
    {
      name: "Saídas",
      valor: data.totalDespesas + data.dividas.total,
      fill: COLORS.despesasFixas,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header do período */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Relatório de {MESES[data.mes - 1]} de {data.ano}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pie Chart - Distribuição */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
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
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Sem dados para exibir
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Comparativo Entradas x Saídas */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Entradas vs Saídas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparativoData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {comparativoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Todas as categorias */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Visão Geral por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} layout="vertical">
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    notation: "compact",
                  }).format(value)
                }
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
              />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
