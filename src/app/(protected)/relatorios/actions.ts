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

export async function getRelatorioGeral(mes?: number, ano?: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const now = new Date();
  const filterMes = mes || now.getMonth() + 1;
  const filterAno = ano || now.getFullYear();

  // Total de Ganhos
  const ganhosResult = await db
    .select({
      total: sql<string>`COALESCE(SUM(${ganhosTable.valor}), 0)`,
      count: sql<number>`COUNT(*)`,
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
      count: sql<number>`COUNT(*)`,
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
      count: sql<number>`COUNT(*)`,
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
      count: sql<number>`COUNT(*)`,
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
      count: sql<number>`COUNT(*)`,
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
    mes: filterMes,
    ano: filterAno,
    ganhos: {
      total: totalGanhos,
      count: Number(ganhosResult[0]?.count || 0),
    },
    despesasFixas: {
      total: totalDespesasFixas,
      count: Number(despesasFixasResult[0]?.count || 0),
    },
    despesasVariaveis: {
      total: totalDespesasVariaveis,
      count: Number(despesasVariaveisResult[0]?.count || 0),
    },
    totalDespesas,
    dividas: {
      total: totalDividas,
      count: Number(dividasResult[0]?.count || 0),
    },
    investimentos: {
      total: totalInvestimentos,
      count: Number(investimentosResult[0]?.count || 0),
    },
    saldoDisponivel,
  };
}

export async function getRelatorioAnual(ano?: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const filterAno = ano || new Date().getFullYear();

  const meses = [];

  for (let mes = 1; mes <= 12; mes++) {
    const ganhosResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(${ganhosTable.valor}), 0)`,
      })
      .from(ganhosTable)
      .where(
        and(
          eq(ganhosTable.userId, session.user.id),
          sql`EXTRACT(MONTH FROM ${ganhosTable.createdAt}) = ${mes}`,
          sql`EXTRACT(YEAR FROM ${ganhosTable.createdAt}) = ${filterAno}`
        )
      );

    const despesasFixasResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(${despesaFixaTable.valor}), 0)`,
      })
      .from(despesaFixaTable)
      .where(
        and(
          eq(despesaFixaTable.userId, session.user.id),
          sql`EXTRACT(MONTH FROM ${despesaFixaTable.createdAt}) = ${mes}`,
          sql`EXTRACT(YEAR FROM ${despesaFixaTable.createdAt}) = ${filterAno}`
        )
      );

    const despesasVariaveisResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(${despesaVariavelTable.valor}), 0)`,
      })
      .from(despesaVariavelTable)
      .where(
        and(
          eq(despesaVariavelTable.userId, session.user.id),
          sql`EXTRACT(MONTH FROM ${despesaVariavelTable.createdAt}) = ${mes}`,
          sql`EXTRACT(YEAR FROM ${despesaVariavelTable.createdAt}) = ${filterAno}`
        )
      );

    const totalGanhos = parseFloat(ganhosResult[0]?.total || "0");
    const totalDespesas =
      parseFloat(despesasFixasResult[0]?.total || "0") +
      parseFloat(despesasVariaveisResult[0]?.total || "0");

    meses.push({
      mes,
      ganhos: totalGanhos,
      despesas: totalDespesas,
    });
  }

  return {
    ano: filterAno,
    meses,
  };
}
