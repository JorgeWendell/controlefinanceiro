"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { bankAccountsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createBankAccountSchema = z.object({
  nomeBanco: z.string().min(1, "Nome do banco é obrigatório"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  numeroConta: z.string().min(1, "Número da conta é obrigatório"),
  chavePix: z.string().optional(),
  urlCartao: z.string().optional(),
  saldo: z.string().optional(),
});

export const createBankAccountAction = actionClient
  .schema(createBankAccountSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(bankAccountsTable).values({
      id,
      userId: session.user.id,
      nomeBanco: parsedInput.nomeBanco,
      agencia: parsedInput.agencia,
      numeroConta: parsedInput.numeroConta,
      chavePix: parsedInput.chavePix || null,
      urlCartao: parsedInput.urlCartao || null,
      saldo: parsedInput.saldo || "0",
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/contas-bancarias");

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
    .select()
    .from(bankAccountsTable)
    .where(eq(bankAccountsTable.userId, session.user.id));

  return bankAccounts;
};

const updateBankAccountSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  nomeBanco: z.string().min(1, "Nome do banco é obrigatório"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  numeroConta: z.string().min(1, "Número da conta é obrigatório"),
  chavePix: z.string().optional(),
  urlCartao: z.string().optional(),
  saldo: z.string().optional(),
});

export const updateBankAccountAction = actionClient
  .schema(updateBankAccountSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(bankAccountsTable)
      .set({
        nomeBanco: parsedInput.nomeBanco,
        agencia: parsedInput.agencia,
        numeroConta: parsedInput.numeroConta,
        chavePix: parsedInput.chavePix || null,
        urlCartao: parsedInput.urlCartao || null,
        saldo: parsedInput.saldo || "0",
        updatedAt: new Date(),
      })
      .where(eq(bankAccountsTable.id, parsedInput.id));

    revalidatePath("/contas-bancarias");

    return { success: true };
  });
