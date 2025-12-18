"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Separator } from "@/components/ui/separator";

import { updateBankAccountAction } from "../actions";

interface BankAccountCardProps {
  id: string;
  nomeBanco: string;
  agencia: string;
  numeroConta: string;
  chavePix: string | null;
  urlCartao: string | null;
  saldo: string;
}

const formSchema = z.object({
  id: z.string(),
  nomeBanco: z.string().min(1, "Nome do banco é obrigatório"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  numeroConta: z.string().min(1, "Número da conta é obrigatório"),
  chavePix: z.string().optional(),
  urlCartao: z.string().optional(),
  saldo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function formatCurrency(value: string): string {
  const numValue = parseFloat(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

export function BankAccountCard({
  id,
  nomeBanco,
  agencia,
  numeroConta,
  chavePix,
  urlCartao,
  saldo,
}: BankAccountCardProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      nomeBanco,
      agencia,
      numeroConta,
      chavePix: chavePix || "",
      urlCartao: urlCartao || "",
      saldo,
    },
  });

  const { execute, isPending } = useAction(updateBankAccountAction, {
    onSuccess: () => {
      toast.success("Conta bancária atualizada com sucesso!");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error.error.serverError || "Erro ao atualizar conta bancária"
      );
    },
  });

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <>
      <Card
        className="w-full max-w-sm cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="flex items-center justify-center pb-4">
          {urlCartao ? (
            <div className="relative h-40 w-full overflow-hidden rounded-lg">
              <Image
                src={urlCartao}
                alt={`Cartão ${nomeBanco}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900">
              <CreditCard className="h-16 w-16 text-white/50" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{nomeBanco}</h3>
            <p className="text-sm text-muted-foreground">
              Ag: {agencia} | Conta: {numeroConta}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">
              {chavePix ? `Pix: ${chavePix}` : "Sem chave Pix cadastrada"}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground">Saldo</p>
            <h2 className="text-2xl font-bold">{formatCurrency(saldo)}</h2>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Conta Bancária</DialogTitle>
            <DialogDescription>
              Atualize as informações da sua conta bancária.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nomeBanco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Banco</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Nubank, Itaú, Bradesco..."
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
                  name="agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroConta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Conta</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="chavePix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave Pix (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CPF, e-mail, telefone ou chave aleatória"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="urlCartao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Cartão (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="saldo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo</FormLabel>
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
