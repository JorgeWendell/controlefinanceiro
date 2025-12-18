"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Target, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  deleteMetaAction,
  getBankAccountsAction,
  updateMetaAction,
} from "../actions";

interface Meta {
  id: string;
  nome: string;
  valor: string;
  valorAtual: string;
  data: string;
  bankAccountId: string;
  nomeBanco: string | null;
}

interface MetaCardProps {
  meta: Meta;
}

const formSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  valorAtual: z.string().optional(),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

type BankAccount = {
  id: string;
  nomeBanco: string;
};

function formatCurrency(value: string): string {
  const numValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

function formatDate(date: string): string {
  // Evita problema de hydration com timezone
  // Formata YYYY-MM-DD para DD/MM/YYYY manualmente
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function calculateProgress(valorAtual: string, valorMeta: string): number {
  const atual = parseFloat(valorAtual) || 0;
  const meta = parseFloat(valorMeta) || 1;
  const progress = (atual / meta) * 100;
  return Math.min(progress, 100);
}

export function MetaCard({ meta }: MetaCardProps) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const progress = calculateProgress(meta.valorAtual, meta.valor);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: meta.id,
      nome: meta.nome,
      valor: meta.valor,
      valorAtual: meta.valorAtual,
      data: meta.data,
      bankAccountId: meta.bankAccountId,
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(
    updateMetaAction,
    {
      onSuccess: () => {
        toast.success("Meta atualizada com sucesso!");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.error.serverError || "Erro ao atualizar meta");
      },
    }
  );

  const { execute: executeDelete, isPending: isDeleting } = useAction(
    deleteMetaAction,
    {
      onSuccess: () => {
        toast.success("Meta excluída com sucesso!");
        setDeleteDialogOpen(false);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.error.serverError || "Erro ao excluir meta");
      },
    }
  );

  useEffect(() => {
    const loadBankAccounts = async () => {
      const accounts = await getBankAccountsAction();
      setBankAccounts(accounts);
    };
    if (open) {
      loadBankAccounts();
    }
  }, [open]);

  useEffect(() => {
    form.reset({
      id: meta.id,
      nome: meta.nome,
      valor: meta.valor,
      valorAtual: meta.valorAtual,
      data: meta.data,
      bankAccountId: meta.bankAccountId,
    });
  }, [meta, form]);

  const onSubmit = (data: FormData) => {
    executeUpdate(data);
  };

  const handleDelete = () => {
    executeDelete({ id: meta.id });
  };

  return (
    <>
      <Card
        className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{meta.nome}</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(meta.valor)}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valor)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Data prevista: {formatDate(meta.data)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription>
              Atualize as informações da sua meta financeira.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Meta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Viagem, Carro Novo, Reserva..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Meta</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valorAtual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Atual</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Prevista</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta Bancária</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma conta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.nomeBanco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A meta &quot;{meta.nome}&quot;
              será removida permanentemente.
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
