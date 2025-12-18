import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderCenter,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { PeriodFilter } from "@/components/ui/period-filter";

import { DespesaFixaFormDialog } from "./components/despesa-fixa-form-dialog";
import { DespesaFixaList } from "./components/despesa-fixa-list";

interface DespesasFixasPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const DespesasFixasPage = async ({ searchParams }: DespesasFixasPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Despesas Fixas</PageTitle>
          <PageDescription>
            Gerencie suas despesas fixas mensais (aluguel, internet, etc.)
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions>
          <DespesaFixaFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DespesaFixaList mes={mes} ano={ano} />
      </PageContent>
    </PageContainer>
  );
};

export default DespesasFixasPage;
