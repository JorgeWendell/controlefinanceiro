"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

// Gera anos de 2020 até o ano atual + 5
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2020 + 6 }, (_, i) => ({
  value: String(2020 + i),
  label: String(2020 + i),
}));

export function PeriodFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pega mês e ano da URL ou usa o mês/ano atual
  const now = new Date();
  const currentMonth = searchParams.get("mes") || String(now.getMonth() + 1);
  const currentYearParam = searchParams.get("ano") || String(now.getFullYear());

  const createQueryString = useCallback(
    (params: { mes?: string; ano?: string }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.mes) newParams.set("mes", params.mes);
      if (params.ano) newParams.set("ano", params.ano);

      return newParams.toString();
    },
    [searchParams]
  );

  const handleMonthChange = (mes: string) => {
    router.push(pathname + "?" + createQueryString({ mes }));
  };

  const handleYearChange = (ano: string) => {
    router.push(pathname + "?" + createQueryString({ ano }));
  };

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex flex-col gap-1">
        <span className="hidden text-sm font-medium text-muted-foreground md:block">
          Mês
        </span>
        <Select value={currentMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[110px] md:w-[140px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="hidden text-sm font-medium text-muted-foreground md:block">
          Ano
        </span>
        <Select value={currentYearParam} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[80px] md:w-[100px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
