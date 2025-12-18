"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createInvestimentoAction, getBankAccountsAction } from "../actions";

const formSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  bankAccountId: z.string().min(1, "Banco é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

type BankAccount = {
  id: string;
  nomeBanco: string;
};

export function InvestimentoFormDialog() {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: "",
      valor: "",
      data: "",
      bankAccountId: "",
    },
  });

  const { execute, isPending } = useAction(createInvestimentoAction, {
    onSuccess: () => {
      toast.success("Investimento criado com sucesso!");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao criar investimento");
    },
  });

  useEffect(() => {
    const loadBankAccounts = async () => {
      const accounts = await getBankAccountsAction();
      setBankAccounts(accounts);
    };
    if (open) {
      loadBankAccounts();
    }
  }, [open]);

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Investimento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Investimento</DialogTitle>
          <DialogDescription>
            Adicione um novo investimento ao seu controle financeiro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Tesouro Direto, Ações, CDB..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
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
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bankAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um banco" />
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
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
