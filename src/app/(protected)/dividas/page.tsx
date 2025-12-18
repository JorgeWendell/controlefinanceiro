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

import { DividaFormDialog } from "./components/divida-form-dialog";
import { DividaList } from "./components/divida-list";

interface DividasPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const DividasPage = async ({ searchParams }: DividasPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dívidas</PageTitle>
          <PageDescription>
            Gerencie suas dívidas e acompanhe os pagamentos
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions>
          <DividaFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DividaList mes={mes} ano={ano} />
      </PageContent>
    </PageContainer>
  );
};

export default DividasPage;
