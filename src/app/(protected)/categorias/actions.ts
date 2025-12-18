"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const createCategoriaSchema = z.object({
  nomeCategoria: z.string().min(1, "Nome da categoria é obrigatório"),
  iconCategoria: z.string().optional(),
});

export const createCategoriaAction = actionClient
  .schema(createCategoriaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(categoriesTable).values({
      id,
      userId: session.user.id,
      nomeCategoria: parsedInput.nomeCategoria,
      iconCategoria: parsedInput.iconCategoria || null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/categorias");

    return { success: true };
  });

export const getCategoriasAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const categorias = await db
    .select({
      id: categoriesTable.id,
      nomeCategoria: categoriesTable.nomeCategoria,
      iconCategoria: categoriesTable.iconCategoria,
    })
    .from(categoriesTable)
    .where(eq(categoriesTable.userId, session.user.id));

  return categorias;
};

const updateCategoriaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  nomeCategoria: z.string().min(1, "Nome da categoria é obrigatório"),
  iconCategoria: z.string().optional(),
});

export const updateCategoriaAction = actionClient
  .schema(updateCategoriaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(categoriesTable)
      .set({
        nomeCategoria: parsedInput.nomeCategoria,
        iconCategoria: parsedInput.iconCategoria || null,
        updatedAt: new Date(),
      })
      .where(eq(categoriesTable.id, parsedInput.id));

    revalidatePath("/categorias");

    return { success: true };
  });

const deleteCategoriaSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export const deleteCategoriaAction = actionClient
  .schema(deleteCategoriaSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, parsedInput.id));

    revalidatePath("/categorias");

    return { success: true };
  });
