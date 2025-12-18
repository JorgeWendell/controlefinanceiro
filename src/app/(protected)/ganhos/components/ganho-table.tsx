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

import { getBankAccountsAction, updateGanhoAction } from "../actions";

interface Ganho {
  id: string;
  descricao: string;
  data: string;
  valor: string;
  bankAccountId: string;
  nomeBanco: string | null;
}

interface GanhoTableProps {
  ganhos: Ganho[];
}

const formSchema = z.object({
  id: z.string(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data: z.string().min(1, "Data é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
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
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function GanhoTable({ ganhos }: GanhoTableProps) {
  const [open, setOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedGanho, setSelectedGanho] = useState<Ganho | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      descricao: "",
      data: "",
      valor: "",
      bankAccountId: "",
    },
  });

  const { execute, isPending } = useAction(updateGanhoAction, {
    onSuccess: () => {
      toast.success("Ganho atualizado com sucesso!");
      setOpen(false);
      setSelectedGanho(null);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao atualizar ganho");
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
    if (selectedGanho) {
      form.reset({
        id: selectedGanho.id,
        descricao: selectedGanho.descricao,
        data: selectedGanho.data,
        valor: selectedGanho.valor,
        bankAccountId: selectedGanho.bankAccountId,
      });
    }
  }, [selectedGanho, form]);

  const handleRowClick = (ganho: Ganho) => {
    setSelectedGanho(ganho);
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
            {ganhos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum ganho cadastrado
                </TableCell>
              </TableRow>
            ) : (
              ganhos.map((ganho) => (
                <TableRow
                  key={ganho.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(ganho)}
                >
                  <TableCell className="font-medium">
                    {ganho.descricao}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatCurrency(ganho.valor)}
                  </TableCell>
                  <TableCell>{formatDate(ganho.data)}</TableCell>
                  <TableCell>{ganho.nomeBanco || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Ganho</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu ganho.
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
                        placeholder="Ex: Salário, Freelance, Investimento..."
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
