"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteCategoriaAction, updateCategoriaAction } from "../actions";

interface Categoria {
  id: string;
  nomeCategoria: string;
  iconCategoria: string | null;
}

interface CategoriaTableProps {
  categorias: Categoria[];
}

const formSchema = z.object({
  id: z.string(),
  nomeCategoria: z.string().min(1, "Nome da categoria é obrigatório"),
  iconCategoria: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CategoriaTable({ categorias }: CategoriaTableProps) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      nomeCategoria: "",
      iconCategoria: "",
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(
    updateCategoriaAction,
    {
      onSuccess: () => {
        toast.success("Categoria atualizada com sucesso!");
        setOpen(false);
        setSelectedCategoria(null);
      },
      onError: (error) => {
        toast.error(error.error.serverError || "Erro ao atualizar categoria");
      },
    }
  );

  const { execute: executeDelete, isPending: isDeleting } = useAction(
    deleteCategoriaAction,
    {
      onSuccess: () => {
        toast.success("Categoria excluída com sucesso!");
        setDeleteDialogOpen(false);
        setOpen(false);
        setSelectedCategoria(null);
      },
      onError: (error) => {
        toast.error(error.error.serverError || "Erro ao excluir categoria");
      },
    }
  );

  useEffect(() => {
    if (selectedCategoria) {
      form.reset({
        id: selectedCategoria.id,
        nomeCategoria: selectedCategoria.nomeCategoria,
        iconCategoria: selectedCategoria.iconCategoria || "",
      });
    }
  }, [selectedCategoria, form]);

  const handleRowClick = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setOpen(true);
  };

  const onSubmit = (data: FormData) => {
    executeUpdate(data);
  };

  const handleDelete = () => {
    if (selectedCategoria) {
      executeDelete({ id: selectedCategoria.id });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Ícone</TableHead>
              <TableHead>Nome da Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((categoria) => (
                <TableRow
                  key={categoria.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(categoria)}
                >
                  <TableCell className="text-2xl">
                    {categoria.iconCategoria || "📁"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {categoria.nomeCategoria}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nomeCategoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Alimentação, Transporte, Lazer..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconCategoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 🍔, 🚗, 🎮 ou nome do ícone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUpdating || isDeleting}>
                    {isUpdating ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A categoria &quot;
              {selectedCategoria?.nomeCategoria}&quot; será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
