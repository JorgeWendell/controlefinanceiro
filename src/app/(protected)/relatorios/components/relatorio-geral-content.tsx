"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelatorioGeralData {
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

interface RelatorioGeralContentProps {
  data: RelatorioGeralData;
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function RelatorioGeralContent({ data }: RelatorioGeralContentProps) {
  const items = [
    {
      label: "Ganhos",
      total: data.ganhos.total,
      count: data.ganhos.count,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Despesas Fixas",
      total: data.despesasFixas.total,
      count: data.despesasFixas.count,
      icon: CreditCard,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Despesas Variáveis",
      total: data.despesasVariaveis.total,
      count: data.despesasVariaveis.count,
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      label: "Dívidas",
      total: data.dividas.total,
      count: data.dividas.count,
      icon: Wallet,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Investimentos",
      total: data.investimentos.total,
      count: data.investimentos.count,
      icon: PiggyBank,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header do período */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">
            Período: {MESES[data.mes - 1]} de {data.ano}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 md:p-6 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">
              Total Entradas
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500 md:h-5 md:w-5" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-xl font-bold text-green-500 md:text-2xl">
              {formatCurrency(data.ganhos.total)}
            </p>
            <p className="text-xs text-muted-foreground md:text-sm">
              {data.ganhos.count} registro(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 md:p-6 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">
              Total Saídas
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500 md:h-5 md:w-5" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p className="text-xl font-bold text-red-500 md:text-2xl">
              {formatCurrency(data.totalDespesas + data.dividas.total)}
            </p>
            <p className="text-xs text-muted-foreground md:text-sm">
              Despesas + Dívidas
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            data.saldoDisponivel >= 0
              ? "border-green-500/20 bg-green-500/5"
              : "border-red-500/20 bg-red-500/5"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 md:p-6 md:pb-2">
            <CardTitle className="text-xs font-medium md:text-sm">
              Saldo do Período
            </CardTitle>
            <Wallet
              className={`h-4 w-4 md:h-5 md:w-5 ${
                data.saldoDisponivel >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <p
              className={`text-xl font-bold md:text-2xl ${
                data.saldoDisponivel >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatCurrency(data.saldoDisponivel)}
            </p>
            <p className="text-xs text-muted-foreground md:text-sm">
              Entradas - Saídas - Investimentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Detalhamento</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 md:p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${item.bgColor}`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.count}</TableCell>
                  <TableCell className={`text-right font-medium ${item.color}`}>
                    {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>Total de Despesas</TableCell>
                <TableCell className="text-center">
                  {data.despesasFixas.count + data.despesasVariaveis.count}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(data.totalDespesas)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
