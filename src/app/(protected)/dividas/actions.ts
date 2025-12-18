"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { dividasTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createDividaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  dataPagamento: z.string().optional(),
  valorPago: z.string().optional(),
  pagamentoMethod: z
    .enum([
      "debito",
      "credito",
      "transferencia_bancaria",
      "dinheiro",
      "pix",
      "outros",
    ])
    .optional(),
  parcela: z.string().optional(),
});

export const createDividaAction = actionClient
  .schema(createDividaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(dividasTable).values({
      id,
      userId: session.user.id,
      descricao: parsedInput.descricao,
      valor: parsedInput.valor,
      dataVencimento: parsedInput.dataVencimento,
      dataPagamento: parsedInput.dataPagamento || null,
      valorPago: parsedInput.valorPago || null,
      pagamentoMethod: parsedInput.pagamentoMethod || null,
      parcela: parsedInput.parcela || null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/dividas");

    return { success: true };
  });

export const getDividasAction = async (mes?: number, ano?: number) => {
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

  const dividas = await db
    .select({
      id: dividasTable.id,
      descricao: dividasTable.descricao,
      valor: dividasTable.valor,
      dataVencimento: dividasTable.dataVencimento,
      dataPagamento: dividasTable.dataPagamento,
      valorPago: dividasTable.valorPago,
      pagamentoMethod: dividasTable.pagamentoMethod,
      parcela: dividasTable.parcela,
    })
    .from(dividasTable)
    .where(
      and(
        eq(dividasTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${dividasTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${dividasTable.createdAt}) = ${filterAno}`
      )
    );

  return dividas;
};

const updateDividaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  dataPagamento: z.string().optional(),
  valorPago: z.string().optional(),
  pagamentoMethod: z
    .enum([
      "debito",
      "credito",
      "transferencia_bancaria",
      "dinheiro",
      "pix",
      "outros",
    ])
    .optional(),
  parcela: z.string().optional(),
});

export const updateDividaAction = actionClient
  .schema(updateDividaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(dividasTable)
      .set({
        descricao: parsedInput.descricao,
        valor: parsedInput.valor,
        dataVencimento: parsedInput.dataVencimento,
        dataPagamento: parsedInput.dataPagamento || null,
        valorPago: parsedInput.valorPago || null,
        pagamentoMethod: parsedInput.pagamentoMethod || null,
        parcela: parsedInput.parcela || null,
        updatedAt: new Date(),
      })
      .where(eq(dividasTable.id, parsedInput.id));

    revalidatePath("/dividas");

    return { success: true };
  });
