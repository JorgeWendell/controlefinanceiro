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

import { InvestimentoFormDialog } from "./components/investimento-form-dialog";
import { InvestimentoList } from "./components/investimento-list";

interface InvestimentosPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const InvestimentosPage = async ({ searchParams }: InvestimentosPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Investimentos</PageTitle>
          <PageDescription>
            Gerencie seus investimentos e acompanhe seu patrimônio
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions>
          <InvestimentoFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <InvestimentoList mes={mes} ano={ano} />
      </PageContent>
    </PageContainer>
  );
};

export default InvestimentosPage;
