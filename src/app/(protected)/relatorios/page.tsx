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

import { getRelatorioGeral } from "./actions";
import { RelatorioGeralContent } from "./components/relatorio-geral-content";

interface RelatoriosPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const RelatoriosPage = async ({ searchParams }: RelatoriosPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  const data = await getRelatorioGeral(mes, ano);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatório Geral</PageTitle>
          <PageDescription>
            Visão detalhada das suas finanças no período
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions />
      </PageHeader>

      <PageContent>
        {data ? (
          <RelatorioGeralContent data={data} />
        ) : (
          <p className="text-muted-foreground">
            Não foi possível carregar os dados.
          </p>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default RelatoriosPage;
