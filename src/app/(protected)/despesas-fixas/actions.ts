"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { categoriesTable, despesaFixaTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createDespesaFixaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.enum(["pago", "a_pagar", "vencido"]),
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
  dataPagamento: z.string().optional(),
  parcela: z.string().optional(),
});

export const createDespesaFixaAction = actionClient
  .schema(createDespesaFixaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(despesaFixaTable).values({
      id,
      userId: session.user.id,
      descricao: parsedInput.descricao,
      categoriaId: parsedInput.categoriaId,
      valor: parsedInput.valor,
      status: parsedInput.status,
      pagamentoMethod: parsedInput.pagamentoMethod || null,
      dataPagamento: parsedInput.dataPagamento || null,
      parcela: parsedInput.parcela || null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/despesas-fixas");

    return { success: true };
  });

export const getDespesasFixasAction = async (mes?: number, ano?: number) => {
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

  const despesasFixas = await db
    .select({
      id: despesaFixaTable.id,
      descricao: despesaFixaTable.descricao,
      categoriaId: despesaFixaTable.categoriaId,
      categoriaNome: categoriesTable.nomeCategoria,
      valor: despesaFixaTable.valor,
      status: despesaFixaTable.status,
      pagamentoMethod: despesaFixaTable.pagamentoMethod,
      dataPagamento: despesaFixaTable.dataPagamento,
      parcela: despesaFixaTable.parcela,
    })
    .from(despesaFixaTable)
    .leftJoin(
      categoriesTable,
      eq(despesaFixaTable.categoriaId, categoriesTable.id)
    )
    .where(
      and(
        eq(despesaFixaTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${despesaFixaTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${despesaFixaTable.createdAt}) = ${filterAno}`
      )
    );

  return despesasFixas;
};

export const getCategoriesAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const categories = await db
    .select({
      id: categoriesTable.id,
      nomeCategoria: categoriesTable.nomeCategoria,
    })
    .from(categoriesTable)
    .where(eq(categoriesTable.userId, session.user.id));

  return categories;
};

const updateDespesaFixaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.enum(["pago", "a_pagar", "vencido"]),
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
  dataPagamento: z.string().optional(),
  parcela: z.string().optional(),
});

export const updateDespesaFixaAction = actionClient
  .schema(updateDespesaFixaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(despesaFixaTable)
      .set({
        descricao: parsedInput.descricao,
        categoriaId: parsedInput.categoriaId,
        valor: parsedInput.valor,
        status: parsedInput.status,
        pagamentoMethod: parsedInput.pagamentoMethod || null,
        dataPagamento: parsedInput.dataPagamento || null,
        parcela: parsedInput.parcela || null,
        updatedAt: new Date(),
      })
      .where(eq(despesaFixaTable.id, parsedInput.id));

    revalidatePath("/despesas-fixas");

    return { success: true };
  });
