"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { bankAccountsTable, ganhosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createGanhoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data: z.string().min(1, "Data é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const createGanhoAction = actionClient
  .schema(createGanhoSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(ganhosTable).values({
      id,
      userId: session.user.id,
      descricao: parsedInput.descricao,
      data: parsedInput.data,
      valor: parsedInput.valor,
      bankAccountId: parsedInput.bankAccountId,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/ganhos");

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

export const getGanhosAction = async (mes?: number, ano?: number) => {
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

  const ganhos = await db
    .select({
      id: ganhosTable.id,
      descricao: ganhosTable.descricao,
      data: ganhosTable.data,
      valor: ganhosTable.valor,
      bankAccountId: ganhosTable.bankAccountId,
      nomeBanco: bankAccountsTable.nomeBanco,
    })
    .from(ganhosTable)
    .leftJoin(
      bankAccountsTable,
      eq(ganhosTable.bankAccountId, bankAccountsTable.id)
    )
    .where(
      and(
        eq(ganhosTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${ganhosTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${ganhosTable.createdAt}) = ${filterAno}`
      )
    );

  return ganhos;
};

const updateGanhoSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data: z.string().min(1, "Data é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const updateGanhoAction = actionClient
  .schema(updateGanhoSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(ganhosTable)
      .set({
        descricao: parsedInput.descricao,
        data: parsedInput.data,
        valor: parsedInput.valor,
        bankAccountId: parsedInput.bankAccountId,
        updatedAt: new Date(),
      })
      .where(eq(ganhosTable.id, parsedInput.id));

    revalidatePath("/ganhos");

    return { success: true };
  });
