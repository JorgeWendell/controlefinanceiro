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

import { GanhoFormDialog } from "./components/ganho-form-dialog";
import { GanhoList } from "./components/ganho-list";

interface GanhosPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const GanhosPage = async ({ searchParams }: GanhosPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Ganhos</PageTitle>
          <PageDescription>
            Gerencie todos os seus ganhos e receitas
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions>
          <GanhoFormDialog />
        </PageActions>
      </PageHeader>

      <PageContent>
        <GanhoList mes={mes} ano={ano} />
      </PageContent>
    </PageContainer>
  );
};

export default GanhosPage;
