"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { categoriesTable, despesaVariavelTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createDespesaVariavelSchema = z.object({
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

export const createDespesaVariavelAction = actionClient
  .schema(createDespesaVariavelSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(despesaVariavelTable).values({
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

    revalidatePath("/despesas-variaveis");

    return { success: true };
  });

export const getDespesasVariaveisAction = async (
  mes?: number,
  ano?: number
) => {
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

  const despesasVariaveis = await db
    .select({
      id: despesaVariavelTable.id,
      descricao: despesaVariavelTable.descricao,
      categoriaId: despesaVariavelTable.categoriaId,
      categoriaNome: categoriesTable.nomeCategoria,
      valor: despesaVariavelTable.valor,
      status: despesaVariavelTable.status,
      pagamentoMethod: despesaVariavelTable.pagamentoMethod,
      dataPagamento: despesaVariavelTable.dataPagamento,
      parcela: despesaVariavelTable.parcela,
    })
    .from(despesaVariavelTable)
    .leftJoin(
      categoriesTable,
      eq(despesaVariavelTable.categoriaId, categoriesTable.id)
    )
    .where(
      and(
        eq(despesaVariavelTable.userId, session.user.id),
        sql`EXTRACT(MONTH FROM ${despesaVariavelTable.createdAt}) = ${filterMes}`,
        sql`EXTRACT(YEAR FROM ${despesaVariavelTable.createdAt}) = ${filterAno}`
      )
    );

  return despesasVariaveis;
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

const updateDespesaVariavelSchema = z.object({
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

export const updateDespesaVariavelAction = actionClient
  .schema(updateDespesaVariavelSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(despesaVariavelTable)
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
      .where(eq(despesaVariavelTable.id, parsedInput.id));

    revalidatePath("/despesas-variaveis");

    return { success: true };
  });
