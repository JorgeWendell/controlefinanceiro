"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { bankAccountsTable, investimentosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createInvestimentoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const createInvestimentoAction = actionClient
  .schema(createInvestimentoSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(investimentosTable).values({
      id,
      userId: session.user.id,
      descricao: parsedInput.descricao,
      valor: parsedInput.valor,
      data: parsedInput.data,
      bankAccountId: parsedInput.bankAccountId,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/investimentos");

    return { success: true };
  });

export const getBankAccountsAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const bankAccounts = await db
    .select({
      id: bankAccountsTable.id,
      nomeBanco: bankAccountsTable.nomeBanco,
    })
    .from(bankAccountsTable)
    .where(eq(bankAccountsTable.userId, session.user.id));

  return bankAccounts;
};

export const getInvestimentosAction = async (mes?: number, ano?: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Usa mês/ano atual se não fornecido
  const now = new Date();
  const filterMes = mes || now.getMonth() + 1;
  const filterAno = ano || now.getFullYear();

  const investimentos = await db
    .select({
      id: investimentosTable.id,
      descricao: investimentosTable.descricao,
      valor: investimentosTable.valor,
      data: investimentosTable.data,
      bankAccountId: investimentosTable.bankAccountId,
      nomeBanco: bankAccountsTable.nomeBanco,
    })
    .from(investimentosTable)
    .leftJoin(
      bankAccountsTable,
      eq(investimentosTable.bankAccountId, bankAccountsTable.id)
    )
    .where(
      and(
        eq(investimentosTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${investimentosTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${investimentosTable.createdAt}) = ${filterAno}`
      )
    );

  return investimentos;
};

const updateInvestimentoSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const updateInvestimentoAction = actionClient
  .schema(updateInvestimentoSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(investimentosTable)
      .set({
        descricao: parsedInput.descricao,
        valor: parsedInput.valor,
        data: parsedInput.data,
        bankAccountId: parsedInput.bankAccountId,
        updatedAt: new Date(),
      })
      .where(eq(investimentosTable.id, parsedInput.id));

    revalidatePath("/investimentos");

    return { success: true };
  });
