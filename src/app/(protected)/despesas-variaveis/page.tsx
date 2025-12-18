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

import { DespesaVariavelFormDialog } from "./components/despesa-variavel-form-dialog";
import { DespesaVariavelList } from "./components/despesa-variavel-list";

interface DespesasVariaveisPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const DespesasVariaveisPage = async ({
  searchParams,
}: DespesasVariaveisPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Despesas Variáveis</PageTitle>
          <PageDescription>
            Gerencie suas despesas variáveis (compras, lazer, etc.)
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions>
          <DespesaVariavelFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DespesaVariavelList mes={mes} ano={ano} />
      </PageContent>
    </PageContainer>
  );
};

export default DespesasVariaveisPage;
