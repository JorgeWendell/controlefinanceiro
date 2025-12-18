"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getBankAccountsAction, updateInvestimentoAction } from "../actions";

interface Investimento {
  id: string;
  descricao: string;
  valor: string;
  data: string;
  bankAccountId: string;
  nomeBanco: string | null;
}

interface InvestimentoTableProps {
  investimentos: Investimento[];
}

const formSchema = z.object({
  id: z.string(),
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

function formatCurrency(value: string): string {
  const numValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function InvestimentoTable({ investimentos }: InvestimentoTableProps) {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedInvestimento, setSelectedInvestimento] =
    useState<Investimento | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      descricao: "",
      valor: "",
      data: "",
      bankAccountId: "",
    },
  });

  const { execute, isPending } = useAction(updateInvestimentoAction, {
    onSuccess: () => {
      toast.success("Investimento atualizado com sucesso!");
      setOpen(false);
      setSelectedInvestimento(null);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao atualizar investimento");
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

  useEffect(() => {
    if (selectedInvestimento) {
      form.reset({
        id: selectedInvestimento.id,
        descricao: selectedInvestimento.descricao,
        valor: selectedInvestimento.valor,
        data: selectedInvestimento.data,
        bankAccountId: selectedInvestimento.bankAccountId,
      });
    }
  }, [selectedInvestimento, form]);

  const handleRowClick = (investimento: Investimento) => {
    setSelectedInvestimento(investimento);
    setOpen(true);
  };

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Banco</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investimentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhum investimento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              investimentos.map((investimento) => (
                <TableRow
                  key={investimento.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(investimento)}
                >
                  <TableCell className="font-medium">
                    {investimento.descricao}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {formatCurrency(investimento.valor)}
                  </TableCell>
                  <TableCell>{formatDate(investimento.data)}</TableCell>
                  <TableCell>{investimento.nomeBanco || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Investimento</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu investimento.
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
              <div className="grid grid-cols-2 gap-4">
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
