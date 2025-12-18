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

import { getCategoriesAction, updateDespesaFixaAction } from "../actions";

interface DespesaFixa {
  id: string;
  descricao: string;
  categoriaId: string;
  categoriaNome: string | null;
  valor: string;
  status: "pago" | "a_pagar" | "vencido";
  pagamentoMethod: string | null;
  dataPagamento: string | null;
  parcela: string | null;
}

interface DespesaFixaTableProps {
  despesas: DespesaFixa[];
}

const formSchema = z.object({
  id: z.string(),
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

type FormData = z.infer<typeof formSchema>;

type Category = {
  id: string;
  nomeCategoria: string;
};

const statusOptions = [
  { value: "pago", label: "Pago" },
  { value: "a_pagar", label: "A Pagar" },
  { value: "vencido", label: "Vencido" },
];

const paymentMethodOptions = [
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "transferencia_bancaria", label: "Transferência Bancária" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "outros", label: "Outros" },
];

function formatCurrency(value: string): string {
  const numValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pago":
      return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>;
    case "a_pagar":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">A Pagar</Badge>
      );
    case "vencido":
      return <Badge className="bg-red-500 hover:bg-red-600">Vencido</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function getPaymentMethodLabel(method: string | null): string {
  if (!method) return "-";
  const option = paymentMethodOptions.find((opt) => opt.value === method);
  return option?.label || method;
}

function formatDate(date: string | null): string {
  if (!date) return "-";
  // Evita problema de hydration com timezone
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function DespesaFixaTable({ despesas }: DespesaFixaTableProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDespesa, setSelectedDespesa] = useState<DespesaFixa | null>(
    null
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      descricao: "",
      categoriaId: "",
      valor: "",
      status: "a_pagar",
      pagamentoMethod: undefined,
      dataPagamento: "",
      parcela: "",
    },
  });

  const pagamentoMethod = form.watch("pagamentoMethod");

  const { execute, isPending } = useAction(updateDespesaFixaAction, {
    onSuccess: () => {
      toast.success("Despesa fixa atualizada com sucesso!");
      setOpen(false);
      setSelectedDespesa(null);
    },
    onError: (error) => {
      toast.error(error.error.serverError || "Erro ao atualizar despesa fixa");
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategoriesAction();
      setCategories(cats);
    };
    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (selectedDespesa) {
      form.reset({
        id: selectedDespesa.id,
        descricao: selectedDespesa.descricao,
        categoriaId: selectedDespesa.categoriaId,
        valor: selectedDespesa.valor,
        status: selectedDespesa.status,
        pagamentoMethod:
          selectedDespesa.pagamentoMethod as FormData["pagamentoMethod"],
        dataPagamento: selectedDespesa.dataPagamento || "",
        parcela: selectedDespesa.parcela || "",
      });
    }
  }, [selectedDespesa, form]);

  const handleRowClick = (despesa: DespesaFixa) => {
    setSelectedDespesa(despesa);
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
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Parcela</TableHead>
              <TableHead>Data Pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {despesas.map((despesa) => (
              <TableRow
                key={despesa.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(despesa)}
              >
                <TableCell className="font-medium">
                  {despesa.descricao}
                </TableCell>
                <TableCell>{despesa.categoriaNome || "-"}</TableCell>
                <TableCell>{formatCurrency(despesa.valor)}</TableCell>
                <TableCell>{getStatusBadge(despesa.status)}</TableCell>
                <TableCell>
                  {getPaymentMethodLabel(despesa.pagamentoMethod)}
                </TableCell>
                <TableCell>{despesa.parcela || "-"}</TableCell>
                <TableCell>{formatDate(despesa.dataPagamento)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Despesa Fixa</DialogTitle>
            <DialogDescription>
              Atualize as informações da sua despesa fixa.
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
                        placeholder="Ex: Aluguel, Internet, Luz..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.nomeCategoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
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
              </div>
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
