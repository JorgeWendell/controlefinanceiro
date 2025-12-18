"use server";

import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  despesaFixaTable,
  despesaVariavelTable,
  dividasTable,
  ganhosTable,
  investimentosTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getDashboardSummary(mes?: number, ano?: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      totalGanhos: 0,
      totalDespesas: 0,
      totalDividas: 0,
      totalInvestimentos: 0,
      saldoDisponivel: 0,
    };
  }

  const now = new Date();
  const filterMes = mes || now.getMonth() + 1;
  const filterAno = ano || now.getFullYear();

  // Total de Ganhos
  const ganhosResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${ganhosTable.valor}), 0)`,
    })
    .from(ganhosTable)
    .where(
      and(
        eq(ganhosTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${ganhosTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${ganhosTable.createdAt}) = ${filterAno}`
      )
    );

  // Total de Despesas Fixas
  const despesasFixasResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${despesaFixaTable.valor}), 0)`,
    })
    .from(despesaFixaTable)
    .where(
      and(
        eq(despesaFixaTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${despesaFixaTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${despesaFixaTable.createdAt}) = ${filterAno}`
      )
    );

  // Total de Despesas Variáveis
  const despesasVariaveisResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${despesaVariavelTable.valor}), 0)`,
    })
    .from(despesaVariavelTable)
    .where(
      and(
        eq(despesaVariavelTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${despesaVariavelTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${despesaVariavelTable.createdAt}) = ${filterAno}`
      )
    );

  // Total de Dívidas
  const dividasResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${dividasTable.valor}), 0)`,
    })
    .from(dividasTable)
    .where(
      and(
        eq(dividasTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${dividasTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${dividasTable.createdAt}) = ${filterAno}`
      )
    );

  // Total de Investimentos
  const investimentosResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${investimentosTable.valor}), 0)`,
    })
    .from(investimentosTable)
    .where(
      and(
        eq(investimentosTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${investimentosTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${investimentosTable.createdAt}) = ${filterAno}`
      )
    );

  const totalGanhos = parseFloat(ganhosResult[0]?.total || "0");
  const totalDespesasFixas = parseFloat(despesasFixasResult[0]?.total || "0");
  const totalDespesasVariaveis = parseFloat(
    despesasVariaveisResult[0]?.total || "0"
  );
  const totalDespesas = totalDespesasFixas + totalDespesasVariaveis;
  const totalDividas = parseFloat(dividasResult[0]?.total || "0");
  const totalInvestimentos = parseFloat(investimentosResult[0]?.total || "0");
  const saldoDisponivel =
    totalGanhos - totalDespesas - totalDividas - totalInvestimentos;

  return {
    totalGanhos,
    totalDespesas,
    totalDividas,
    totalInvestimentos,
    saldoDisponivel,
  };
}
