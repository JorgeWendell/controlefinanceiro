"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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

import { updateDividaAction } from "../actions";

interface Divida {
  id: string;
  descricao: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valorPago: string | null;
  pagamentoMethod: string | null;
  parcela: string | null;
}

interface DividaTableProps {
  dividas: Divida[];
}

const formSchema = z.object({
  id: z.string(),
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

type FormData = z.infer<typeof formSchema>;

const paymentMethodOptions = [
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "transferencia_bancaria", label: "Transferência Bancária" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "outros", label: "Outros" },
];

function formatCurrency(value: string | null): string {
  if (!value) return "-";
  const numValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

function formatDate(date: string | null): string {
  if (!date) return "-";
  // Evita problema de hydration com timezone
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getPaymentMethodLabel(method: string | null): string {
  if (!method) return "-";
  const option = paymentMethodOptions.find((opt) => opt.value === method);
  return option?.label || method;
}

function getStatusBadge(divida: Divida) {
  // Usa Date.now() para comparação consistente
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const [year, month, day] = divida.dataVencimento.split("-");
  const vencimento = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  if (divida.dataPagamento) {
    return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
  }

  if (vencimento < hoje) {
    return <Badge className="bg-red-500 hover:bg-red-600">Vencido</Badge>;
  }

  return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>;
}

export function DividaTable({ dividas }: DividaTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedDivida, setSelectedDivida] = useState<Divida | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      descricao: "",
      valor: "",
      dataVencimento: "",
      dataPagamento: "",
      valorPago: "",
      pagamentoMethod: undefined,
      parcela: "",
    },
  });

  const pagamentoMethod = form.watch("pagamentoMethod");

  const { execute, isPending } = useAction(updateDividaAction, {
    onSuccess: () => {
      toast.success("Dívida atualizada com sucesso!");
      setOpen(false);
      setSelectedDivida(null);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao atualizar dívida");
    },
  });

  useEffect(() => {
    if (selectedDivida) {
      form.reset({
        id: selectedDivida.id,
        descricao: selectedDivida.descricao,
        valor: selectedDivida.valor,
        dataVencimento: selectedDivida.dataVencimento,
        dataPagamento: selectedDivida.dataPagamento || "",
        valorPago: selectedDivida.valorPago || "",
        pagamentoMethod:
          selectedDivida.pagamentoMethod as FormData["pagamentoMethod"],
        parcela: selectedDivida.parcela || "",
      });
    }
  }, [selectedDivida, form]);

  const handleRowClick = (divida: Divida) => {
    setSelectedDivida(divida);
    setOpen(true);
  };

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Parcela</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dividas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhuma dívida cadastrada
                </TableCell>
              </TableRow>
            ) : (
              dividas.map((divida) => (
                <TableRow
                  key={divida.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(divida)}
                >
                  <TableCell className="font-medium">
                    {divida.descricao}
                  </TableCell>
                  <TableCell>{formatCurrency(divida.valor)}</TableCell>
                  <TableCell>{formatDate(divida.dataVencimento)}</TableCell>
                  <TableCell>{getStatusBadge(divida)}</TableCell>
                  <TableCell>{formatCurrency(divida.valorPago)}</TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(divida.pagamentoMethod)}
                  </TableCell>
                  <TableCell>{divida.parcela || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dívida</DialogTitle>
            <DialogDescription>
              Atualize as informações da sua dívida.
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
                        placeholder="Ex: Empréstimo, Financiamento, Cartão..."
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
                      <FormLabel>Valor Total</FormLabel>
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
                  name="dataVencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="valorPago"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago</FormLabel>
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
                  name="dataPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Pagamento</FormLabel>
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
                name="pagamentoMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {pagamentoMethod === "credito" && (
                <FormField
                  control={form.control}
                  name="parcela"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcela</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 1/12, 3/10, 5/24..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
    </>
  );
}
