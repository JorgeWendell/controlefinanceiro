"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { bankAccountsTable, metasTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createMetaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  valorAtual: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const createMetaAction = actionClient
  .schema(createMetaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(metasTable).values({
      id,
      userId: session.user.id,
      nome: parsedInput.nome,
      valor: parsedInput.valor,
      valorAtual: parsedInput.valorAtual || "0",
      data: parsedInput.data,
      bankAccountId: parsedInput.bankAccountId,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/metas");

    return { success: true };
  });

export const getMetasAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const metas = await db
    .select({
      id: metasTable.id,
      nome: metasTable.nome,
      valor: metasTable.valor,
      valorAtual: metasTable.valorAtual,
      data: metasTable.data,
      bankAccountId: metasTable.bankAccountId,
      nomeBanco: bankAccountsTable.nomeBanco,
    })
    .from(metasTable)
    .leftJoin(
      bankAccountsTable,
      eq(metasTable.bankAccountId, bankAccountsTable.id)
    )
    .where(eq(metasTable.userId, session.user.id));

  return metas;
};

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

const updateMetaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  valorAtual: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

export const updateMetaAction = actionClient
  .schema(updateMetaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(metasTable)
      .set({
        nome: parsedInput.nome,
        valor: parsedInput.valor,
        valorAtual: parsedInput.valorAtual || "0",
        data: parsedInput.data,
        bankAccountId: parsedInput.bankAccountId,
        updatedAt: new Date(),
      })
      .where(eq(metasTable.id, parsedInput.id));

    revalidatePath("/metas");

    return { success: true };
  });

const deleteMetaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const deleteMetaAction = actionClient
  .schema(deleteMetaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db.delete(metasTable).where(eq(metasTable.id, parsedInput.id));

    revalidatePath("/metas");

    return { success: true };
  });
