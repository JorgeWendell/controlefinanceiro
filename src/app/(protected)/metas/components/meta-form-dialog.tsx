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

import { createMetaAction, getBankAccountsAction } from "../actions";

const formSchema = z.object({
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

export function MetaFormDialog() {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      valor: "",
      valorAtual: "0",
      data: "",
      bankAccountId: "",
    },
  });

  const { execute, isPending } = useAction(createMetaAction, {
    onSuccess: () => {
      toast.success("Meta cadastrada com sucesso!");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao cadastrar meta");
    },
  });

  useEffect(() => {
    const loadBankAccounts = async () => {
      const accounts = await getBankAccountsAction();
      setBankAccounts(accounts);
    };
    loadBankAccounts();
  }, []);

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>
            Defina uma nova meta financeira para acompanhar seu progresso.
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
                      placeholder="Ex: Viagem, Carro Novo, Reserva de Emergência..."
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                {isPending ? "Salvando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
