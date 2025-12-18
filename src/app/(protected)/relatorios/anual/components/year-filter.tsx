"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2020 + 6 }, (_, i) => ({
  value: String(2020 + i),
  label: String(2020 + i),
}));

export function YearFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYearParam =
    searchParams.get("ano") || String(new Date().getFullYear());

  const handleYearChange = (ano: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("ano", ano);
    router.push(pathname + "?" + newParams.toString());
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">Ano</span>
      <Select value={currentYearParam} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[120px]">
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
  );
}
