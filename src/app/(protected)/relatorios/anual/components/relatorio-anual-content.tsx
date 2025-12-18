"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelatorioAnualData {
  ano: number;
  meses: Array<{
    mes: number;
    ganhos: number;
    despesas: number;
  }>;
}

interface RelatorioAnualContentProps {
  data: RelatorioAnualData;
}

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RelatorioAnualContent({ data }: RelatorioAnualContentProps) {
  const chartData = data.meses.map((item) => ({
    name: MESES_ABREV[item.mes - 1],
    Ganhos: item.ganhos,
    Despesas: item.despesas,
    Saldo: item.ganhos - item.despesas,
  }));

  const totalGanhos = data.meses.reduce((acc, item) => acc + item.ganhos, 0);
  const totalDespesas = data.meses.reduce(
    (acc, item) => acc + item.despesas,
    0
  );
  const saldoAnual = totalGanhos - totalDespesas;

  return (
    <div className="space-y-6">
      {/* Cards de resumo anual */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ganhos {data.ano}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(totalGanhos)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Despesas {data.ano}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalDespesas)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            saldoAnual >= 0
              ? "border-green-500/20 bg-green-500/5"
              : "border-red-500/20 bg-red-500/5"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Anual {data.ano}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                saldoAnual >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatCurrency(saldoAnual)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Ganhos vs Despesas por mês */}
      <Card>
        <CardHeader>
          <CardTitle>Ganhos vs Despesas por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
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
                }}
              />
              <Legend />
              <Bar dataKey="Ganhos" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Evolução do Saldo */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Saldo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
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
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Saldo"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela detalhada por mês */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Ganhos</TableHead>
                <TableHead className="text-right">Despesas</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.meses.map((item) => {
                const saldo = item.ganhos - item.despesas;
                return (
                  <TableRow key={item.mes}>
                    <TableCell className="font-medium">
                      {MESES[item.mes - 1]}
                    </TableCell>
                    <TableCell className="text-right text-green-500">
                      {formatCurrency(item.ganhos)}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      {formatCurrency(item.despesas)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        saldo >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatCurrency(saldo)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Total Anual</TableCell>
                <TableCell className="text-right text-green-500">
                  {formatCurrency(totalGanhos)}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(totalDespesas)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    saldoAnual >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatCurrency(saldoAnual)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
