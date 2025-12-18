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

import { getRelatorioGeral } from "../actions";
import { RelatorioMensalContent } from "./components/relatorio-mensal-content";

interface RelatorioMensalPageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>;
}

const RelatorioMensalPage = async ({
  searchParams,
}: RelatorioMensalPageProps) => {
  const params = await searchParams;
  const mes = params.mes ? parseInt(params.mes) : undefined;
  const ano = params.ano ? parseInt(params.ano) : undefined;

  const data = await getRelatorioGeral(mes, ano);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Relatório Mensal</PageTitle>
          <PageDescription>
            Análise detalhada do mês selecionado
          </PageDescription>
        </PageHeaderContent>
        <PageHeaderCenter>
          <PeriodFilter />
        </PageHeaderCenter>
        <PageActions />
      </PageHeader>

      <PageContent>
        {data ? (
          <RelatorioMensalContent data={data} />
        ) : (
          <p className="text-muted-foreground">
            Não foi possível carregar os dados.
          </p>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default RelatorioMensalPage;
